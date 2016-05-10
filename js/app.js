var map, infowindow;
localStorage.placeData = localStorage.placeData ? localStorage.placeData : "";

function initMap() {
    var customMapType = new google.maps.StyledMapType([
        {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [{
                "visibility": "on"
			}]
		}, {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{
                "visibility": "off"
			}]
		}, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{
                "color": "#bfbfbf"
			}]
		}, {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{
                "color": "#ebebeb"
			}]
		}, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
                "visibility": "simplified"
			}, {
                "color": "#006699"
			}]
		}, {
            "featureType": "road.highway",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
			}]
  }]);
    var customMapTypeId = 'custom_style';

    map = new google.maps.Map(document.getElementById('map'), {
        center: 
        {
            lat: 52.160114,
            lng: 4.497010
        },
        zoom: 15,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
    });
    map.mapTypes.set(customMapTypeId, customMapType);
    map.setMapTypeId(customMapTypeId);
    infowindow = new google.maps.InfoWindow();

    function placeMapper(place) {
        //Here goes the stuff for the Infowindow
        var infowindowContent = "<h3>" + place.Place + "</h3><br><p>" + place.City + "<br/>" + '<a href="' + place.Website + '">Link to digitized objects</a>' + "</p>";
        //Here goes the stuff for the Datatable
        var row = $("<tr>" + "<td>" + place.Place + "</td>" + "<td>" + place.City + "</td>" + "<td>" + place.Place + "</td>" + "<td>" + place.lat + "</td>" + "<td>" + place.lng + "</td>" + "<td>" + place.Quantity + "</td>" + "<td>" + '<a href="' + place.Website + '">Link to digitized manuscripts</a>' + "</td>" + "</tr>");
        var clickToggle = function () {
            map.setCenter({
                lat: place.lat,
                lng: place.lng
            });
            map.setZoom(12);
            infowindow.setContent(infowindowContent);
            infowindow.open(map, marker);
            row.parent().find('tr').removeClass('bolderText');
            row.addClass('bolderText');
        }
        $("#datatablex").find('tbody').append(row);

        var marker = new google.maps.Marker({
            position: {
                lat: place.lat,
                lng: place.lng
            },
            map: map,
            title: place.Place
        });
        row.click(clickToggle);
        marker.addListener('click', clickToggle);
    }
    $(document).ready(function () {
        $.get('js/data.json', function (tabledata) {
            if (tabledata instanceof Array) {
                tabledata = tabledata.concat(JSON.parse("[" + localStorage.placeData.slice(0, -1) + "]") || []);
            } else {
                console.log("AJAX error");
                tabledata = JSON.parse("[" + localStorage.placeData.slice(0, -1) + "]") || [];
            }
            tabledata.map(placeMapper);
            //Datatable options go here!
            $('#datatablex').DataTable({
                responsive: true,
                "columnDefs": [
                    {
                        "targets": [3],
                        "visible": false,
                        "searchable": false
            },
                    {
                        "targets": [4],
                        "visible": false,
                        "searchable": false
            }
        ]
            });
        });
    });
}