# 🤟 Real-Time Sign Language Detection

A real-time American Sign Language (ASL) detection web application that uses a webcam interface built with **Next.js** and a backend powered by **Flask** and a trained deep learning model. The system detects ASL alphabets from video input and displays the interpreted character on screen.

---

##  Problem Statement

Communication barriers exist for people with hearing and speech impairments, especially when interacting with those unfamiliar with sign language. There is a need for an assistive tool that can interpret sign language in real time and display the corresponding text.

---

##  Proposed Solution

This project implements a computer vision system that captures webcam video input, sends it to a backend for processing, and returns the predicted ASL sign. The system is built with:

- **Next.js (Frontend)**: For a responsive and interactive UI with real-time webcam input.
- **Flask (Backend)**: To handle image processing and serve predictions from the trained model.
- **CNN (Convolutional Neural Network)**: Trained using the custom created dataset

-  Features:
- Real-time webcam capture
- Deep learning-based sign classification
- Clean and responsive UI with Bootstrap
- Sign guide for reference
- Start/Stop detection controls

- Backend Setup (Flask)
- cd backend
- pip install -r requirements.txt
- python app.py

- Frontend Setup (Next.js)
- cd frontend
- npm install
- npm run dev
- Access the frontend at: http://localhost:3000

