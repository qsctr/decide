navigator.geolocation.getCurrentPosition(function (pos) {
    var loc = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    var map = new google.maps.Map(document.querySelector('#map'), {
        center: loc,
        zoom: 17
    });
    var service = new google.maps.places.PlacesService(map);
    var button = document.querySelector('#button');
    var marker;
    button.addEventListener('click', function () {
        button.textContent = "DECIDING...";
        if (marker) marker.setMap(null);
        service.radarSearch({
            location: loc,
            radius: 500,
            type: 'restaurant'
        }, function (results, status) {
            if (badStatus(status)) return;
            var place = results[Math.floor(Math.random() * results.length)];
            var placeLoc = place.geometry.location;
            service.getDetails(place, function (result2, status2) {
                if (badStatus(status2)) return;
                marker = new google.maps.Marker({
                    map: map,
                    position: placeLoc
                });
                map.panTo(placeLoc);
                document.querySelector('#place-name').textContent = result2.name;
                button.textContent = "DECIDE AGAIN";
            });
        });
    });
    function badStatus(s) {
        if (s !== google.maps.places.PlacesServiceStatus.OK) {
            alert('Error: ' + s);
            return true;
        }
        return false;
    }
    navigator.geolocation.watchPosition(function (pos2) {
        loc = new google.maps.LatLng(pos2.coords.latitude, pos2.coords.longitude);
    });
}, function (err) {
    alert('Error ' + err.code + ': ' + err.message);
});