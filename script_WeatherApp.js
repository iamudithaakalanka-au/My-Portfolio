// Navbar toggle
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
});





const cityInput = document.querySelector('.city-input')
const searchButton = document.querySelector('.search-button')

const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const uvValueTxt = document.querySelector('.uv-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastItemsContainer = document.querySelector('.forecast-items-container')



const apiKey = '8cbfc2b9ba57a288a69cebdcadaf6fe8'

searchButton.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        fadeOutAndUpdate(cityInput.value)
        cityInput.value = ''
        cityInput.blur( )
    } 
})

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        fadeOutAndUpdate(cityInput.value)
        cityInput.value = ''
        cityInput.blur( )
    }
})

async function fadeOutAndUpdate(city) {
    // Prevent multiple rapid requests
    if (cityInput.disabled) return
    cityInput.disabled = true
    searchButton.disabled = true
    
    // Fade out current weather info and trigger background transition
    weatherInfoSection.style.opacity = '0'
    weatherInfoSection.style.transition = 'opacity 0.5s ease-in-out'
    
    // Wait for fade-out to complete, then update weather
    setTimeout(() => {
        updateWeatherInfo(city)
    }, 400)
}

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric&lang=en`
    const response = await fetch(apiUrl)
    return response.json()
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getWeatherBackground(id) {
    if (id <= 232) return 'thunderstorm.jpg'
    if (id <= 321) return 'drizzle.jpg'
    if (id <= 531) return 'rain.jpg'
    if (id <= 622) return 'snow.jpg'
    if (id <= 781) return 'atmosphere.jpg'
    if (id <= 800) return 'clear.jpg'
    else return 'clouds.jpg'
}

function getCurrentDate() {
    const currentDate = new Date()
    const option = {
        weekdays: 'short',
        month: 'short',
        day: '2-digit'
    }

    return currentDate.toLocaleDateString('en-GB', option)
    
}

async function getUVIndex(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
    const response = await fetch(apiUrl)
    return response.json()
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        cityInput.disabled = false
        searchButton.disabled = false
        return
    }

    const { lat, lon } = weatherData.coord
    
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData

    // Fetch UV and forecast data in parallel before displaying
    try {
        const [uvData, forecastData] = await Promise.all([
            getUVIndex(lat, lon),
            getFetchData('forecast', city)
        ])

        const { value: uvIndex } = uvData

        // Update all weather info at once (everything is ready)
        countryTxt.textContent = country
        tempTxt.textContent = Math.round(temp) + ' °C'
        conditionTxt.textContent = main
        humidityValueTxt.textContent = humidity + ' %'
        windValueTxt.textContent = speed + ' M/s'
        uvValueTxt.textContent = uvIndex

        currentDateTxt.textContent = getCurrentDate()
        weatherSummaryImg.src = `resources_WeatherApp/weather/${getWeatherIcon(id)}` 
        
        // Update forecast display
        updateForecastDisplay(forecastData)
        
        // Smooth transition from video to weather background
        document.body.style.backgroundImage = `url('resources_WeatherApp/backgrounds/${getWeatherBackground(id)}')`
        
        const backgroundVideo = document.querySelector('.background-video')
        backgroundVideo.style.opacity = '0'
        
        setTimeout(() => {
            backgroundVideo.style.display = 'none'
        }, 400)

        // Show all sections at once now that everything is loaded
        showDisplaySection(weatherInfoSection)
        
        // Set transition back and fade in weather info
        weatherInfoSection.style.transition = 'opacity 0.6s ease-in-out'
        weatherInfoSection.style.opacity = '1'
        
        // Re-enable inputs after all updates
        setTimeout(() => {
            cityInput.disabled = false
            searchButton.disabled = false
        }, 600)
    } catch (error) {
        console.error('Error loading weather data:', error)
        showDisplaySection(notFoundSection)
        cityInput.disabled = false
        searchButton.disabled = false
    }
}

async function loadUVAndForecast(lat, lon, city) {
    try {
        const [uvData, forecastData] = await Promise.all([
            getUVIndex(lat, lon),
            getFetchData('forecast', city)
        ])

        const { value: uvIndex } = uvData
        uvValueTxt.textContent = uvIndex
        updateForecastDisplay(forecastData)
    } catch (error) {
        console.error('Error loading UV/Forecast:', error)
    }
}

async function updateForecastInfo(city) {
    const forecastData = await getFetchData('forecast', city)

    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''
    
    // Get forecast for next 5 days, trying multiple times of day if needed
    const forecastByDate = {}
    
    forecastData.list.forEach(forecastWeather => {
        const date = forecastWeather.dt_txt.split(' ')[0]
        
        // Skip today's date
        if (date === todayDate) return
        
        // Get first available forecast for each future date
        if (!forecastByDate[date]) {
            forecastByDate[date] = forecastWeather
        }
    })
    
    // Add forecast items for next 5 days
    Object.values(forecastByDate).slice(0, 5).forEach(forecastWeather => {
        updateForecastItem(forecastWeather)
    })
}

function updateForecastDisplay(forecastData) {
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''
    let count = 0
    
    // Get forecast for next 5 days, trying multiple times of day if needed
    const forecastByDate = {}
    
    forecastData.list.forEach(forecastWeather => {
        const date = forecastWeather.dt_txt.split(' ')[0]
        
        // Skip today's date
        if (date === todayDate) return
        
        // Get first available forecast for each future date
        if (!forecastByDate[date]) {
            forecastByDate[date] = forecastWeather
        }
    })
    
    // Add forecast items for next 5 days
    Object.values(forecastByDate).slice(0, 5).forEach(forecastWeather => {
        updateForecastItem(forecastWeather)
    })
}

function updateForecastItem(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = { day: '2-digit', month: 'short' }
    const dateResults = dateTaken.toLocaleDateString('en-GB', dateOption)

    const forecastItems = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResults}</h5>
            <img src="resources_WeatherApp/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItems)

}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
    
    // Show video background when returning to search-city section
    const backgroundVideo = document.querySelector('.background-video')
    if (section === searchCitySection) {
        backgroundVideo.style.display = 'block'
        backgroundVideo.style.opacity = '1'
        document.body.style.backgroundImage = 'none'
    }
}