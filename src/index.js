
window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    /**
     * 
     */
    cityData('Aylesbury').then(data => {
        const htmlstring = generateHTML(data)
     const el = document.querySelector("#cc");
     el.innerHTML = htmlstring
    });
});



/**
 * 
 * @param {} city 
 * @returns city is substituted in the fetch command and the data for the city is fetched
 */
async function cityData(city) {

    const response = await fetch(`http://wttr.in/${city}?format=j1`);
    const movies = await response.json();
    console.log(movies.current_condition[0].weatherDesc[0].value);
    return movies
}

/**
 * 
 * @param {} data 
 * @returns 
 */
function generateHTML(data){
    const cc = data.current_condition[0].weatherDesc[0].value;
    return `<p> current condition: ${cc} </p>`
}


{/* <input type= "text" id = "text" class="location-input" placeholder="Enter location here:" size="50"></input>
    <button onclick="clicked()">ENTER</button> */}

// function clicked(){

// }