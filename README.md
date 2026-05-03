<div align="center">

# 🗳️ CivicFlow | Your Election Roadmap

### *Democracy Defined. Clarity Delivered.*

**An AI-powered civic education platform that transforms the complex mechanics of the electoral process into a scannable, interactive journey — powered by Google Gemini.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_Here-emerald?style=for-the-badge)](https://civicflow-your-election-roadmap-768123124087.europe-west1.run.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Sourabh-Singh-Chuphal/Civicflow-your-election-roadmap)
[![Built with Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Deployed on Cloud Run](https://img.shields.io/badge/Deployed_on-Google_Cloud_Run-4285F4?style=for-the-badge&logo=google-cloud)](https://cloud.google.com/run)

---

> 🏆 **Built for Google Prompt Wars Competition** — *Election Process Education Challenge*

</div>

---

## ✨ What is CivicFlow?

The civic roadmap shouldn't be a maze. **CivicFlow** structures the 2026 election cycle into a beautiful, scannable, interactive experience. Every voter requirement, every deadline, and every procedure — now accessible via a specialized AI engine trained on constitutional guidelines and regional procedural mandates.

Whether you're a first-time voter or a civic educator, CivicFlow gives you **machine-assisted clarity** on the democratic process.

---

## 🎯 Key Features

| Feature | Description |
|---|---|
| 🗺️ **Sequential Roadmap** | A visual, grid-style timeline covering every stage of the election cycle — from Voter Registration to Election Day |
| 🤖 **AI Intelligence (The Lab)** | A Gemini-powered assistant that answers complex voting queries in real time with educational, non-partisan accuracy |
| ⚡ **Quick-Start Prompts** | Pre-built questions get you answers in one click — no typing required |
| 📱 **Fully Responsive** | Seamlessly adapts from mobile to desktop with a premium editorial design |
| 🎨 **Premium Editorial UI** | High-end "Swiss-style" typography using Playfair Display + JetBrains Mono |

---

## 🚀 Live Demo

> 👉 **[https://civicflow-your-election-roadmap-768123124087.europe-west1.run.app](https://civicflow-your-election-roadmap-768123124087.europe-west1.run.app)**

Try asking the AI:
- *"How do I register to vote in 2026?"*
- *"What identification is required at polling stations?"*
- *"Show me the key dates for the upcoming election cycle."*
- *"How are mail-in ballots verified?"*

---

## 🛠️ Tech Stack

```
Frontend  →  React 19 + TypeScript + Vite 6 + TailwindCSS v4
Animation →  Motion (Framer Motion)
Icons     →  Lucide React
AI Engine →  Google Gemini API (@google/genai)
Backend   →  Express.js (secure API proxy)
Hosting   →  Google Cloud Run
Fonts     →  Playfair Display + Inter + JetBrains Mono
```

---

## 🏗️ Architecture

```
Browser (React App)
     │
     │  POST /api/chat
     ▼
Express Server (server.js)
     │
     │  Secure API call with GEMINI_API_KEY
     ▼
Google Gemini API
     │
     ▼
AI Response → Back to User
```

> ✅ The API key **never touches the browser** — all Gemini calls are proxied securely through the backend server.

---

## 💻 Run Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repository
git clone https://github.com/Sourabh-Singh-Chuphal/Civicflow-your-election-roadmap.git
cd Civicflow-your-election-roadmap

# 2. Install dependencies
npm install

# 3. Set up your environment
cp .env.example .env
# Edit .env and add your Gemini API Key:
# GEMINI_API_KEY=your_actual_api_key_here

# 4. Start the development server
npm run dev

# 5. Open http://localhost:3000
```

Get your free Gemini API Key at **[Google AI Studio](https://aistudio.google.com/app/apikey)**.

---

## 📁 Project Structure

```
civicflow/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation with mobile menu
│   │   ├── Hero.tsx            # Landing section with animated blobs
│   │   ├── ElectionTimeline.tsx # Sequential roadmap cards
│   │   ├── AIAssistant.tsx     # Gemini-powered chat interface
│   │   └── Footer.tsx          # Footer
│   ├── services/
│   │   └── gemini.ts           # API service layer
│   └── constants.ts            # Election steps data
├── server.js                   # Express backend + /api/chat proxy
├── Dockerfile                  # Multi-stage Docker build
└── vite.config.ts              # Vite configuration
```

---

## 🌐 Deployment

This project is containerized with Docker and deployed on **Google Cloud Run** for automatic scaling, zero cold-start optimization, and a permanent public URL.

```dockerfile
# Multi-stage build: compile → production-ready image
FROM node:20-slim AS builder → npm run build
FROM node:20-slim → serve via Express
```

---

<div align="center">

**Built with ❤️ for Google Prompt Wars 2026**

*"Navigating the complex mechanics of the electoral process with machine-assisted clarity."*

</div>
