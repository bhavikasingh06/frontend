// --- DOM Element References ---
const loginPage = document.getElementById('login-page');
const patientDashboard = document.getElementById('patient-dashboard');
const doctorDashboard = document.getElementById('doctor-dashboard');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const logoutButtons = document.querySelectorAll('#logout-btn, #doctor-logout-btn');
const patientGreeting = document.getElementById('patient-greeting');
const doctorGreeting = document.getElementById('doctor-greeting');
const navButtons = document.querySelectorAll('.nav-btn');
const symptomCheckerBtn = document.getElementById('symptom-checker-btn');
const myHistoryBtn = document.getElementById('my-history-btn');
const symptomCheckerView = document.getElementById('symptom-checker-view');
const myHistoryView = document.getElementById('my-history-view');
const symptomsInput = document.getElementById('symptoms-input');
const getPredictionBtn = document.getElementById('get-prediction-btn');
const predictionPopup = document.getElementById('prediction-popup');
const predictionCardsContainer = document.getElementById('prediction-cards-container');
const closePopupBtn = document.getElementById('close-popup-btn');
const patientHistoryTableBody = document.querySelector('#patient-history-table tbody');
const allHistoryTableBody = document.querySelector('#all-history-table tbody');
const doctorSearchInput = document.getElementById('doctor-search');
const emptyHistoryMsgs = document.querySelectorAll('.empty-history-msg');

// --- Mock Data (replaces Streamlit session state) ---
let appState = {
isLoggedIn: false,
username: null,
isAdmin: false,
page: 'Symptom Checker',
history: JSON.parse(localStorage.getItem('healthNavigatorHistory')) || [],
};

// --- API Simulation (replaces Python functions) ---
function simulateApiCall(symptoms) {
return new Promise(resolve => {
setTimeout(() => {
const symptomsLower = symptoms.toLowerCase();
if (symptomsLower.includes("fever") && symptomsLower.includes("cough")) {
resolve([
{ name: "Influenza", probability: 90, color: "red" },
{ name: "Common Cold", probability: 65, color: "yellow" },
{ name: "Bronchitis", probability: 40, color: "green" }
]);
} else if (symptomsLower.includes("headache") && symptomsLower.includes("nausea")) {
resolve([
{ name: "Migraine", probability: 95, color: "red" },
{ name: "Tension Headache", probability: 70, color: "yellow" },
{ name: "Sinusitis", probability: 50, color: "green" }
]);
} else {
resolve([
{ name: "Common Cold", probability: 80, color: "red" },
{ name: "Allergies", probability: 55, color: "yellow" },
{ name: "Minor Viral Infection", probability: 30, color: "green" }
]);
}
}, 2000); // Simulate network delay
});
}

// --- UI Rendering Functions ---
function renderUI() {
loginPage.style.display = appState.isLoggedIn ? 'none' : 'flex';
patientDashboard.style.display = 'none';
doctorDashboard.style.display = 'none';

if (appState.isLoggedIn) {
    if (appState.isAdmin) {
        doctorDashboard.style.display = 'flex';
        doctorGreeting.textContent = `Hello, Dr. ${appState.username} 👨‍⚕️`;
        renderAllHistory(appState.history);
    } else {
        patientDashboard.style.display = 'flex';
        patientGreeting.textContent = `Hello, ${appState.username} 👋`;
        switchPatientView(appState.page);
    }
}

}

function switchPatientView(page) {
symptomCheckerBtn.classList.remove('active');
myHistoryBtn.classList.remove('active');
symptomCheckerView.style.display = 'none';
myHistoryView.style.display = 'none';

if (page === 'Symptom Checker') {
    symptomCheckerBtn.classList.add('active');
    symptomCheckerView.style.display = 'block';
} else if (page === 'My History') {
    myHistoryBtn.classList.add('active');
    myHistoryView.style.display = 'block';
    renderPatientHistory();
}

}

