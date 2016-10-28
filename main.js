(function() {

    var fiveDay = "http://api.openweathermap.org/data/2.5/forecast/daily?q=Atlanta,ga&units=imperial&cnt=5&appid=6b4fec3cfeb666ed226daff42cb09a95";
    var dayMap = ['today', 'tomorrow', 'thirdDay', 'fourthDay', 'fifthDay'];
    var json;

    // Call the weather API 
    ajax(fiveDay, function(resp){
        json = resp;
        for (var i=0; i<dayMap.length; i++){
            displayDetails(formatDetails(dayMap[i], json.list[i]));
        }
    });

    // watches for the hash to change in the menu
    window.addEventListener("hashchange", handleEvent);

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
    function formatDetails(day, json){
        var obj = {};
        var d = new Date(0);
        d.setUTCSeconds(json.dt);
        if (day!=='today' && day!=='tomorrow') 
            obj[day+"-weekday"] = weekday(d);
        obj[day+"-date"] = dateFormat(d);
        obj[day+"-description"] = json.weather[0].main;
        obj[day+"-high"] = Math.floor(json.temp.max)+'&deg;';
        obj[day+"-low"] = Math.floor(json.temp.min)+'&deg;';
        obj[day+"-humidity"] = Math.floor(json.humidity)+"%";
        obj[day+"-wind"] = Math.floor(json.speed)+" km/h";
        obj[day+"-direction"] = getWindDirection(json.deg);
        obj[day+"-pressure"] = Math.floor(json.pressure)+" hpa";
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
        return monthName(d.getMonth())+" "+d.getDate();
    }

    // Returns the month string associated with the getMonth() number
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

    // Returns the weekday string associated with the getDay() number
    function weekday(d){
        var num = d.getDay();
        switch (num){
            case 0: return "Sunday";
            case 1: return "Monday";
            case 2: return "Tuesday";
            case 3: return "Wednesday";
            case 4: return "Thursday";
            case 5: return "Friday";
            case 6: return "Saturday";
            default: return "Invalid Day";
        }
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
    function handleEvent() {
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
})();
    