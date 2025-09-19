import streamlit as st
import pandas as pd
import time
import requests # This would be used to connect to your backend API

# --- 1. Page Configuration and Theme ---
st.set_page_config(
    page_title="Health Navigator 🩺",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded",
)

# --- Custom CSS for professional dark theme ---
st.markdown("""
    <style>
    .stApp {
        background-color: #0f1116;
        color: #f0f2f6;
    }
    .main-title {
        text-align: center;
        font-size: 3rem;
        font-weight: bold;
        color: #bb86fc; /* A vibrant purple for titles */
        margin-bottom: 0.5rem;
    }
    .subtitle {
        text-align: center;
        color: #89b4f4; /* A light blue for subtitles */
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }
    .stTextInput>div>div>input, .stTextArea>div>div>textarea {
        background-color: #24262c;
        border-radius: 8px;
        border: 2px solid #44474e;
        color: #f0f2f6;
        padding: 10px;
    }
    .stButton>button {
        border-radius: 8px;
        background-color: #89b4f4; /* Light blue button */
        color: #0f1116;
        font-weight: bold;
        transition: background-color 0.3s;
    }
    .stButton>button:hover {
        background-color: #6a95e2;
    }
    .prediction-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 700px;
        background: #1c1e24; /* Darker background for pop-up */
        border-radius: 16px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        padding: 2rem;
        z-index: 1000;
        backdrop-filter: blur(5px);
    }
    .prediction-card {
        border-left: 5px solid;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        background-color: #2c2f37;
    }
    .red-border { border-left-color: #ef5350 !important; }
    .yellow-border { border-left-color: #ffca28 !important; }
    .green-border { border-left-color: #66bb6a !important; }
    .card-title {
        font-weight: bold;
        font-size: 1.2rem;
        color: #f0f2f6;
    }
    .stDataFrame {
        border-radius: 8px;
        background-color: #2c2f37;
    }
    .stDataFrame > div > div > div > div > div {
        color: #f0f2f6;
    }
    .stSidebar {
        background-color: #1a1c22;
        color: #f0f2f6;
    }
    </style>
    """, unsafe_allow_html=True)

# --- Mock Data and Functions ---
# In a real application, this would be a secure database
MOCK_USERS = {
    "patient": "patientpass",
    "doctor": "doctorpass",
    "john.doe": "johndoe123"
}

# --- Mock prediction logic (in a real app, this would be an API call to your backend)
def predict_diseases(symptoms):
    """Simulates an API call to the backend's /predict endpoint."""
    st.info("Simulating API call to backend...")
    time.sleep(2)
    symptoms_lower = symptoms.lower()
    
    # This is dummy data, your backend would return real predictions
    if "fever" in symptoms_lower and "cough" in symptoms_lower:
        return [
            {"name": "Influenza", "probability": 90, "color": "red"},
            {"name": "Common Cold", "probability": 65, "color": "yellow"},
            {"name": "Bronchitis", "probability": 40, "color": "green"}
        ]
    elif "headache" in symptoms_lower and "nausea" in symptoms_lower:
        return [
            {"name": "Migraine", "probability": 95, "color": "red"},
            {"name": "Tension Headache", "probability": 70, "color": "yellow"},
            {"name": "Sinusitis", "probability": 50, "color": "green"}
        ]
    else:
        return [
            {"name": "Common Cold", "probability": 80, "color": "red"},
            {"name": "Allergies", "probability": 55, "color": "yellow"},
            {"name": "Minor Viral Infection", "probability": 30, "color": "green"}
        ]

# --- 2. Session State Initialization ---
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False
    st.session_state.username = ""
    st.session_state.is_admin = False
    st.session_state.history = pd.DataFrame(columns=['Username', 'Symptoms', 'Prediction', 'Date', 'Time'])
    st.session_state.show_pop_up = False
    st.session_state.top_predictions = []
    st.session_state.page = "Symptom Checker"

# --- Page Navigation and State Management ---
def logout():
    """Resets session state to log the user out."""
    st.session_state.logged_in = False
    st.session_state.username = ""
    st.session_state.is_admin = False
    st.session_state.show_pop_up = False
    st.session_state.page = "Symptom Checker"
    st.experimental_rerun()

