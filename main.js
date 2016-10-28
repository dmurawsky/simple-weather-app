(function() {

    var fiveDay = "http://api.openweathermap.org/data/2.5/forecast/daily?q=Atlanta,ga&units=imperial&cnt=5&appid=6b4fec3cfeb666ed226daff42cb09a95";
    var dayMap = ['today', 'tomorrow', 'thirdDay', 'fourthDay', 'fifthDay'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var imgs = {
        "Clear":"img/art_clear.png",
        "Clouds":"img/art_clouds.png",
        "Fog":"img/art_fog.png",
        "Light Clouds":"img/art_light_clouds.png",
        "Light Rain":"img/art_light_rain.png",
        "Rain":"img/art_rain.png",
        "Snow":"img/art_snow.png",
        "Storm":"img/art_storm.png"
    };
    var json;

    // Call the weather API 
    ajax(fiveDay, function(resp){
        json = resp;
        document.getElementById("loading").style.display = "none";
        for (var i=0; i<dayMap.length; i++){
            displayDetails(formatDetails(dayMap[i], json.list[i]));
        }
        hashChange();
        setFavicon(imgs[json.list[0].weather[0].main]);
    });

    // watches for the hash to change in the menu
    window.addEventListener("hashchange", hashChange);

    // Populate the appropriate elements with the associated data
    function displayDetails(details){
        var keys = Object.keys(details);
        for (var i=0; i<keys.length; i++){
            var elem = document.getElementById(keys[i]);
            if (elem && details[keys[i]])
                elem.innerHTML = details[keys[i]];
            else if (elem)
                elem.style.display = "none";
        }
    }

    // Format the data from the API in a an iterable format
    function displayIcon(id, imgSrc){
        var elem = document.getElementById(id);
        if (elem) 
            elem.src = imgSrc;
    }

    // Format the data from the API in a an iterable format
    function formatDetails(day, json){
        var obj = {};
        var d = new Date(0);
        d.setUTCSeconds(json.dt);
        if (day!=='today' && day!=='tomorrow') 
            obj[day+"-weekday"] = weekdays[d.getDay()];
        obj[day+"-date"] = dateFormat(d);
        obj[day+"-description"] = json.weather[0].main;
        obj[day+"-high"] = Math.floor(json.temp.max)+'&deg;';
        obj[day+"-low"] = Math.floor(json.temp.min)+'&deg;';
        obj[day+"-humidity"] = Math.floor(json.humidity)+"%";
        obj[day+"-wind"] = Math.floor(json.speed)+" km/h";
        obj[day+"-direction"] = getWindDirection(json.deg);
        obj[day+"-pressure"] = Math.floor(json.pressure)+" hpa";
        displayIcon(day+"-icon", imgs[json.weather[0].main]);
        return obj;
    }

    // Find the direction string associated with the degrees from the api
    function getWindDirection(deg){
        var arr = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
        var val = Math.floor((deg/22.5)+.5);
        return arr[(val % 16)];
    }

    // Takes a date object and retruns a formated string
    function dateFormat(d){
        return months[d.getMonth()]+" "+d.getDate();
    }

    // Creates and calls the XHR, then calls the callback
    function ajax(url, cb) {
        try {
            var x = new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
            x.open('GET', url, 1);
            x.onreadystatechange = function () {
                x.readyState > 3 && cb && cb(JSON.parse(x.responseText), x);
            };
            x.send()
        } catch (e) {;
            window.console && console.log(e);
        }
    }

    // Called on hashchange and changes views to and from home and detail pages based on location hash in the address bar
    function hashChange() {
        var hash = window.location.hash.slice(1);
        var ind = dayMap.indexOf(hash);
        console.log(hash, ind)
        if(hash && ind)
            detailPage(ind);
        else
            homePage();
    }

    // Populates the detail page with the appropriate data then hides the home page and shows the detail page
    function detailPage(ind){
        displayDetails(formatDetails('detail', json.list[ind]));
        // console.log(json.list[ind]);
        document.getElementById("homepage").style.display = "none";
        document.getElementById("detailpage").style.display = "block";
    }

    // Hides the detail page and shows the home page
    function homePage(){
        document.getElementById("homepage").style.display = "block";
        document.getElementById("detailpage").style.display = "none";
    }
    
    // Sets the favicon to todays forcast icon
    function setFavicon(imgSrc) {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = imgSrc;
        document.getElementsByTagName('head')[0].appendChild(link);
    }
})();
    