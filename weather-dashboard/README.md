# Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from the **Open-Meteo API** (free, no API key required).

## Features

✨ **Core Features:**
- 🔍 Search weather by city name
- 🌡️ Current weather conditions
- 📊 Detailed weather metrics (humidity, wind speed, UV index, visibility, dew point)
- ⏰ 24-hour hourly forecast
- 📅 7-day daily forecast
- 💾 Recently searched cities (stored in localStorage)
- 🎨 Beautiful dark theme UI
- 📱 Fully responsive (mobile, tablet, desktop)

## API Used

**Open-Meteo API** - https://open-meteo.com/
- ✅ Free (no authentication required)
- ✅ No rate limiting for reasonable use
- ✅ Excellent weather data
- ✅ Supports geocoding

## Installation

### Option 1: Direct Usage
1. Clone or download the files
2. Open `index.html` in a modern web browser
3. Search for any city!

### Option 2: Deploy Online
- **Netlify**: Drag and drop the folder
- **GitHub Pages**: Push to repo and enable Pages
- **Vercel**: Connect your repo

## File Structure

```
weather-dashboard/
├── index.html       # Main HTML structure
├── styles.css       # Styling (dark theme)
├── script.js        # Weather API logic
└── README.md        # This file
```

## How It Works

1. **User enters city name** → Search box
2. **Geocoding** → Open-Meteo converts city name to coordinates
3. **Fetch weather** → Open-Meteo returns current, hourly, and daily forecast
4. **Display data** → Dashboard shows all information with icons
5. **Save history** → City stored in browser's localStorage

## Displayed Information

### Current Weather
- Temperature & "feels like"
- Weather condition
- Humidity, Wind Speed, Pressure
- UV Index, Visibility, Dew Point

### Hourly Forecast
- Next 24 hours
- Temperature, Weather icon, Humidity

### Daily Forecast
- Next 7 days
- High/Low temperatures
- Weather condition, Precipitation

### Recently Searched
- Quick access to previous searches
- Click to load weather instantly

## Customization

### Change Default City
In `script.js`, line ~300:
```javascript
cityInput.value = 'London'; // Change to your preferred city
```

### Modify Colors
In `styles.css`, update CSS variables:
```css
:root {
    --primary-color: #1e88e5;
    --secondary-color: #26c6da;
    --success-color: #43a047;
    /* ... */
}
```

### Temperature Units
Current: Celsius. To change to Fahrenheit, modify API calls in `script.js`:
```javascript
// Add &temperature_unit=fahrenheit to API URLs
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## API Endpoints Used

1. **Geocoding API**
   ```
   https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1
   ```

2. **Weather Forecast API**
   ```
   https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current={params}&hourly={params}&daily={params}
   ```

## Weather Codes (WMO)

The dashboard uses WMO Weather Codes (0-99) and maps them to descriptions and emoji:
- 0 = Clear Sky ☀️
- 2-3 = Cloudy ☁️
- 45-48 = Fog 🌫️
- 51-65 = Rain 🌧️
- 71-77 = Snow ❄️
- 80-82 = Rain Showers ⛈️
- 95-99 = Thunderstorms ⛈️

## Performance

- **Fast**: Lightweight, no heavy libraries
- **Responsive**: Works on all screen sizes
- **Efficient**: Minimal API calls, cached data
- **Accessible**: WCAG compliant design

## Future Enhancements

- 🗺️ Map integration (show location on map)
- 📲 PWA support (offline capability)
- 🔔 Weather alerts/notifications
- 🌍 Multiple languages
- 📊 Historical weather data
- 🎯 Geolocation (auto-detect user location)

## Credits

- Weather Data: [Open-Meteo](https://open-meteo.com/)
- Icons: Emoji weather icons
- Design: Modern dark theme

## License

Free to use and modify. No restrictions!

---

**Enjoy your weather dashboard! 🌤️**
