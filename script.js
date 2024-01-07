// Resource Allocator JavaScript File

// TODO: Integrate Google Maps or Leaflet API here

// Array to store resources
const resources = [];

// Reference to the table body in the HTML where resources will be displayed
const resourceTable = document.getElementById('resourcesTable').getElementsByTagName('tbody')[0];

// Function to fetch weather data using OpenWeatherMap API
const fetchWeatherData = async (city) => {
    const apiKey = 'ddf1ad5e7465f6f037dfbb822f347900'; // API key for OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeatherData(data); // Displaying the fetched weather data
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

// Function to display weather data in the UI
function displayWeatherData(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    if (data.main) {
        const tempCelsius = (data.main.temp - 273.15).toFixed(2); // Convert temperature from Kelvin to Celsius
        weatherDisplay.innerHTML = `
            <p><strong>${data.name}</strong>: ${data.weather[0].main}, ${tempCelsius}°C</p>
        `;
    } else {
        weatherDisplay.innerHTML = '<p>Weather data not available</p>';
    }
}

// Event listener for weather form submission
document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('weatherCity').value;
    fetchWeatherData(city); // Fetch weather data for the entered city
});

// Initialize Google Maps
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("mapView"), {
        center: { lat: 53.234, lng: -0.538 }, 
        zoom: 8,
    });
}

// Event listener for resource form submission
document.getElementById('resourceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve and process form data
    var resourceType = document.getElementById('resourceType').value;
    var resourceName = document.getElementById('resourceName').value;
    var quantity = document.getElementById('quantity').value;
    var status = document.getElementById('status').value;
    var location = document.getElementById('location').value;

    // Generate a mock Resource ID
    var resourceId = "00" + (resourcesTable.rows.length);

    // Capitalize the first letter of form inputs
    resourceName = capitalizeFirstLetter(resourceName);
    resourceType = capitalizeFirstLetter(resourceType);
    status = capitalizeFirstLetter(status);
    location = capitalizeFirstLetter(location);

    // Append unit to quantity based on resource type
    if (resourceType.toLowerCase() === 'fuel') {
        quantity += ' L';
    } else if (resourceType.toLowerCase() === 'ammunition') {
        quantity += ' Units';
    }

    // Add the new resource to the table
    let newRow = resourcesTable.insertRow();
    [resourceId, resourceType, location, resourceName, quantity, status].forEach(text => {
        let cell = newRow.insertCell();
        let textNode = document.createTextNode(text);
        cell.appendChild(textNode);
    });

    // Save updated resources to local storage
    saveResourcesToLocalStorage();
});

// Event listener for search functionality in the resources table
document.getElementById('searchResources').addEventListener('input', function(event) {
    const searchQuery = event.target.value.toLowerCase();
    const rows = document.getElementById("resourcesTable").rows;

    for (let i = 1; i < rows.length; i++) { // Filtering table rows based on search query
        let row = rows[i];
        let text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchQuery) ? "" : "none";
    }
});

// Function to save resources to local storage
function saveResourcesToLocalStorage() {
    var resources = [];
    const rows = document.getElementById("resourcesTable").rows;

    for (let i = 1; i < rows.length; i++) { 
        let resource = {
            id: rows[i].cells[0].innerText,
            resourceType: rows[i].cells[1].innerText,
            location: rows[i].cells[2].innerText,
            name: rows[i].cells[3].innerText,
            quantity: rows[i].cells[4].innerText,
            status: rows[i].cells[5].innerText
        };
        resources.push(resource);
    }

    localStorage.setItem('resources', JSON.stringify(resources));
}

// Function to load resources from local storage and display in the table
function loadResourcesFromLocalStorage() {
    const storedResources = localStorage.getItem('resources');
    if (storedResources) {
        const resources = JSON.parse(storedResources);
        resources.forEach(resource => addToTable(resource));
    }
}

// Function to add resource to the table
function addToTable(resource) {
    let newRow = resourcesTable.insertRow();
    Object.values(resource).forEach(text => {
        let cell = newRow.insertCell();
        let textNode = document.createTextNode(text);
        cell.appendChild(textNode);
    });
}

// Load resources from local storage when the document is ready
document.addEventListener('DOMContentLoaded', loadResourcesFromLocalStorage);
