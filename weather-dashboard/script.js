// Weather API Configuration
const OPEN_METEO_API = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

// UI Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const currentWeatherSection = document.getElementById('currentWeather');
const hourlyForecastSection = document.getElementById('hourlyForecast');
const dailyForecastSection = document.getElementById('dailyForecast');
const hourlyContainer = document.getElementById('hourlyContainer');
const dailyContainer = document.getElementById('dailyContainer');
const recentCitiesContainer = document.getElementById('recentCities');

// Weather Icons Mapping
const weatherIcons = {
    0: '☀️', // Clear sky
    1: '🌤️', // Mainly clear
    2: '⛅', // Partly cloudy
    3: '☁️', // Overcast
    45: '🌫️', // Foggy
    48: '🌫️', // Depositing rime fog
    51: '🌧️', // Drizzle light
    53: '🌧️', // Drizzle moderate
    55: '🌧️', // Drizzle dense
    61: '🌧️', // Rain slight
    63: '🌧️', // Rain moderate
    65: '⛈️', // Rain heavy
    71: '❄️', // Snow slight
    73: '❄️', // Snow moderate
    75: '❄️', // Snow heavy
    77: '❄️', // Snow grains
    80: '🌧️', // Rain showers slight
    81: '⛈️', // Rain showers moderate
    82: '⛈️', // Rain showers violent
    85: '❄️', // Snow showers slight
    86: '❄️', // Snow showers heavy
    95: '⛈️', // Thunderstorm slight
    96: '⛈️', // Thunderstorm moderate
    99: '⛈️', // Thunderstorm heavy
};

// Get WMO code description
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear Sky',
        1: 'Mainly Clear',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing Rime Fog',
        51: 'Light Drizzle',
        53: 'Moderate Drizzle',
        55: 'Dense Drizzle',
        61: 'Slight Rain',
        63: 'Moderate Rain',
        65: 'Heavy Rain',
        71: 'Slight Snow',
        73: 'Moderate Snow',
        75: 'Heavy Snow',
        77: 'Snow Grains',
        80: 'Slight Rain Showers',
        81: 'Moderate Rain Showers',
        82: 'Violent Rain Showers',
        85: 'Slight Snow Showers',
        86: 'Heavy Snow Showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with Slight Hail',
        99: 'Thunderstorm with Heavy Hail',
    };
    return descriptions[code] || 'Unknown';
}

// Recently searched cities
class RecentSearches {
    constructor() {
        this.storageKey = 'recentWeatherCities';
        this.load();
    }

    load() {
        const stored = localStorage.getItem(this.storageKey);
        this.cities = stored ? JSON.parse(stored) : [];
    }

    add(city) {
        const index = this.cities.indexOf(city);
        if (index > -1) {
            this.cities.splice(index, 1);
        }
        this.cities.unshift(city);
        this.cities = this.cities.slice(0, 10);
        this.save();
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cities));
    }

    get() {
        return this.cities;
    }
}

const recentSearches = new RecentSearches();

// Show/Hide loading spinner
function showLoading(show = true) {
    loadingSpinner.classList.toggle('hidden', !show);
}

// Show/Hide error message
function showError(message, show = true) {
    if (show) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    } else {
        errorMessage.classList.add('hidden');
    }
}

