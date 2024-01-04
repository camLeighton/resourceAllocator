// TODO: Integrate Google Maps or Leaflet API here
const resources = [];

const resourceTable = document.getElementById('resourcesTable').getElementsByTagName('tbody')[0];

resources.forEach(resource => {
    let row = resourcesTable.insertRow();
    Object.values(resource).forEach(text => {
        let cell = row.insertCell();
        let textNode = document.createTextNode(text);
        cell.appendChild(textNode);
    });
});

const fetchWeatherData = async (city) => {
    const apiKey = 'ddf1ad5e7465f6f037dfbb822f347900'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeatherData(data); // Function to display the data
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

function displayWeatherData(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    if (data.main) {
        const tempCelsius = (data.main.temp - 273.15).toFixed(2); 

        weatherDisplay.innerHTML = `
            <p><strong>${data.name}</strong>: ${data.weather[0].main}, ${tempCelsius}°C</p>
        `;
    } else {
        weatherDisplay.innerHTML = '<p>Weather data not available</p>';
    }
}


document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('weatherCity').value;
    fetchWeatherData(city);
});

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("mapView"), {
        center: { lat: 53.234, lng: -0.538 }, 
        zoom: 8,
    });
}

document.getElementById('resourceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve form data
    var resourceType = document.getElementById('resourceType').value;
    var resourceName = document.getElementById('resourceName').value;
    var quantity = document.getElementById('quantity').value;
    var status = document.getElementById('status').value;
    var location = document.getElementById('location').value;

    // Generate a mock Resource ID
    var resourceId = "00" + (resourcesTable.rows.length);

    // Function to capitalize the first letter
    function capitalizeFirstLetter(string) {
        return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    // Capitalize the first letter of the resource name
    resourceName = capitalizeFirstLetter(resourceName);
    resourceType = capitalizeFirstLetter(resourceType);
    status = capitalizeFirstLetter(status);
    location = capitalizeFirstLetter(location);

    // Append 'L' or 'units' to quantity based on resource type
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

document.getElementById('searchResources').addEventListener('input', function(event) {
    const searchQuery = event.target.value.toLowerCase();
    const rows = document.getElementById("resourcesTable").rows;

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        let row = rows[i];
        let text = row.textContent.toLowerCase();
        if (text.includes(searchQuery)) {
            row.style.display = ""; // Show the row
        } else {
            row.style.display = "none"; // Hide the row
        }
    }
});

function saveResourcesToLocalStorage() {
    var resources = [];
    const rows = document.getElementById("resourcesTable").rows;

    for (let i = 1; i < rows.length; i++) { 
        let resource = {
            id: rows[i].cells[0].innerText,
            resourceType: rows[i].cells[1].innerText,
            location: rows[i].cells[2].innerText, // Adding location here
            name: rows[i].cells[3].innerText,
            quantity: rows[i].cells[4].innerText,
            status: rows[i].cells[5].innerText // Adjust the index for status
        };
        resources.push(resource);
    }

    localStorage.setItem('resources', JSON.stringify(resources));
}

function loadResourcesFromLocalStorage() {
    const storedResources = localStorage.getItem('resources');
    if (storedResources) {
        const resources = JSON.parse(storedResources);
        resources.forEach(resource => addToTable(resource));
    }
}

function addToTable(resource) {
    let newRow = resourcesTable.insertRow();
    Object.values(resource).forEach(text => {
        let cell = newRow.insertCell();
        let textNode = document.createTextNode(text);
        cell.appendChild(textNode);
    });
}

document.addEventListener('DOMContentLoaded', loadResourcesFromLocalStorage);
