$.ready = function(){
  var socket = io.connect('http://localhost:8080');

  $('#container').html('<div id="map"></div>');

  var map = L.map('map').setView([59.927090, 30.338154], 13);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  var drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
          rectangle:false,
          polyline: false,
          polygon: false,
          circle: false,
          marker: true
      },
      edit: {
          featureGroup: drawnItems,
          remove: true
      }
  });
  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, function (e) {
      var type = e.layerType,
              layer = e.layer;

      var latlng = layer.getLatLng();
      //наполняем и открываем модельное окно
      $("#myModal").find('[name="name"]').val('');
      $("#myModal").find('[name="latitude"]').val(latlng.lat);
      $("#myModal").find('[name="longitude"]').val(latlng.lng);
      $("#myModal").find('.btn-primary').one('click', function(){
        //отправляем данные на сервер
        var name = $("#myModal").find('[name="name"]').val();
        socket.emit('newData', {
          name:name,
          geo:[latlng.lat, latlng.lng]
        });
        //ставим метку на карту
        if (type === 'marker') {
            layer.bindPopup(name);
        }

        drawnItems.addLayer(layer);
      });

      $("#myModal").find('.btn-primary').one('click', function(){
        //отправляем данные на сервер
        var name = $("#myModal").find('[name="name"]').val();
        socket.emit('newGeoData', {
          name:name,
          geo:[latlng.lat, latlng.lng]
        });
        //ставим метку на карту
        if (type === 'marker') {
            layer.bindPopup(name);
        }

        drawnItems.addLayer(layer);
        $("#myModal").modal('hide');
      });

      $("#myModal").modal('show');
  });

  $('#find').find('button').on('click', function(){
    var query = $('#find').find('input').val();
    socket.emit('query', {name:query});
  })
  
  socket.on('query', function(arr){
	  console.log(arr);
	  if(arr.length === 0){
		  alert('Ничего не найдено!');
	  } else {
		  for(var i = 0; i<arr.length; i++){
			  L.marker(arr[i].geo).addTo(map)
				.bindPopup(arr[i].name)
				.openPopup();
		  }
	  }
  });
}
