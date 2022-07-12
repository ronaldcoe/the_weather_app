
document.querySelector('#loc').value = 'Rexburg';
document.querySelector('#search').addEventListener('click', newSearch);

newSearch();


function getTime() {
    let today = new Date();
    let time = today.getHours();
    return time
}
function newSearch(){
    let loc = document.querySelector('#loc').value;
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=us&key=EWQF52DJKF9B9NEMA45J3VZGW&contentType=json`;
    fetch(url).then(convertToJson).then(displayCurrentTemp);
}



function convertToJson(response) {
    if (response.ok) {
        return response.json();
    } else {
        console.log('error: ', response);
    }
}

function displayCurrentTemp(data) {
    document.querySelector('.nextDays').innerHTML = '';

    // tempList.forEach((currentItem) => {
    //     const html = `<li>${currentItem.tempmax}</li>`;
    //     outputElement.innerHTML += html;
    // })
    let img = data.days[0].hours[getTime()].icon;
    document.querySelector('#weatherIcon').src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${img}.png`;
    console.log(img);
    document.querySelector('#address').innerHTML = data.resolvedAddress
    document.querySelector("#currentTemp").innerHTML = data.days[0].hours[getTime()].temp + ' F';
    document.querySelector("#description").innerHTML = data.description;
    document.querySelector('#feelsLike').innerHTML = data.days[0].hours[getTime()].feelslike;
    document.querySelector('#windSpeed').innerHTML = data.days[0].hours[getTime()].windspeed;
    document.querySelector('#humidity').innerHTML = data.days[0].hours[getTime()].humidity + '%';
    document.querySelector('#visibility').innerHTML = data.days[0].hours[getTime()].visibility;

    function displayNextTemp() {
        // let daysW = data.days;
        let outputElement = document.querySelector('.nextDays');
        for (let i = 2; i < 8; i++) {
            let newDate = new Date(data.days[i].datetime)

            const html = `<div class="nextCont"><p class="date">${newDate.toDateString()}</p>
            <p class= "hilo">Highest</p>
            <p class="nextTempMax">${data.days[i].tempmax}</p>
            <p class="hilo">Lowest</p>
            <p class="nextTempMin">${data.days[i].tempmin}</p></div>`
            outputElement.innerHTML += html

            
        }
    }
    displayNextTemp();

    
    
};



