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

// Patient Nav
const overviewBtn = document.getElementById('overview-btn');
const symptomCheckerBtn = document.getElementById('symptom-checker-btn');
const bookAppointmentBtn = document.getElementById('book-appointment-btn');
const myHistoryBtn = document.getElementById('my-history-btn');

// Patient Views
const overviewView = document.getElementById('overview-view');
const symptomCheckerView = document.getElementById('symptom-checker-view');
const bookAppointmentView = document.getElementById('book-appointment-view');
const myHistoryView = document.getElementById('my-history-view');

const symptomsInput = document.getElementById('symptoms-input');
const getPredictionBtn = document.getElementById('get-prediction-btn');
const predictionPopup = document.getElementById('prediction-popup');
const predictionCardsContainer = document.getElementById('prediction-cards-container');
const closePopupBtn = document.getElementById('close-popup-btn');
const patientHistoryTableBody = document.querySelector('#patient-history-table tbody');
const emptyHistoryMsgs = document.querySelectorAll('.empty-history-msg');

// Doctor Nav
const doctorHistoryBtn = document.getElementById('doctor-history-btn');
const doctorAppointmentsBtn = document.getElementById('doctor-appointments-btn');

// Doctor Views
const doctorHistoryView = document.getElementById('doctor-history-view');
const doctorAppointmentsView = document.getElementById('doctor-appointments-view');

const allHistoryTableBody = document.querySelector('#all-history-table tbody');
const doctorAppointmentsTableBody = document.querySelector('#doctor-appointments-table tbody');
const doctorSearchInput = document.getElementById('doctor-search');

// Book Appointment fields
const doctorSelect = document.getElementById('doctor-select');
const appointmentDateInput = document.getElementById('appointment-date');
const appointmentTimeInput = document.getElementById('appointment-time');
const bookBtn = document.getElementById('book-btn');

// --- Mock Data & State Management ---
let appState = {
isLoggedIn: false,
username: null,
isAdmin: false,
patientView: 'Overview',
doctorView: 'Patient History',
history: JSON.parse(localStorage.getItem('healthNavigatorHistory')) || [],
appointments: JSON.parse(localStorage.getItem('healthNavigatorAppointments')) || [],
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
        switchDoctorView(appState.doctorView);
    } else {
        patientDashboard.style.display = 'flex';
        patientGreeting.textContent = `Hello, ${appState.username} 👋`;
        switchPatientView(appState.patientView);
    }
}

}

function switchPatientView(view) {
const navButtons = document.querySelectorAll('#patient-dashboard .nav-btn');
const contentViews = document.querySelectorAll('#patient-dashboard .content-view');

navButtons.forEach(btn => btn.classList.remove('active'));
contentViews.forEach(v => v.classList.remove('active'));

document.getElementById(`${view.toLowerCase().replace(' ', '-')}-btn`).classList.add('active');
document.getElementById(`${view.toLowerCase().replace(' ', '-')}-view`).classList.add('active');

if (view === 'My History') {
    renderPatientHistory();
}

}

function switchDoctorView(view) {
const navButtons = document.querySelectorAll('#doctor-dashboard .nav-btn');
const contentViews = document.querySelectorAll('#doctor-dashboard .content-view');

navButtons.forEach(btn => btn.classList.remove('active'));
contentViews.forEach(v => v.classList.remove('active'));

document.getElementById(`doctor-${view.toLowerCase().replace(' ', '-')}-btn`).classList.add('active');
document.getElementById(`doctor-${view.toLowerCase().replace(' ', '-')}-view`).classList.add('active');

if (view === 'Patient History') {
    renderAllHistory(appState.history);
} else if (view === 'Upcoming Appointments') {
    renderDoctorAppointments();
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

function renderDoctorAppointments() {
const doctorAppointments = appState.appointments.filter(item => item.doctor === Dr. ${appState.username});
doctorAppointmentsTableBody.innerHTML = '';
if (doctorAppointments.length === 0) {
emptyHistoryMsgs[3].style.display = 'block';
} else {
emptyHistoryMsgs[3].style.display = 'none';
doctorAppointments.forEach(item => {
const row = doctorAppointmentsTableBody.insertRow();
row.innerHTML = <td>${item.patient}</td> <td>${item.date}</td> <td>${item.time}</td>;
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
    alert(`Login successful! Welcome, ${username}.`); // Use a custom modal in a real app
    renderUI();
} else {
    alert("Invalid username or password. Please try again."); // Use a custom modal
}

});

logoutButtons.forEach(button => {
button.addEventListener('click', () => {
appState.isLoggedIn = false;
appState.username = null;
appState.isAdmin = false;
appState.patientView = 'Overview';
appState.doctorView = 'Patient History';
renderUI();
});
});

// Patient Navigation
overviewBtn.addEventListener('click', () => {
appState.patientView = 'Overview';
switchPatientView(appState.patientView);
});
symptomCheckerBtn.addEventListener('click', () => {
appState.patientView = 'Symptom Checker';
switchPatientView(appState.patientView);
});
bookAppointmentBtn.addEventListener('click', () => {
appState.patientView = 'Book Appointment';
switchPatientView(appState.patientView);
});
myHistoryBtn.addEventListener('click', () => {
appState.patientView = 'My History';
switchPatientView(appState.patientView);
});

// Doctor Navigation
doctorHistoryBtn.addEventListener('click', () => {
appState.doctorView = 'Patient History';
switchDoctorView(appState.doctorView);
});
doctorAppointmentsBtn.addEventListener('click', () => {
appState.doctorView = 'Upcoming Appointments';
switchDoctorView(appState.doctorView);
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

bookBtn.addEventListener('click', () => {
const doctor = doctorSelect.value;
const date = appointmentDateInput.value;
const time = appointmentTimeInput.value;

if (!doctor || !date || !time) {
    alert("Please select a doctor, date, and time for your appointment.");
    return;
}

const newAppointment = {
    patient: appState.username,
    doctor: doctor,
    date: date,
    time: time
};

appState.appointments.push(newAppointment);
localStorage.setItem('healthNavigatorAppointments', JSON.stringify(appState.appointments));

alert("Appointment booked successfully!"); // Use a custom modal

// Clear inputs
appointmentDateInput.value = '';
appointmentTimeInput.value = '';

});

// --- Initial Render ---
document.addEventListener('DOMContentLoaded', () => {
renderUI();
});
