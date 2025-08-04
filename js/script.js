const BASE_URL = "https://api.nasa.gov/planetary/apod";
const API_KEY = "DEMO_KEY"; // user can register API key & use it instead of DEMO_KEY

const todayBtn = document.querySelector("#loadToday");
const dateBtn = document.querySelector("#loadByDate");
const randomBtn = document.querySelector("#loadRandom");
const rangeBtn = document.querySelector("#loadByRange");

const dateInput = document.querySelector("#dateInput");
const startDateInput = document.querySelector("#startDate");
const endDateInput = document.querySelector("#endDate");
const randomCountInput = document.querySelector("#randomCount");
const output = document.querySelector("#output");

// Event listeners
todayBtn.addEventListener("click", fetchTodayImage);
dateBtn.addEventListener("click", fetchImageByDate);
randomBtn.addEventListener("click", fetchRandomImages);
rangeBtn.addEventListener("click", fetchImagesByRange);

// Fetch today's image
function fetchTodayImage() {
    const url = `${BASE_URL}?api_key=${API_KEY}`;
    fetchData(url);
}

// Fetch image by specific date
function fetchImageByDate() {
    const date = dateInput.value;
    if (!date) {
        displayError("Please select a date");
        return;
    }
    const url = `${BASE_URL}?api_key=${API_KEY}&date=${date}`;
    fetchData(url);
}

// Fetch random images
function fetchRandomImages() {
    const count = randomCountInput.value || 3;
    const url = `${BASE_URL}?api_key=${API_KEY}&count=${count}`;
    fetchData(url, true);
}

// Fetch images by start and end date
function fetchImagesByRange() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
        displayError("Please select both start and end dates");
        return;
    }

    const url = `${BASE_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
    fetchData(url, true); // always returns array
}

// Fetch data from API
function fetchData(url, isArray = false) {
    output.innerHTML = "<p class='loading'>Loading data...</p>";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            output.innerHTML = "";
            if (isArray) {
                data.forEach(item => {
                    if (item.media_type === "image") {
                        displayResult(item);
                    }
                });
            } else {
                if (data.media_type === "image") {
                    displayResult(data);
                } else {
                    displayError("The media for this date is not an image");
                }
            }
        })
        .catch(err => {
            displayError(`Fetch error: ${err.message}`);
        });
}

// Display a single APOD result
function displayResult(item) {
    const card = document.createElement("article");
    card.className = "apod-card";

    const title = document.createElement("h2");
    title.textContent = item.title;

    const date = document.createElement("p");
    date.textContent = item.date;

    const img = document.createElement("img");
    img.src = item.url;
    img.alt = item.title;

    const explanation = document.createElement("p");
    explanation.textContent = item.explanation;

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(img);
    card.appendChild(explanation);

    output.appendChild(card);
}

// Display error message
function displayError(message) {
    output.innerHTML = "";
    const err = document.createElement("p");
    err.className = "error";
    err.textContent = message;
    output.appendChild(err);
}
