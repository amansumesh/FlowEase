# FlowEase - ML-Powered Workflow & Task Management System

A ML-powered **Workflow Management System** that uses a machine learning model to analyze emails, extract tasks and deadlines, automatically assign priorities, and display them on a user-friendly frontend with task and calendar views. The goal of FlowEase is to reduce manual task tracking and help users focus on what truly matters.

---

## Project Overview

FlowEase converts **unstructured email content** into **structured tasks** using a combination of **machine learning, NLP, and rule-based logic**.

The system allows users to:

- Analyze incoming emails automatically
- Classify email priority (High / Medium / Low / Ignore)
- Extract deadlines from natural language text
- Filter promotional and irrelevant emails
- Prevent duplicate task creation
- Store tasks securely
- Display tasks on a frontend dashboard

The project focuses on **real-world backend design, ML integration, and clean architecture**.

---

## Objectives

- Build an ML-powered email priority classifier  
- Extract deadlines from natural language text  
- Design a scalable FastAPI backend  
- Integrate ML inference with application logic  
- Ensure timezone-aware and duplicate-safe task handling  
- Follow clean Git workflows and best practices  

---

## Tech Stack

| Technology | Purpose |
|-----------|--------|
| Node.js | Core backend & API orchestration |
| Express.js | REST API framework |
| FastAPI | ML inference service |
| Python | Machine learning & NLP logic |
| Scikit-learn | Email priority classification model |
| Pickle (.pkl) | ML model & vectorizer serialization |
| Regex & Dateparser | Deadline extraction |
| MongoDB | Task and email data storage |
| React | Frontend user interface |
| Tailwind CSS | UI styling |
| JavaScript | Client-side & backend logic |
| Git & GitHub | Version control |
---

## System Architecture

1. **Email Ingestion**
   - Email subject and body are sent to the backend API.

2. **Noise Filtering**
   - Promotional emails are filtered using keyword-based rules.
   - Newsletters and marketing emails are ignored early.

3. **ML Priority Classification**
   - Cleaned email text is passed to a trained ML model.
   - The model predicts priority: High, Medium, Low, or Ignore.

4. **Deadline Extraction**
   - Numeric dates extracted using regex.
   - Natural language dates parsed using `dateparser`.
   - Only date-relevant lines are processed for accuracy.

5. **Task Validation**
   - Timezone normalization (Asia/Kolkata).
   - Duplicate task detection.
   - Invalid or past dates are safely ignored.

6. **Task Storage & Display**
   - Valid tasks are stored in MongoDB.
   - Tasks are displayed in the frontend dashboard.

---

## Backend Workflow

| Step | Description |
|----|------------|
| Clean Text | Remove URLs, emojis, symbols |
| Classify | ML-based priority prediction |
| Extract Date | Regex + NLP parsing |
| Validate | Timezone & duplicate checks |
| Persist | Store tasks in database |

---

## Machine Learning Model

- **Vectorizer:** TF-IDF  
- **Model Type:** Supervised classification model  
- **Purpose:** Email priority classification  

### Model Artifacts
- `priority_model.pkl`
- `vectorizer.pkl`

These serialized `.pkl` files are loaded at runtime by the FastAPI service to ensure reproducible deployment.

---

## Duplicate & Safety Handling

- Duplicate tasks are automatically skipped.
- Promotional emails are ignored.
- Only valid and future deadlines are stored.

---

## Version Control Using Git & GitHub

The project follows professional Git practices:

- Feature development on `dev` branch
- Clean commit history
- Proper `.gitignore` handling
- ML integration merged into `main`
- Descriptive commit messages
