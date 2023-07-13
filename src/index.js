
const weatherSymbols = {
    "Unknown": "✨",
    "119": "☁️",
    "143": "🌫",
    "248": "🌫",
    "260": "🌫",
    "302": "🌧",
    "308": "🌧",
    "359": "🌧",
    "299": "🌧",
    "305": "🌧",
    "356": "🌧",
    "329": "❄️",
    "332": "❄️",
    "338": "❄️",
    "335": "❄️",
    "371": "❄️",
    "395": "❄️",
    "266": "🌦",
    "293": "🌦",
    "296": "🌦",
    "176": "🌦",
    "263": "🌦",
    "353": "🌦",
    "182": "🌧",
    "185": "🌧",
    "281": "🌧",
    "284": "🌧",
    "311": "🌧",
    "314": "🌧",
    "317": "🌧",
    "350": "🌧",
    "377": "🌧",
    "179": "🌧",
    "362": "🌧",
    "365": "🌧",
    "374": "🌧",
    "227": "🌨",
    "320": "🌨",
    "323": "🌨",
    "326": "🌨",
    "368": "🌨",
    "116": "⛅️",
    "113": "☀️",
    "389": "🌩",
    "200": "⛈",
    "386": "⛈",
    "392": "⛈",
    "122": "☁️",
}

function onDomContentLoaded() {
    console.log("DOM fully loaded and parsed");
    // fetches data extracts it and inserts it into the page
    getWeatherFromLocation("Aylesbury").then(data => {
        const htmlstring = generateHTML(data)
     const el = document.querySelector("#cc");
    //  el.innerHTML = htmlstring
    });
}

/**
 * The DOMContentLoaded event fires when the HTML document has been completely parsed
 * it creates a listener that listens for the DOMContentLoaded event, and starts the onDomContentLoaded function
 */ 
window.addEventListener("DOMContentLoaded", onDomContentLoaded);



/**
 * this is an asynchronous function that takes the parameter city and gets the data from the API and returns the data.
 * @param {} string city 
 * @returns object weather data of the location. see example data.json
 */
async function getWeatherFromLocation(city) {
    // fetches data from API
    const response = await fetch(`http://wttr.in/${city}?format=j1`);
    // turning the response body text into JSON
    const data = await response.json();
    // logging
    console.log(data.current_condition[0].weatherDesc[0].value);
    console.log(typeof data);
    return data;
}

/**
 * Takes the data and populates the HTML template
 * @param {} object data 
 * @returns string HTML with populated data.
 */
function generateHTML(data){
    const cc = data.current_condition[0].weatherDesc[0].value;
    const weatherCode = data.current_condition[0].weatherCode;
    const emoji = weatherSymbols[weatherCode];
    const temperature = data.current_condition[0].temp_C;
    const feelsLike = data.current_condition[0].FeelsLikeC;
    const winddir = data.current_condition[0].winddir16Point;
    const windspeed = data.current_condition[0].windspeedKmph;
    const rainfall = data.current_condition[0].precipMM;
    const hum = data.current_condition[0].humidity;
    const press = data.current_condition[0].pressure;
    const vis = data.current_condition[0].visibility;
    const cloud = data.current_condition[0].cloudcover;
    const uv = data.current_condition[0].uvIndex;

    return `
        <p class="dyn-txt">${emoji}</p>
        <p class="dyn-txt"> current condition: ${cc}</p>
        <p class="dyn-txt"> current temperature: ${temperature}°C </p>
        <p class="dyn-txt"> feels like: ${feelsLike}°C </p> 
        <p class="dyn-txt"> wind direction: ${winddir} </p> 
        <p class="dyn-txt"> windspeed(kmph): ${windspeed}kmph </p> 
        <p class="dyn-txt"> precipitation(mm): ${rainfall}mm </p> 
        <p class="dyn-txt"> humidity: ${hum}% </p> 
        <p class="dyn-txt"> pressure: ${press}hPa </p> 
        <p class="dyn-txt"> visibility(km): ${vis}km </p>
        <p class="dyn-txt"> cloud cover: ${cloud}% </p>
        <p class="dyn-txt"> UV index: ${uv} </p>


    `;
}


{/* <input type= "text" id = "text" class="location-input" placeholder="Enter location here:" size="50"></input>
    <button onclick="clicked()">ENTER</button> */}

/**
 * This function will take the user's input and turn it into a variable that can be user by the cityData() function
 */
function clicked(){
var locat = document.getElementById("text").value;

}