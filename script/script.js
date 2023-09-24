
document.querySelector('#loc').value = 'USA';
document.querySelector('#search').addEventListener('click', newSearch);

newSearch();


function getTime() {
    let today = new Date();
    let time = today.getHours();
    return time
}



function convertToJson(response) {
    if (response.ok) {
        return response.json();
    } else {
        console.log('error: ', response);
    }
}

function displayCurrentTemp(data, value) {
    document.querySelector('.nextDays').innerHTML = '';

    // tempList.forEach((currentItem) => {
    //     const html = `<li>${currentItem.tempmax}</li>`;
    //     outputElement.innerHTML += html;
    // })
    let img = data.days[0].hours[getTime()].icon;
    document.querySelector('#weatherIcon').src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${img}.png`;
    console.log(img);
    document.querySelector('#address').innerHTML = data.resolvedAddress
    document.querySelector("#currentTemp").innerHTML = data.days[0].hours[getTime()].temp + ` º${value}`;
    document.querySelector("#description").innerHTML = data.description;
    document.querySelector('#feelsLike').innerHTML = data.days[0].hours[getTime()].feelslike;
    document.querySelector('#windSpeed').innerHTML = data.days[0].hours[getTime()].windspeed;
    document.querySelector('#humidity').innerHTML = data.days[0].hours[getTime()].humidity + '%';
    document.querySelector('#visibility').innerHTML = data.days[0].hours[getTime()].visibility;

    function displayNextTemp() {
        // let daysW = data.days;
        let outputElement = document.querySelector('.nextDays');
        for (let i = 1; i < 8; i++) {
            let newDate = new Date((data.days[i].datetime).replaceAll('-', '/'))
            const html = `
            <div class="nextCont">
            <div class="date_img_cond">
                <p class="date">${newDate.toDateString()}</p>
                <img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${data.days[i].icon}.png" width="30px">
                <p class="next_conditions">${data.days[i].conditions}</p>
            </div>
            <div class="hilo_container">
                <div>
                    <p class= "hilo">Highest</p>
                    <p class="nextTempMax">${data.days[i].tempmax}</p>
                </div>
                <div>
                    <p class="hilo">Lowest</p>
                    <p class="nextTempMin">${data.days[i].tempmin}</p>
                </div>
                </div>
            </div>`
            outputElement.innerHTML += html

            
        }
    }
    displayNextTemp();

    
    
};


/*----------------------------- NEWS SCRIPT ------------------------ */



async function getDataNews(location) {
    const newsAPI = `https://newsdata.io/api/1/news?apikey=pub_300004f5281879b1b30b50695cbb6edfb6b22&q=${location}&language=en&image=1`
    let dataNews;
    try {
        const response = await fetch(newsAPI)
        const data = await response.json()
        dataNews = data
        displayNews(dataNews)
    } catch (error){
        console.log(error)
    }
}


function displayNews(data) {
    const newsContainer = document.querySelector("#news")
    const newsHtml = data.results.map(newItem => `
        <div class="new_container">
            <h2><a href=${newItem.link} target="__blank">${newItem.title}</a></h2>
            <div class="newContent">
                ${newItem.image_url != null? `<img src="${newItem.image_url}" alt="news image"/>` :""}
                <p class="new_description">${newItem.description.split(' ').slice(0, 50).join(' ')}${newItem.description.split(' ').length > 50 ? '...' : ''}</p>
            </div>
        </div>
    `)
    console.log(newsHtml)
    const newsHtmlString = newsHtml.join('');
    console.log(newsHtml)
    newsContainer.innerHTML =  newsHtmlString
}

getDataNews(loc)


function displayCelcius() {
    let loc = document.querySelector('#loc').value;
    
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=metric&key=EWQF52DJKF9B9NEMA45J3VZGW&contentType=json`;
    fetch(url).then(convertToJson).then((data)=> displayCurrentTemp(data, "C"));
}
function newSearch(){
 
    let loc = document.querySelector('#loc').value;
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=us&key=EWQF52DJKF9B9NEMA45J3VZGW&contentType=json`;
    fetch(url).then(convertToJson).then((data)=> displayCurrentTemp(data, "F"));
    getDataNews(loc)
}

document.querySelector("#celcius").addEventListener("click", displayCelcius)
document.querySelector("#farenheit").addEventListener("click", newSearch)