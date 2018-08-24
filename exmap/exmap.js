var map;
var markerCount = 0;
var infoBoxes=[];

function initMap()
{
	var image = {
		url: 'gym.png',
		size: new google.maps.Size(32, 32),
		anchor: new google.maps.Point(16, 16)
	};
  
	map = new google.maps.Map(document.getElementById('map'),
	{
		center: {lat: 40.635388, lng: 22.944737},
		zoom: 12,
		styles: [    
			{
				featureType: "poi",
				elementType: "labels",
				stylers: [{ visibility: "off" }]
			}
		]
	});

	map.data.loadGeoJson(
            'https://skg.blackwaterfestival.com/exmap/data/l12_s2cells.geojson');
	map.data.setStyle({
          fillOpacity:0.0,
		  strokeOpacity:0.3
        });
		
	function addMarkerToMap(lat, lng, htmlMarkupForInfoWindow)
	{
		//var infobox = new InfoBox({
		var infoBox = new InfoBox({
			content: htmlMarkupForInfoWindow,
			disableAutoPan: false,
			maxWidth: 150,
			pixelOffset: new google.maps.Size(-140, 0),
			zIndex: null,
			boxStyle: {
						background: "url('https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/infobox/examples/tipbox.gif') no-repeat",
						opacity: 1,
						width: "210px"
				},
			closeBoxMargin: "0px 0px 0px 0px",
			closeBoxURL: "",
			infoBoxClearance: new google.maps.Size(1, 1)
		});
		
		
		var myLatLng = new google.maps.LatLng(lat, lng);
		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			animation: google.maps.Animation.DROP,
			icon: image
		});
		
		//Gives each marker an Id for the on click
		infoBoxes[markerCount] = infoBox;

		//Creates the event listener for clicking the marker
		//and places the marker on the map 
		google.maps.event.addListener(marker, 'click', (function(marker, markerCount) {
			return function() {
				infoBox.open(map, marker);
			}
		})(marker, markerCount));  
		
		 
	}
	
	function addGym(gymName, lat, lng, img, additionalInfo)
	{
		markerCount++;
		
		var content = 	"<div class='card text-center' style='width: 13rem;'>"+
							"<div id='img-container' style='position: relative; display: inline-block;'>"+
								"<img class='card-img-top' src='"+img+"' alt='Image of "+gymName+"'>"+
	"<button onclick='infoBoxes["+markerCount+"].close()' id='close-card-button' class='btn btn-danger' style='margin-top:-25px; top:12%; right:0%; position: absolute; display:block;'>X</button>"+
							"</div>"+
							"<div class='card-body'>"+
								"<h5 class='card-title'>"+gymName+"</h5>"+
								"<p class='card-text'>"+additionalInfo+"</p>"+
								"<a target='_blank' href='http://www.google.com/maps/place/"+lat+","+lng+"' class='btn btn-primary'>Google Maps</a>"+
							"</div>"+
						"</div>";
							
		addMarkerToMap(lat, lng, content);
	}
	
	function addYourLocationButton(map, marker) 
	{
		var controlDiv = document.createElement('div');

		var firstChild = document.createElement('button');
		firstChild.style.backgroundColor = '#fff';
		firstChild.style.border = 'none';
		firstChild.style.outline = 'none';
		firstChild.style.width = '28px';
		firstChild.style.height = '28px';
		firstChild.style.borderRadius = '2px';
		firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
		firstChild.style.cursor = 'pointer';
		firstChild.style.marginRight = '10px';
		firstChild.style.padding = '0px';
		firstChild.title = 'Your Location';
		controlDiv.appendChild(firstChild);

		var secondChild = document.createElement('div');
		secondChild.style.margin = '5px';
		secondChild.style.width = '18px';
		secondChild.style.height = '18px';
		secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
		secondChild.style.backgroundSize = '180px 18px';
		secondChild.style.backgroundPosition = '0px 0px';
		secondChild.style.backgroundRepeat = 'no-repeat';
		secondChild.id = 'you_location_img';
		firstChild.appendChild(secondChild);

		google.maps.event.addListener(map, 'dragend', function() {
			$('#you_location_img').css('background-position', '0px 0px');
		});

		firstChild.addEventListener('click', function() {
			var imgX = '0';
			var animationInterval = setInterval(function(){
				if(imgX == '-18') imgX = '0';
				else imgX = '-18';
				$('#you_location_img').css('background-position', imgX+'px 0px');
			}, 500);
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					marker.setPosition(latlng);
					map.setCenter(latlng);
					clearInterval(animationInterval);
					$('#you_location_img').css('background-position', '-144px 0px');
				});
			}
			else{
				clearInterval(animationInterval);
				$('#you_location_img').css('background-position', '0px 0px');
			}
		});

		controlDiv.index = 1;
		map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
	}
	
	function extraInfo(timesGiven, lastDate)
	{
		return "<dl class='row' >"+
				  "<dt class='col-sm-5'>EX Raids hosted</dt>"+
				  "<dd class='col-sm-7' style='vertical-align:middle'><h6>"+timesGiven+"</h6></dd>"+
				"</dl>"+
				"<dl class='row' style='vertical-align:middle'>"+
				  "<dt class='col-sm-5'>Last Wave</dt>"+
				  "<dd class='col-sm-7' style='vertical-align:middle'><h6>"+lastDate+"</h6></dd>"+
				"</dl>";
	}
	
	// Kentro
	addGym("Tsamis Karatassos", 40.632802, 22.954412, "gyms/tsamis.jpg", extraInfo(17,"August 2nd, 2018"));
	addGym("Άγαλμα Αριστοτέλη", 40.632155, 22.940976, "gyms/aristotelis.jpg", extraInfo(13,"August 10th, 2018"));
	addGym("Ι.Ν. Αγίου Παντελεήμονα", 40.63304, 22.950962, "gyms/panteleimonas.jpg", extraInfo(12,"August 2nd, 2018"));
	addGym("Ι.Ν. Αγιας Σοφίας", 40.632897, 22.946293, "gyms/agiasofia.jpg", extraInfo(10,"August 10th, 2018"));
	addGym("Antigonidon Fountain", 40.640481, 22.940274, "gyms/antigonidon.jpg", extraInfo(3,"March 8th, 2018"));
	addGym("Μνημειο Βασιλεα Κωνσταντινου", 40.640169, 22.935456, "gyms/mnhmeiovasilea.jpg", extraInfo(7,"June 4th, 2018"));
	addGym("Athanasios Diakos Statue", 40.632647, 22.954282, "gyms/diakos.jpg", extraInfo(3,"August 2nd, 2018"));
	// Anatolika
	addGym("Abstract Statue", 40.602307, 22.950325, "gyms/abstract.jpg", extraInfo(9,"July 25th, 2018"));
	addGym("Il Contri Sculpture", 40.61604, 22.972625, "gyms/ilcontri.jpg", extraInfo(3,"July 11th, 2018"));
	addGym("Municipal Gallery of Thessaloniki", 40.599059, 22.954524, "gyms/municipal.jpg", extraInfo(5,"June 20th, 2018"));
	addGym("Πλατεία Χαριλάου", 40.602896, 22.969715, "gyms/plateiaxarilaou.jpg", extraInfo(1,"July 25th, 2018"));
	addGym("Silver Ball Park", 40.596994, 22.965032, "gyms/silverball.jpg", extraInfo(1,"July 25th, 2018"));
	addGym("Perevou Playground", 40.609671, 22.984303, "gyms/perevouplayground.jpg", extraInfo(1,"July 4th, 2018"));
	// Dytika
	addGym("Jerzy Szajnowicz Iwanow", 40.645497, 22.935425, "gyms/jerzy.jpg", extraInfo(1,"March 15th, 2018"));
	addGym("Τερψιθεα", 40.66, 22.932178, "gyms/terpsithea.jpg", extraInfo(1,"June 4th, 2018"));
	addGym("ΚΟΚΚΙΝΗ ΠΛΑΤΕΙΑ", 40.661275, 22.928278, "gyms/kokkinhplateia.jpg", extraInfo(1,"July 11th, 2018"));
	addGym("Playground Plastira", 40.65756, 22.923786, "gyms/playgroundplastira.jpg", extraInfo(1,"August 24th, 2018"));
	// Thermi
	addGym("Mnhmeio 353000 pontiwn pesontwn", 40.54699, 23.019868, "gyms/mnhmeio353000.jpg", extraInfo(5,"July 25th, 2018"));
	// Wraiokastro
	addGym("Μνημείο Γενοκτονίας Ποντιακού Ελληνισμού", 40.726908, 22.914826, "gyms/mnhmeiogenoktonias.jpg", extraInfo(1,"January 4th, 2018"));
	
	/*// Kentro
	addGym("Tsamis Karatassos", 40.632802, 22.954412, "gyms/tsamis.jpg", extraInfo(17,"August 2nd, 2018"));
	addGym("Άγαλμα Αριστοτέλη", 40.632155,22.940976, "gyms/aristotelis.jpg", "");
	addGym("Ι.Ν. Αγίου Παντελεήμονα", 40.63304,22.950962, "gyms/panteleimonas.jpg", "");
	addGym("Ι.Ν. Αγιας Σοφίας", 40.632897,22.946293, "gyms/agiasofia.jpg", "");
	addGym("Antigonidon Fountain", 40.640481,22.940274, "gyms/antigonidon.jpg", "");
	addGym("Μνημειο Βασιλεα Κωνσταντινου", 40.640169,22.935456, "gyms/mnhmeiovasilea.jpg", "");
	addGym("Athanasios Diakos Statue", 40.632647,22.954282, "gyms/diakos.jpg", "");
	// Anatolika
	addGym("Abstract Statue", 40.602307,22.950325, "gyms/abstract.jpg", "");
	addGym("Il Contri Sculpture", 40.61604,22.972625, "gyms/ilcontri.jpg", "");
	addGym("Municipal Gallery of Thessaloniki", 40.599059,22.954524, "gyms/municipal.jpg", "");
	addGym("Πλατεία Χαριλάου", 40.602896,22.969715, "gyms/plateiaxarilaou.jpg", "");
	addGym("Silver Ball Park", 40.596994,22.965032, "gyms/silverball.jpg", "");
	addGym("Perevou Playground", 40.609671,22.984303, "gyms/perevouplayground.jpg", "");
	// Dytika
	addGym("Jerzy Szajnowicz Iwanow", 40.645497,22.935425, "gyms/jerzy.jpg", "");
	addGym("Τερψιθεα", 40.660000, 22.932178, "gyms/terpsithea.jpg", "");
	addGym("ΚΟΚΚΙΝΗ ΠΛΑΤΕΙΑ", 40.661275,22.928278, "gyms/kokkinhplateia.jpg", "");
	// Thermi
	addGym("Mnhmeio 353000 pontiwn pesontwn", 40.54699, 23.019868, "gyms/mnhmeio353000.jpg", "");
	// Wraiokastro
	addGym("Μνημείο Γενοκτονίας Ποντιακού Ελληνισμού", 40.726908,22.914826, "gyms/mnhmeiogenoktonias.jpg", "");*/
	
	var myMarker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: {lat:0.000, lng:0.000}
    });
	addYourLocationButton(map, myMarker);
}