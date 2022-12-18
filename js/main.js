const apiKey = '790f14b98ea6a36905f407f0f4cd6157'
const displayDiv = document.getElementById('displayDiv')

const humidityObject = {
    low: {color: '', bgcolor: ''},
    'medium': {color: '', bgcolor: ''}, 
    high: {color: '', bgcolor: ''}    
}

const mainForecastColorObj = {
    clear: {},
    mostlyClear: {},
    partlyCloudy: {},
    mostlyCloudy: {},
    cloudy: {}, 
    clouds: {}
}

const errorFunct = function () {
    console.log("there was an error")
    const errorMessage = document.createElement('div')
    errorMessage.classList.add('errorMessage')
    errorMessage.innerHTML = `<h2>Your request could not be completed. Please try again. </h2>
    `

    errorMessage.addEventListener(('click'), (e) => {
        errorMessage.remove()
    })
    displayDiv.appendChild(errorMessage)

}

const getWeatherDataZipOrCity = async function(radioBtnAnswer, searchParameters) {
    if (radioBtnAnswer === 'cityName') {
        console.log('By city')
        const weatherData = await getWeatherInfoByCityName(searchParameters) 
        return weatherData
    } else if (radioBtnAnswer === 'zipCode') {
        const weatherData = await getWeatherInfoByZipCode(searchParameters) 
        return weatherData
    } else {
        errorFunct()
    }
}

const getWeatherInfoByCityName = async function(cityName) {
    try {
        console.log(`api.openweathermap.org/data/2.5/forecast?q=${cityName}&JSON&appid=${apiKey}&units=imperial`)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&JSON&appid=${apiKey}&units=imperial`)
        console.log("got it back, changing to json")
        const weatherData = await response.json()
        console.log(weatherData)
        return weatherData
    }
    catch(err) {
        errorFunct()
    }
}

const getWeatherInfoByZipCode = async function(zipCode) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${zipCode},US&JSON&appid=${apiKey}&units=imperial`)
        const weatherData = await response.json()
        return weatherData
    }
    catch(err) {
        errorFunct()
    }
}

// Submit Button for search function //
const weatherBtn = document.getElementById('showWeatherBtn')
weatherBtn.addEventListener(('click'), (event) => {
    event.preventDefault()
    const radioAnswers = document.getElementsByName('searchBy')
    let checkedRadioButton = null
    for (const radioAnswer of radioAnswers) {
        if (radioAnswer.checked) {
            checkedRadioButton = radioAnswer.id
        }
    }
   
    let cityName = document.getElementsByName('searchParameters')[0]
    console.log(cityName.value)
    addWeatherBox(checkedRadioButton, cityName.value) 
    cityName.placeholder = cityName.value
    cityName.value = ''
})



const addWeatherBox = async function(radioAnswer, cityName) {
    const forecast = await getWeatherDataZipOrCity(radioAnswer, cityName)
    const weatherDisplayEl = document.createElement('div')
    console.log(forecast)
    console.log("into the weather box")
    let tempMax = forecast.list[0].main.temp_max
    let tempMin = forecast.list[0].main.temp_min
    let currentHumidity = forecast.list[0].main.humidity
    let forecastMain = forecast.list[0].weather[0].main

    displayDiv.innerHTML = `
    <div class="card-header text-light border-dark"><strong>${forecast.city.name}</strong></div>
    <div class="card-body">
    <div class="currentTempDiv">
        <p class="currentTemp">${(forecast.list[0].main.temp).toFixed(1)}\u00B0</p>
    <p class="feelsLike">Feels like: <strong>${forecast.list[0].main.feels_like}\u00B0</strong></p>
        </div>

        <ul>
             <div clickable dropdown-base>
            <li class="clickable card p-2 mb-3" id="high">Today's High: ${(tempMax).toFixed(1)}\u00B0</li>
            <div class="dropdown-info moreInfo hidden"> <p>${forecast.city.name}
                     ${forecast.list[0].weather[0].description}</p>
            </div>
            </div>
            <li class="clickable dropdown-base card p-2 mb-3" id="low">Today's Low: ${(tempMin).toFixed(1)}\u00B0</li>
            <li class="clickable dropdown-base card p-2 mb-3" id="forecast">Today's Forecast: ${forecastMain}</li>
            <li class="clickable dropdown-base card p-2 mb-3" id="humidity">Current Humidity: ${currentHumidity}%</li>
        </ul>
    </div>
    </div>
    `
    console.log("inner html set")
//    let displayPorts = document.getElementsByClassName('dropdown-base')
//     for (let displayPort of displayPorts){
//     displayPort.addEventListener('click', (e) => {
//         const moreInfo = document.createElement('div')
//         moreInfo.classList.add('moreinfo')

//         moreInfo.innerHTML = `
//         ${forecast.name}
//         ${forecast.weather[0].description}
//         `
        
//     })
//     }
    
    //  Color Coding: //
    let high =  document.getElementById("high")
    let low = document.getElementById("low")
    let currentForecast =document.getElementById("forecast")
    let humidity = document.getElementById("humidity")

    high.style.backgroundColor = 'darkred'
    high.style.color = 'white'

    low.style.backgroundColor = 'darkblue'
    low.style.color = 'white'

    currentForecast.style.color = 'white'
    currentForecast.classList.add('clouds')

    if (currentHumidity < 40) {
        humidity.classList.add('lowHumidity')
    }
    else if (currentHumidity >= 40 && currentHumidity < 65) {
        humidity.classList.add('mediumHumidity')
    }
    else if (currentHumidity >= 65) {
        humidity.classList.add('highHumidity')
    }

    // humidity.style.backgroundColor = 'darkred'
    // humidity.style.color = 'white'
}

// getWeatherInfoByCityName('London')
addWeatherBox('cityName', 'denver')


