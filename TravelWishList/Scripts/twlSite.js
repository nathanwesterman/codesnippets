
//Gets the Wiki Infomation for the selected country
function getCountrySummary(data) {
    var a = JSON.stringify(data)
    var b = JSON.parse(a)

    document.getElementById("countrySummary").innerHTML = "";
    document.getElementById("locationSummary").innerHTML = "";

    $("#countrySummary").html(b.geonames[0].summary);

}

//Gets a list of a nearby hotels - should have been extended for other information...
function getLocationSummary(data) {
    var a = JSON.stringify(data)
    var b = JSON.parse(a)

    for (var i = 0; i < b.geonames.length; i++) {
        var obj = b.geonames[i];

        var cName;
        var cValue;

        for (var key in obj) {
            cName = key;
            cValue = obj[key].toString();

            if (cName == 'toponymName') {
                $("#locationSummary").append("<a role='button' class='btn btn-link'  target='_blank' href='http://www.expedia.com.au/Hotel-Search?#&destination=" + cValue + "'>" + cValue + "</a>");
            }
        }
    }
}

//Takes the coutnry informations and updates the small country info panel underneath the country choice
function countryInfo(data) {

    document.getElementById("citiesPanel").style.display = "none";

    var a = JSON.stringify(data)
    var b = JSON.parse(a)

    //Co-ords
    document.getElementById('countryNorth').value = b.geonames[0].north
    document.getElementById('countrySouth').value = b.geonames[0].south
    document.getElementById('countryEast').value = b.geonames[0].east
    document.getElementById('countryWest').value = b.geonames[0].west

    //Country Info 
    document.getElementById('infoContinent').innerHTML = "Continent: " + b.geonames[0].continentName
    document.getElementById('infoSize').innerHTML = "Area Size: " + b.geonames[0].areaInSqKm
    document.getElementById('infoPopulation').innerHTML = "Population: " + b.geonames[0].population
    document.getElementById('infoCurrency').innerHTML = "Currency: " + b.geonames[0].currencyCode

    //References
    document.getElementById('RefgeonameId').value = b.geonames[0].geonameId
    document.getElementById('RefgeonameId').value = b.geonames[0].geonameId

    getLocationInfo();

}

//location info - debug
function locationInfo(data) {
   // $("#fullLocation").html(JSON.stringify(data));
}
           
//Called from the country drown down and queries the geonames service 
function getCountryInfo() {
    var e = document.getElementById("country");
    var strCountry = e.options[e.selectedIndex].value;
    twlGeo.getGeoNames('countryInfo', { country: strCountry }, countryInfo)
}


//Uses country information to get a list of locations 
function getLocationInfo() {

    var north = document.getElementById("countryNorth").value;
    var south = document.getElementById("countrySouth").value;
    var east = document.getElementById("countryEast").value;
    var west = document.getElementById("countryWest").value;

    var curCit = "north: '" + String(north) + "', south:'" + String(south) + "', east:'" + String(east) + "', west:'" + String(west) + "'";
    twlGeo.getGeoNames('cities', { north: north, south: south, east: east, west: west }, locationInfo)
    twlGeo.getGeoNames('wikipediaBoundingBox', { north: north, south: south, east: east, west: west }, getCountrySummary)

    var locBut = document.getElementById("locBut")
    var locButVis = document.getElementById("locBut").style.display
    var citInfo = document.getElementById("citiesPanel")

    var e = document.getElementById("country");
    var strCountry = e.options[e.selectedIndex].value;

    var strLocation = document.getElementById("locations").value;

    if (locButVis == "block" || strCountry == "") {
        locBut.style.display = "none"
    } else {
        locBut.style.display = "block"

    }
}

//Updates the map marker based on lng and lat of location selected
function getLocationDetails() {

    var e = document.getElementById("locations");
    var strLocation = e.options[e.selectedIndex].value;

    document.getElementById("locationSummary").innerHTML = "Hotels in the area :";

    var latlong = strLocation.split("|");
    var lat = latlong[0]
    var lng = latlong[1]

    twlGeo.getGeoNames('findNearbyPlaceName', { lat: lat, lng: lng, radius: 50 }, getLocationSummary)

    var myLatlng = new google.maps.LatLng(lat, lng);

    var mapOptions = {
        zoom: 4,
        center: myLatlng,
      
    }
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        animation: google.maps.Animation.DROP,

    });
}
