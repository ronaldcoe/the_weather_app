
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




/*------------------ TASKS -------------*/
let addTaskBtn = document.querySelector("#addTask");
let oldTasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completedTasks = JSON.parse(localStorage.getItem("completed")) || [];

function displayTasks(tasks, containerId, completed = false) {
    const tasksContainer = document.querySelector(containerId);
    tasksContainer.innerHTML = ''; // Clear the container first

    tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task");
        taskItem.innerHTML = `
            <p class="task_description">${task}</p>
            <div style="flex:none">
            <span class="material-symbols-outlined complete">
                check_circle
            </span>
            <span class="material-symbols-outlined delete">
                delete
            </span>
              
            </div>
        `;

        // Add event listeners for complete and delete
        const completeButton = taskItem.querySelector(".complete");
        const deleteButton = taskItem.querySelector(".delete");

        completeButton.addEventListener("click", () => {
            if (completed) {
                uncompleteTask(index);
            } else {
                completeTask(index);
            }
        });

        deleteButton.addEventListener("click", () => {
            deleteTask(index, completed);
        });

        tasksContainer.appendChild(taskItem);
    });
}

function addTask() {
    let task = document.querySelector("#task_input").value;

    if (task.trim() === "") {
        alert("Task cannot be empty.");
        return;
    }

    oldTasks.push(task);
    displayTasks(oldTasks, "#tasks");

    localStorage.setItem("tasks", JSON.stringify(oldTasks));
    document.querySelector("#task_input").value = "";
    updateTaskCounts()
}

function completeTask(index) {
    const completedTask = oldTasks.splice(index, 1)[0];
    completedTasks.push(completedTask);

    displayTasks(oldTasks, "#tasks");
    displayTasks(completedTasks, "#completed", true);

    localStorage.setItem("tasks", JSON.stringify(oldTasks));
    localStorage.setItem("completed", JSON.stringify(completedTasks));
    updateTaskCounts()
}

function uncompleteTask(index) {
    const uncompletedTask = completedTasks.splice(index, 1)[0];
    oldTasks.push(uncompletedTask);

    displayTasks(oldTasks, "#tasks");
    displayTasks(completedTasks, "#completed", true);

    localStorage.setItem("tasks", JSON.stringify(oldTasks));
    localStorage.setItem("completed", JSON.stringify(completedTasks));
    updateTaskCounts()
}

function deleteTask(index, completed) {
    if (completed) {
        completedTasks.splice(index, 1);
        displayTasks(completedTasks, "#completed", true);
        localStorage.setItem("completed", JSON.stringify(completedTasks));
        updateTaskCounts()
    } else {
        oldTasks.splice(index, 1);
        displayTasks(oldTasks, "#tasks");
        localStorage.setItem("tasks", JSON.stringify(oldTasks));
        updateTaskCounts()
    }
}
function updateTaskCounts() {
    const totalTasksCount = oldTasks.length + completedTasks.length;
    const completedTasksCount = completedTasks.length;

    document.querySelector("#number_total_tasks").textContent = totalTasksCount;
    document.querySelector("#number_completed_tasks").textContent = completedTasksCount;
}

displayTasks(oldTasks, "#tasks");
displayTasks(completedTasks, "#completed", true);
addTaskBtn.addEventListener("click", addTask);
updateTaskCounts()