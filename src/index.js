function extractdata(sourcedata) {

    const town = sourcedata.nearest_area[0].areaName[0].value;
    const country = sourcedata.nearest_area[0].country[0].value;
    const area = (`${town},${country}`);
    
    console.log(area);
    const days = [...sourcedata.weather].map(day => {
       
        const date = day.date;
        const dayParts = [day.hourly[2], day.hourly[4], day.hourly[6], day.hourly[0]];
        const outputParts = dayParts.map(part => {
            const labels = {
                "0": "Night",
                "600": 'Morning',
                "1200": "Day",
                "1800": "Evening"
            };

            return {
                
                cc: part.weatherDesc[0].value,
                label: labels[part.time],
                weatherCode: part.weatherCode,
                weatherIcon: weathercodes2icons[part.weatherCode],
                temperature: part.tempC,
                feelsLike: part.FeelsLikeC,
                winddir: part.winddir16Point,
                windspeed: part.WindGustKmph,
                rainfall: part.precipMM,
                hum: part.humidity,
                press: part.pressure,
                vis: part.visibility,
                cloud: part.cloudcover,
                uv: part.uvIndex,
            }
        });
        console.log(date, outputParts);
        return outputParts;
    });
    return {
        days, area
    };
    
    // console.log(days);
}

const weathercodes2icons = {
    "unknown": "wi-stars",
    "116": "wi-cloud",
    "143": "wi-fog",
    "248": "wi-fog",
    "260": "wi-fog",
    "302": "wi-rain",
    "308": "wi-rain",
    "359": "wi-rain",
    "299": "wi-showers",
    "305": "wi-showers",
    "356": "wi-showers",
    "329": "wi-snow",
    "332": "wi-snow",
    "338": "wi-snow",
    "335": "wi-snow",
    "371": "wi-snow",
    "395": "wi-snow",
    "266": "wi-day-rain",
    "293": "wi-day-rain",
    "296": "wi-day-rain",
    "176": "wi-day-showers",
    "263": "wi-day-showers",
    "353": "wi-day-showers",
    "182": "wi-day-sleet",
    "185": "wi-day-sleet",
    "281": "wi-day-sleet",
    "284": "wi-day-sleet",
    "311": "wi-day-sleet",
    "314": "wi-day-sleet",
    "317": "wi-day-sleet",
    "350": "wi-day-sleet",
    "377": "wi-day-sleet",
    "179": "wi-day-rain-mix",
    "362": "wi-day-rain-mix",
    "365": "wi-day-rain-mix",
    "374": "wi-day-rain-mix",
    "227": "wi-day-snow",
    "320": "wi-day-snow",
    "323": "wi-day-snow",
    "326": "wi-day-snow",
    "368": "wi-day-snow",
    "113": "wi-day-sunny",
    "389": "wi-lightning",
    "200": "wi-storm-showers",
    "386": "wi-storm-showers",
    "392": "wi-day-snow-thunderstorm",
    "122": "wi-cloudy",
}

function onDomContentLoaded() {
    console.log("DOM fully loaded and parsed");
    // fetches data extracts it and inserts it into the page
    
    geoFindMe();
}


function geoFindMe() {
  
    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
        console.log("your position is: ",latitude, longitude);
        getWeatherFromLocation(`${latitude},${longitude}`).then(data => {
            // const htmlstring = generateHTML(data)
            // const el = document.querySelector("#cc");
            //  el.innerHTML = htmlstring
            const {days,area} = extractdata(data);
            const today = days[0];
            const morning = generateHTML(today[0]);
            const afternoon = generateHTML(today[1])
            const evening = generateHTML(today[2]);
            const night = generateHTML(today[3]);
            const allDayParts = [morning, afternoon,evening,night].join('');
            const el = document.querySelector('#output-data');
            const els = document.querySelector('#status');
            el.innerHTML = allDayParts;
            els.innerHTML = `Displaying information for: ${area}`;
        });
    }
  
    function error() {
      console.error("Unable to retrieve your location");
    }
  
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
    } else {
      console.log("Locating…");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }
  