// Geocode city name to coordinates
async function geocodeCity(cityName) {
    try {
        const response = await fetch(
            `${GEOCODING_API}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
        }

        const result = data.results[0];
        return {
            latitude: result.latitude,
            longitude: result.longitude,
            name: result.name,
            country: result.country,
            state: result.admin1 || '',
        };
    } catch (error) {
        throw new Error(`Failed to find city: ${error.message}`);
    }
}

// Fetch weather data
async function fetchWeatherData(latitude, longitude) {
    try {
        const response = await fetch(
            `${OPEN_METEO_API}?` +
            `latitude=${latitude}&` +
            `longitude=${longitude}&` +
            `current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,uv_index,visibility&` +
            `hourly=temperature_2m,weather_code,relative_humidity_2m,precipitation,wind_speed_10m&` +
            `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max&` +
            `timezone=auto&` +
            `forecast_days=7`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
}

// Display current weather
function displayCurrentWeather(weatherData, locationName) {
    const current = weatherData.current;
    const timezone = weatherData.timezone;

    document.getElementById('cityName').textContent = locationName;
    document.getElementById('weatherDescription').textContent = getWeatherDescription(current.weather_code);
    document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('feelsLike').textContent = `(Feels like ${Math.round(current.apparent_temperature)}°C)`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('pressure').textContent = `${Math.round(current.pressure_msl)} mb`;
    document.getElementById('uvIndex').textContent = `${Math.round(current.uv_index * 10) / 10}`;
    document.getElementById('visibility').textContent = `${Math.round(current.visibility / 1000)} km`;

    // Calculate dew point (approximation)
    const dewPoint = calculateDewPoint(current.temperature_2m, current.relative_humidity_2m);
    document.getElementById('dewPoint').textContent = `${Math.round(dewPoint)}°C`;

    // Set weather emoji
    const icon = weatherIcons[current.weather_code] || '🌦️';
    document.getElementById('weatherIcon').textContent = icon;
    document.getElementById('weatherIcon').style.fontSize = '100px';

    currentWeatherSection.classList.remove('hidden');
}

// Calculate dew point using approximation
function calculateDewPoint(temp, humidity) {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint;
}

// Display hourly forecast
function displayHourlyForecast(weatherData) {
    const hourly = weatherData.hourly;
    const current = new Date(weatherData.current_time);
    hourlyContainer.innerHTML = '';

    for (let i = 0; i < 24; i++) {
        const time = new Date(current.getTime() + i * 60 * 60 * 1000);
        const hour = time.getHours().toString().padStart(2, '0');
        const temp = hourly.temperature_2m[i];
        const code = hourly.weather_code[i];
        const humidity = hourly.relative_humidity_2m[i];

        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <div class="time">${hour}:00</div>
            <div style="font-size: 30px;">${weatherIcons[code] || '🌦️'}</div>
            <div class="temp">${Math.round(temp)}°</div>
            <div class="condition">${humidity}% humidity</div>
        `;
        hourlyContainer.appendChild(card);
    }

    hourlyForecastSection.classList.remove('hidden');
}

// Display daily forecast
function displayDailyForecast(weatherData) {
    const daily = weatherData.daily;
    dailyContainer.innerHTML = '';

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(daily.time[i]);
        const dayName = dayNames[date.getDay()];
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        const maxTemp = daily.temperature_2m_max[i];
        const minTemp = daily.temperature_2m_min[i];
        const code = daily.weather_code[i];
        const precipitation = daily.precipitation_sum[i];

        const card = document.createElement('div');
        card.className = 'daily-card';
        card.innerHTML = `
            <div class="day">${dayName}</div>
            <div style="font-size: 0.85em; color: var(--text-secondary);">${dateStr}</div>
            <div style="font-size: 40px; margin: 10px 0;">${weatherIcons[code] || '🌦️'}</div>
            <div class="condition">${getWeatherDescription(code)}</div>
            <div class="temp-range">
                <span class="temp-high">${Math.round(maxTemp)}°</span>
                <span class="temp-low">${Math.round(minTemp)}°</span>
            </div>
            ${precipitation > 0 ? `<div style="margin-top: 5px; font-size: 0.85em; color: var(--secondary-color);">💧 ${Math.round(precipitation)}mm</div>` : ''}
        `;
        dailyContainer.appendChild(card);
    }

    dailyForecastSection.classList.remove('hidden');
}

// Update recent searches UI
function updateRecentSearchesUI() {
    const cities = recentSearches.get();
    recentCitiesContainer.innerHTML = '';

    if (cities.length === 0) {
        recentCitiesContainer.innerHTML = '<p style="color: var(--text-secondary);">No recent searches</p>';
        return;
    }

    cities.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'recent-city-btn';
        btn.textContent = city;
        btn.addEventListener('click', () => {
            cityInput.value = city;
            handleSearch();
        });
        recentCitiesContainer.appendChild(btn);
    });
}

// Main search handler
async function handleSearch() {
    const cityName = cityInput.value.trim();

    if (!cityName) {
        showError('Please enter a city name');
        return;
    }

    showLoading(true);
    showError('', false);

    try {
        // Geocode the city
        const location = await geocodeCity(cityName);
        const displayName = `${location.name}${location.state ? ', ' + location.state : ''}, ${location.country}`;

        // Fetch weather data
        const weatherData = await fetchWeatherData(location.latitude, location.longitude);

        // Display all sections
        displayCurrentWeather(weatherData, displayName);
        displayHourlyForecast(weatherData);
        displayDailyForecast(weatherData);

        // Add to recent searches
        recentSearches.add(displayName);
        updateRecentSearchesUI();

        // Clear input
        cityInput.value = '';
    } catch (error) {
        showError(error.message);
        currentWeatherSection.classList.add('hidden');
        hourlyForecastSection.classList.add('hidden');
        dailyForecastSection.classList.add('hidden');
    } finally {
        showLoading(false);
    }
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Initialize
updateRecentSearchesUI();

// Default city on load
window.addEventListener('load', () => {
    cityInput.value = 'London';
    handleSearch();
});
