var Jimp = require("jimp");

//Справочник символов для капчи
var simbols = "QWERTYUPASDFGHJKLZXCVBNMqwertyuopasdfghjkzxcvbnm123456789";
//Справочник названий файлов с разным фоном
var sourseImg = ["source01.png", "source02.png", "source03.png"];

//Функция возвращает случайный элемент из словаря
function rand(lib){
	return lib[Math.floor(Math.random()*((lib.length-1) + 1))];
}

module.exports = function getCaptcha(callback){
	Jimp.read(rand(sourseImg), function (err, source) {
		if (err) return callback(err);
		Jimp.loadFont(Jimp.FONT_SANS_32_BLACK, function (err, font) {
			if(err) return callback(err);
			var str = '';
			for(var i=0; i<6; i++){
				str+=rand(simbols);
			}
			source.print(font, 3, 5, str[0] + str[1])
				.print(font, 43, 5, str[2] + str[3])
				.print(font, 83, 5, str[4] + str[5])
				.pixelate(0,0, 120, 50)
				.getBuffer(Jimp.MIME_PNG, function(err, buffer){
					callback(err, str, buffer);
				});
			
		});	
	});
}