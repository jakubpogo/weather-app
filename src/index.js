

function onDomContentLoaded() {
    console.log("DOM fully loaded and parsed");
    // fetches data extracts it and inserts it into the page
    getWeatherFromLocation("Aylesbury").then(data => {
        const htmlstring = generateHTML(data)
     const el = document.querySelector("#cc");
     el.innerHTML = htmlstring
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
    return `<p> current condition: ${cc} </p>`
}


{/* <input type= "text" id = "text" class="location-input" placeholder="Enter location here:" size="50"></input>
    <button onclick="clicked()">ENTER</button> */}

/**
 * This function will take the user's input and turn it into a variable that can be user by the cityData() function
 */
function clicked(){
var locat = document.getElementById("text").value;

}