/**
 * The DOMContentLoaded event fires when the HTML document has been completely parsed
 * it creates a listener that listens for the DOMContentLoaded event, and starts the onDomContentLoaded function
 */
window.addEventListener("DOMContentLoaded", onDomContentLoaded);



/**
 * this is an asynchronous function that takes the parameter city and gets the data from the API and returns the data.
 * @param {string} city 
 * @returns object weather data of the location. see example data.json
 */
async function getWeatherFromLocation(location) {
    const el = document.querySelector('#status');
    el.innerHTML = `loading..`;
    // fetches data from API
    try {
        const response = await fetch(`https://wttr.in/${location}?format=j1`);
        // turning the response body text into JSON
        const data = await response.json();
        // logging
        console.log(data.current_condition[0].weatherDesc[0].value);
        console.log(typeof data);
       
        return data;
    }
    catch (error) {
        alert("There has been a problem with your fetch operation:", error);
        el.innerHTML = `Error loading data`;
    }
}

/**
 * Takes the data and populates the HTML template
 * @param {object} daypart 
 * @returns string HTML with populated data.
 */
function generateHTML(daypart) {
    console.log(daypart);
    const {
        label, cc, weatherIcon, temperature, feelsLike, winddir, windspeed, rainfall, hum, press, vis, cloud, uv
    } = daypart;


    // const cc = daypart.current_condition[0].weatherDesc[0].value;
    // const weatherCode = daypart.current_condition[0].weatherCode;
    // const weatherIcon = weathercodes2icons[weatherCode];
    // const temperature = daypart.current_condition[0].temp_C;
    // const feelsLike = daypart.current_condition[0].FeelsLikeC;
    // const winddir = daypart.current_condition[0].winddir16Point;
    // const windspeed = daypart.current_condition[0].windspeedKmph;
    // const rainfall = daypart.current_condition[0].precipMM;
    // const hum = daypart.current_condition[0].humidity;
    // const press = daypart.current_condition[0].pressure;
    // const vis = daypart.current_condition[0].visibility;
    // const cloud = daypart.current_condition[0].cloudcover;
    // const uv = daypart.current_condition[0].uvIndex;

    return `
    <div class="card-wrap">
        <div class="title">
            ${label}
        </div>
        <div class="grid-container">
            <div class="grid-item">
                <i class="wi ${weatherIcon} weatherfont"></i>
            </div>
            <div class="grid-item">
                <span>${cc}</span><br />
                <span class="temper"><i class="wi wi-thermometer"></i> ${temperature}°C</span><br />
                <span>Feels like ${feelsLike}°C</span>
            </div>
            <div class="grid-item">
                <span><i class="wi wi-wind towards-sse winddirect"></i> ${winddir}</span><br>
                <span> <i class="wi wi-small-craft-advisory"></i> ${windspeed}km/h</span><br>
            </div>
            <div class="grid-item">
                <span><i class="wi wi-umbrella"></i> ${rainfall} mm</span><br>
                <span><i class="wi wi-humidity"></i> ${hum}%</span>
            </div>
            <div class="grid-item">
                <span><i class="wi wi-barometer"></i> ${press} hPa</span><br>
                <span>&#128065; ${vis} km</span>
            </div>
            <div class="grid-item">
                <span><i class="wi wi-cloud"></i> ${cloud}% cover</span> <br>
                <span>UV index: ${uv}</span>
            </div>

        </div>
    </div>
    `;
}


{/* <input type= "text" id = "text" class="location-input" placeholder="Enter location here:" size="50"></input>
    <button onclick="clicked()">ENTER</button> */}

/**
 * This function will take the user's input and turn it into a variable that can be user by the cityData() function
 */
function clicked() {
    var locat = document.getElementById("text").value;

}