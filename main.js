ajax('http://api.openweathermap.org/data/2.5/weather?q=Atlanta,ga&units=imperial&appid=6b4fec3cfeb666ed226daff42cb09a95', function(json){
  var d = new Date(0);
  d.setUTCSeconds(json.dt);
  document.title = 'Forecast for '+json.name;
  document.getElementById('today-date').innerHTML = dateFormat(d);
  document.getElementById('today-description').innerHTML = json.weather[0].description;
  document.getElementById('today-high').innerHTML = Math.floor(json.main.temp_max);
  document.getElementById('today-low').innerHTML = Math.floor(json.main.temp_min);
  document.getElementById('today-humidity').innerHTML = Math.floor(json.main.humidity)+"%";
  document.getElementById('today-wind').innerHTML = Math.floor(json.wind.speed)+" km/h";
  document.getElementById('today-pressure').innerHTML = Math.floor(json.main.pressure)+" hpa";
});

function dateFormat(d){
    return monthName(d.getMonth())+" "+d.getDate();
}

function monthName(num){
    switch (num){
        case 0: return "Jan";
        case 1: return "Feb";
        case 2: return "Mar";
        case 3: return "Apr";
        case 4: return "May";
        case 5: return "Jun";
        case 6: return "Jul";
        case 7: return "Aug";
        case 8: return "Sep";
        case 9: return "Oct";
        case 10: return "Nov";
        case 11: return "Dec";
        default: return "Invalid Month";
    }
}

function ajax(url, callback) {
    try {
        var x = new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
        x.open('GET', url, 1);
        x.onreadystatechange = function () {
            x.readyState > 3 && callback && callback(JSON.parse(x.responseText), x);
        };
        x.send()
    } catch (e) {;
        window.console && console.log(e);
    }
};