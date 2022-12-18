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
    errorMessage.classList.add('card', 'mb-0', 'danger')
    errorMessage.innerHTML = `<h2>Your request could not be completed. Please try again. </h2>
    `
    displayDiv.appendChild('errorMessage')

}

const getWeatherDataZipOrCity = async function(radioBtnAnswer, searchParameters) {
    if (radioBtnAnswer === 'cityName') {
        console.log('getWeatherDataZipOrCity, ' + radioBtnAnswer, searchParameters)
        const weatherData = await getWeatherInfoByCityName(searchParameters) 
        return weatherData
    } else if (radioBtnAnswer === 'zipCode') {
        console.log(radioBtnAnswer, searchParameters)
        const weatherData = await getWeatherInfoByZipCode(searchParameters) 
        return weatherData
    } else {
        console.log(radioBtnAnswer, searchParameters)
        errorFunct()
    }
}

const getWeatherInfoByCityName = async function(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
        console.log(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
        const weatherData = await response.json()
        console.log((weatherData))
        return weatherData
    }
    catch(err) {
        errorFunct()
    }
}

const getWeatherInfoByZipCode = async function(zipCode) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${zipCode},us&appid=${apiKey}&units=imperial`)
        console.log(`https://api.openweathermap.org/data/2.5/weather?q=${zipCode},us&appid=${apiKey}&units=imperial`)
        const weatherData = await response.json()
        return weatherData
    }
    catch(err) {
        errorFunct()
    }
}

// Weather Button //
const weatherBtn = document.getElementById('showWeatherBtn')
weatherBtn.addEventListener(('click'), (event) => {
    event.preventDefault()
    const radioAnswers = document.getElementsByName('searchBy')
    console.log(radioAnswers)
    let checkedRadioButton = null
    for (const radioAnswer of radioAnswers) {
        if (radioAnswer.checked) {
            console.log(radioAnswer.id)
            checkedRadioButton = radioAnswer.id
        }
    }
   
    let cityName = document.getElementsByName('searchParameters')[0]
    console.log(cityName.value)
    addWeatherBox(checkedRadioButton, cityName.value) 

})



const addWeatherBox = async function(radioAnswer, cityName) {
    console.log("weatherbox start")
    const forecast = await getWeatherDataZipOrCity(radioAnswer, cityName)
    console.log("forecast back")
    const weatherDisplayEl = document.createElement('div')
    console.log(forecast)
    let tempMax = forecast.main.temp_max
    let tempMin = forecast.main.temp_min
    


    displayDiv.innerHTML = `
    <div class="card-header text-light border-dark"><strong>${forecast.name}</strong></div>
    <div class="card-body">
    <div class="currentTempDiv">
        <p class="currentTemp">${(forecast.main.temp).toFixed(1)}\u00B0</p>
    <p class="feelsLike">Feels like: <strong>${forecast.main.feels_like}\u00B0</strong></p>
        </div>

        <ul>
            <li class="clickable dropdown-base card p-2 mb-3" id="high">Today's High: ${(tempMax).toFixed(1)}\u00B0</li>
            <li class="clickable dropdown-base card p-2 mb-3" id="low">Today's Low: ${(tempMin).toFixed(1)}\u00B0</li>
            <li class="clickable dropdown-base card p-2 mb-3" id="forecast">Today's Forecast: ${forecast.weather[0].main}</li>
            <li class="clickable dropdown-base card p-2 mb-3" id="humidity">Current Humidity: ${forecast.main.humidity}%</li>
        </ul>
    </div>
    </div>
    `

   

    weatherDisplayEl.addEventListener('click', (e) => {
        // featuredEmployeeBuilder(name, jobTitle, skills)
        // let oldFeature = document.querySelector('#employees .depressed')
        // console.log(oldFeature)
        // oldFeature?.classList.remove('depressed')
        // driverEl.classList.add('depressed')
    })

    
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

    if (forecast.main.humidity < 40) {
        humidity.classList.add('lowHumidity')
    }
    else if (forecast.main.humidity >= 40 && forecast.main.humidity < 65) {
        humidity.classList.add('mediumHumidity')
    }
    else if (forecast.main.humidity >= 65) {
        humidity.classList.add('highHumidity')
    }

    // humidity.style.backgroundColor = 'darkred'
    // humidity.style.color = 'white'
}

// getWeatherInfoByCityName('London')
addWeatherBox('cityName', 'st louis')