function renderPatientHistory() {
const userHistory = appState.history.filter(item => item.username === appState.username);
patientHistoryTableBody.innerHTML = '';
if (userHistory.length === 0) {
emptyHistoryMsgs[0].style.display = 'block';
} else {
emptyHistoryMsgs[0].style.display = 'none';
userHistory.forEach(item => {
const row = patientHistoryTableBody.insertRow();
row.innerHTML = <td>${item.date}</td> <td>${item.time}</td> <td>${item.symptoms}</td> <td>${item.prediction}</td>;
});
}
}

function renderAllHistory(history) {
allHistoryTableBody.innerHTML = '';
if (history.length === 0) {
emptyHistoryMsgs[1].style.display = 'block';
} else {
emptyHistoryMsgs[1].style.display = 'none';
history.forEach(item => {
const row = allHistoryTableBody.insertRow();
row.innerHTML = <td>${item.username}</td> <td>${item.date}</td> <td>${item.time}</td> <td>${item.symptoms}</td> <td>${item.prediction}</td>;
});
}
}

function renderPredictionCards(predictions) {
predictionCardsContainer.innerHTML = '';
const colors = ["red", "yellow", "green"];
predictions.forEach((pred, index) => {
const cardDiv = document.createElement('div');
cardDiv.className = prediction-card ${colors[index]}-border;
cardDiv.innerHTML = <p class="card-title">${pred.name}</p> <p style="color:#aaa;">Probability: <strong>${pred.probability}%</strong></p>;
predictionCardsContainer.appendChild(cardDiv);
});
}

// --- Event Listeners ---
loginButton.addEventListener('click', () => {
const username = usernameInput.value.trim();
const password = passwordInput.value.trim();

let isAuthenticated = false;
let isAdmin = false;

// Check for patient credentials
if (username === 'lakshya' && password === '1234') {
    isAuthenticated = true;
    isAdmin = false;
}
// Check for doctor credentials
else if (username === 'khushal' && password === '5678') {
    isAuthenticated = true;
    isAdmin = true;
}

if (isAuthenticated) {
    appState.isLoggedIn = true;
    appState.username = username;
    appState.isAdmin = isAdmin;
    alert(`Login successful! Welcome, ${username}.`);
    renderUI();
} else {
    alert("Invalid username or password. Please try again.");
}

});

logoutButtons.forEach(button => {
button.addEventListener('click', () => {
appState.isLoggedIn = false;
appState.username = null;
appState.isAdmin = false;
appState.page = 'Symptom Checker';
renderUI();
});
});

symptomCheckerBtn.addEventListener('click', () => {
appState.page = 'Symptom Checker';
switchPatientView(appState.page);
});

myHistoryBtn.addEventListener('click', () => {
appState.page = 'My History';
switchPatientView(appState.page);
});

getPredictionBtn.addEventListener('click', async () => {
const symptoms = symptomsInput.value.trim();
if (!symptoms) {
alert("Please describe your symptoms.");
return;
}

getPredictionBtn.disabled = true;
getPredictionBtn.textContent = 'Analyzing...';

const predictions = await simulateApiCall(symptoms);

const now = new Date();
const newEntry = {
    username: appState.username,
    symptoms: symptoms,
    prediction: predictions[0].name,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
};
appState.history.push(newEntry);
localStorage.setItem('healthNavigatorHistory', JSON.stringify(appState.history));

renderPredictionCards(predictions);
predictionPopup.classList.remove('hidden');

getPredictionBtn.disabled = false;
getPredictionBtn.textContent = 'Get Prediction';

});

closePopupBtn.addEventListener('click', () => {
predictionPopup.classList.add('hidden');
});

doctorSearchInput.addEventListener('input', (event) => {
const query = event.target.value.toLowerCase();
const filteredHistory = appState.history.filter(item =>
item.username.toLowerCase().includes(query)
);
renderAllHistory(filteredHistory);
});

// --- Initial Render ---
document.addEventListener('DOMContentLoaded', () => {
renderUI();
});
