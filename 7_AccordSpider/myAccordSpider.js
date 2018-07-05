let https = require('https');
let cheerio = require('cheerio'); //Сторонняя библиотека наподобие jQuery
let fs = require('fs');

//Функция скачивает контент по переданной ссылке
function download(url, callback) {
	console.log('Task: ' + url);
	https.get(url, function(res) {
		console.log("Got response: " + res.statusCode);
		let content = '';
		res.on('data', function(chunk) {
			content += chunk;
		});
		res.on('end', function() {
			console.log('Downloaded site: ' + url);
			callback(null, content);
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		callback(e);
	});
}

//Функция парсит страницу музыкальной группы
function parseMusicGroupPage(content){
	$ = cheerio.load(content);
	//Получаем название группы
	let dirname = $('.artist-profile__info h1').text();
	//Получаем список ссылок на песни
	let pagesArr = $('#tablesort tbody tr a').map(function(i,el){
		return {
			url:$(el).attr('href'),
			name:$(el).text()
		}
	}).toArray();
	return {
		dirname, 
		pagesArr
	}
}

//Функция парсит содержимое страницы с песней 
//и возвращает только текст песни с аккордами
function parseSongPage(content){
	$ = cheerio.load(content);
	//Получаем текст песни
	return $('pre').text();
}

//Функция проверяет наличие директории с названием музыкальной группы
function cheackExistAndCreateDirectory(dirname, callback){
	let pathToDir = __dirname + '\\' + dirname;
	fs.stat(pathToDir, function(err, stats){
		if (err){
			if(err.errno === -4058) {
				//Нет такой директории можно создать
				fs.mkdir(pathToDir, function(err){
					if(err) return callback(err);
					callback(pathToDir);
				})
			} else {
				return callback(err);
			}
		}
		callback(null, pathToDir);
	});
}

//Функция проверяет наличие файла с похожим названием песни, если есть повтор, то изменяется название
//и сохраняет текст песни с аккордами в файл
function cheackExistAndCreateFile(pathToSave, filename, content, callback){
	function iterator(index){
		let pathToFile = pathToSave + '\\' + filename + ((index===0)?'':index.toString()) + '.txt';
		fs.stat(pathToFile, function(err, stats){
			if (err){
				if(err.errno === -4058) {
					//Нет такого файла можно создать
					fs.writeFile(pathToFile, content, {encoding:'utf8'}, function(err){
						if(err) return callback(err);
						console.log("Save file: " + pathToFile + '\n');
						callback();
					})
				} else {
					return callback(err);
				}
			} else {
				//Для формирования нового названия запускаем себя ещё раз но с новым индексом
				iterator(++index);
			}
		});
	}
	iterator(0);
}

//Функция получает массив объектов, хранящих названия песни и ссылки на них
function spiderLink(pages, pathToSave, callback){
	function iterator(index){
		if(index === pages.length) {
			return callback();
		}
		//Загрузка страницы
		setTimeout(function(){
			let url = 'https:' + pages[index].url;
			download(url, function(err, content){
				if(err) return callback(err);
				//Вызов обработки страницы
				let textSong = parseSongPage(content);
				//Создаем файл для песни
				cheackExistAndCreateFile(pathToSave, pages[index].name, textSong, function(err){
					if(err) return callback(err);
					iterator(++index);
				})
			});
		}, getRandom(3000, 6000));		
	}
	
	iterator(0);
}
//Генерация случайного числа используется для формирования 
//времени задержки между запросами
function getRandom(min, max){
	return Math.floor(Math.random()*(max-min + 1) + min);
}

//Функция запрашивает основную страницу музыкальной группы и формирует
//массив с объектами, хранящими ссылки на песни
function spider(url, callback){
	//Скачиваем страницу группы
	download(url, function(err, content){
		if(err) return callback(err);
		//Получаем имя группы и ссылки на аккорды
		let oData = parseMusicGroupPage(content);
		//Создаем папку для группы
		cheackExistAndCreateDirectory(oData.dirname, function(err, pathToSave){
			if(err) return callback(err);
			//Запускаем последовательную обработку каждой ссылки на аккорды
			spiderLink(oData.pagesArr, pathToSave, callback);
		});
	});
}

/*В первый аргумент передается ссылка на страницу группы на сайте amdm.ru:
process.argv[2] например: https://amdm.ru/akkordi/daykiri/ */
spider(process.argv[2], (err) => {  
	if(err) {
		console.log(err);
	} else {
		console.log("All songs downloaded and saved to files!")
	}
});