def show_login_page():
    st.markdown('<h1 class="main-title">Welcome to Health Navigator</h1>', unsafe_allow_html=True)
    st.markdown('<p class="subtitle">Your first step to a healthier you.</p>', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        with st.container(border=True):
            st.subheader("Login to your account")
            username = st.text_input("Username")
            password = st.text_input("Password", type="password")
            
            if st.button("Login", use_container_width=True):
                if username in MOCK_USERS and MOCK_USERS[username] == password:
                    st.session_state.logged_in = True
                    st.session_state.username = username
                    st.session_state.is_admin = (username == "doctor")
                    st.success(f"Welcome back, {username}!")
                    time.sleep(1)
                    st.experimental_rerun()
                else:
                    st.error("Invalid username or password.")
        st.markdown("<div style='text-align: center; margin-top: 1rem; color: #aaa;'>Don't have an account? Sign up now! (coming soon)</div>", unsafe_allow_html=True)

def show_patient_dashboard():
    with st.sidebar:
        st.subheader(f"Hello, {st.session_state.username} 👋")
        st.markdown("---")
        st.button("Symptom Checker", on_click=lambda: st.session_state.update(page="Symptom Checker"), use_container_width=True)
        st.button("My History", on_click=lambda: st.session_state.update(page="My History"), use_container_width=True)
        st.markdown("---")
        st.button("Logout", on_click=logout, use_container_width=True)

    if st.session_state.page == "Symptom Checker":
        st.title("Symptom Checker")
        st.info("Enter your symptoms below to get a prediction.")
        
        symptoms = st.text_area("Describe your symptoms:", height=150)
        
        if st.button("Get Prediction", use_container_width=True):
            if symptoms:
                with st.spinner("Analyzing symptoms..."):
                    st.session_state.top_predictions = predict_diseases(symptoms)
                
                # Update history
                now = pd.Timestamp.now()
                new_entry = pd.DataFrame([{
                    'Username': st.session_state.username,
                    'Symptoms': symptoms,
                    'Prediction': st.session_state.top_predictions[0]['name'],
                    'Date': now.strftime('%Y-%m-%d'),
                    'Time': now.strftime('%H:%M:%S')
                }])
                st.session_state.history = pd.concat([st.session_state.history, new_entry], ignore_index=True)
                
                st.session_state.show_pop_up = True
                st.experimental_rerun()
            else:
                st.warning("Please describe your symptoms.")

        # The Prediction Pop-up Layout
        if st.session_state.show_pop_up:
            st.markdown('<div class="prediction-container">', unsafe_allow_html=True)
            st.markdown("<h3 style='text-align: center;'>Possible Conditions</h3>", unsafe_allow_html=True)
            st.markdown("<p style='text-align: center; font-style: italic; color: #aaa;'>Please consult a healthcare professional for a definitive diagnosis.</p>", unsafe_allow_html=True)
            
            # Display each prediction with color-coded border
            colors = ["red", "yellow", "green"]
            for i, pred in enumerate(st.session_state.top_predictions):
                st.markdown(f'<div class="prediction-card {colors[i]}-border">', unsafe_allow_html=True)
                st.markdown(f'<p class="card-title">{pred["name"]}</p>', unsafe_allow_html=True)
                st.markdown(f'<p style="color:#aaa;">Probability: **{pred["probability"]}%**</p>', unsafe_allow_html=True)
                st.markdown('</div>', unsafe_allow_html=True)
            
            if st.button("Close"):
                st.session_state.show_pop_up = False
                st.experimental_rerun()
            st.markdown('</div>', unsafe_allow_html=True)
    
    elif st.session_state.page == "My History":
        st.title("My History 📖")
        user_history = st.session_state.history[st.session_state.history['Username'] == st.session_state.username]
        
        if not user_history.empty:
            st.dataframe(user_history.drop(columns=['Username']), hide_index=True, use_container_width=True)
        else:
            st.info("No history to display yet.")

def show_admin_dashboard():
    with st.sidebar:
        st.subheader(f"Hello, Dr. {st.session_state.username} 👨‍⚕️")
        st.markdown("---")
        st.button("Logout", on_click=logout, use_container_width=True)
    
    st.title("Doctor's Dashboard")
    st.info("View and filter all patient history records.")
    
    # History Checker Feature
    search_query = st.text_input("Search patients by username:")
    
    if st.session_state.history.empty:
        st.info("No patient records available yet.")
    else:
        filtered_history = st.session_state.history
        if search_query:
            filtered_history = filtered_history[filtered_history['Username'].str.contains(search_query, case=False)]
        
        st.dataframe(filtered_history.sort_values('Date', ascending=False), hide_index=True, use_container_width=True)

# --- Main App Logic ---
if not st.session_state.logged_in:
    show_login_page()
else:
    if st.session_state.is_admin:
        show_admin_dashboard()
    else:
        show_patient_dashboard()
