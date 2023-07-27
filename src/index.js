/**
 * The extractData function takes sourceData as input and processes it to extract relevant weather information for each day. 
 * It retrieves the town and country from the input data, combines them into the area variable, and logs the extracted data. 
 * It then iterates through the weather data for each day, mapping and transforming specific attributes to create an array 
 * of objects (outputParts) containing weather details for different day parts (Morning, Day, Evening, and Night). 
 * Finally, it returns an object with the days array containing weather information for all days and the area string 
 * representing the location.
 * @param {*} sourceData 
 * @returns an object with two properties: days and area.
 */
function extractData(sourceData) {
    console.log("extracting data from", sourceData);
    const town = sourceData.nearest_area[0].areaName[0].value;
    const country = sourceData.nearest_area[0].country[0].value;
    const area = (`${town},${country}`);

    console.log("area", area);
    const days = [...sourceData.weather].map(day => {

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
        console.log("date", date);
        console.log("This is the extracted data", outputParts);
        return outputParts;
    });
    return {
        days, area
    };

    // console.log(days);
}

/**
 * This maps the weather codes to the icons, so the correct icon is fetched for each weather code.
 */
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

/**
 * The onDomContentLoaded function logs a message, adds a "keyup" event listener to an element with ID "location-text," 
 * and calls the geoFindMe function.
 */
function onDomContentLoaded() {
    console.log("DOM fully loaded and parsed");
    const input = document.querySelector("#location-text");
    if (input) {
        input.addEventListener("keyup", keyboardHandler);
    }
    geoFindMe();
}

/**
 * The updateStatus function updates the content of the HTML element 
 * with the ID "status" by setting it to the provided message.
 * @param {*} message 
 */
function updateStatus(message) {
    const els = document.querySelector('#status');
    els.innerHTML = message;
}

/**
 * The updateView function takes data as input, extracts information for the current day and area, 
 * generates HTML content for different day parts, and displays it on the web page with a fade-in effect.
 * @param {*} data 
 */
function updateView(data) {
    const { days, area } = extractData(data);
    const today = days[0];
    const morning = generateHTML(today[0]);
    const afternoon = generateHTML(today[1])
    const evening = generateHTML(today[2]);
    const night = generateHTML(today[3]);
    const allDayParts = [morning, afternoon, evening, night].join('');
    const el = document.querySelector('#output-data');
    el.innerHTML = allDayParts;
    el.classList.add("data-present");
    updateStatus(`Displaying information for: ${area}`);

    // Tell the CSS to make the content fade in after a couple of seconds
    setTimeout(() => {
        el.classList.add("cards-visible");
    }, 1000);
}

/**
 * The geoFindMe function retrieves the user's geolocation coordinates and displays weather data for that location on the web page 
 * using the updateView function. If geolocation is not supported, it shows an error message using updateStatus.
 */
function geoFindMe() {

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("your position is: ", latitude, longitude);
        getWeatherFromLocation(`${latitude},${longitude}`).then(updateView);
    }

    function error() {
        console.error("Unable to retrieve your location");
        updateStatus(`Unable to retrieve your location`);
    }

    if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser");
    } else {
        updateStatus("Locating…");
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

    updateStatus(`Loading..`);
    // fetches data from API
    try {
        const response = await fetch(`https://wttr.in/${location}?format=j1`);
        // const response = await fetch(`data.json`);
        // turning the response body text into JSON
        const data = await response.json();
        // logging
        console.log(data.current_condition[0].weatherDesc[0].value);
        console.log(typeof data);

        return data;
    }
    catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
        updateStatus(`Error loading data`);
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

/**
 * This function will take the user's input and turn it into a variable that can be user by the cityData() function
 */
function onLocationSearchClick() {
    const locat = document.getElementById("location-text").value;
    getWeatherFromLocation(locat).then(updateView);
}

/**
 * Starts to search when enter key is pressed
 */
function keyboardHandler(e) {
    if (e.key.toLowerCase() === "enter") {
        onLocationSearchClick();
    }
}