<div align="center">
  <img src="https://img.shields.io/badge/MetroSense-AI%20Delhi%20Metro%20Assistant-blue?style=for-the-badge&logo=train&logoColor=white" />
  
  <h1>🚇 MetroSense</h1>
  <p><b>Your AI-Powered Delhi Metro Companion</b></p>

  <a href="https://metro-sense.netlify.app">
    <img src="https://img.shields.io/badge/Live%20Demo-metro--sense.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" />
  </a>
  <a href="https://www.figma.com/design/F2XJGp11Tjq8nGpPRZyUXr/Delhi-Metro-Assistant-Prototype">
    <img src="https://img.shields.io/badge/Figma%20Design-View%20Prototype-F24E1E?style=for-the-badge&logo=figma&logoColor=white" />
  </a>
  <a href="https://github.com/vivekbhattacharya01-gif/Metro-sense">
    <img src="https://img.shields.io/badge/GitHub-Metro--sense-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>

  <br/><br/>

  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
  ![Groq](https://img.shields.io/badge/Groq_LLaMA_3-F55036?style=flat-square&logoColor=white)
  ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat-square&logoColor=white)
  ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)
</div>

---

## ✨ What is MetroSense?

MetroSense is an **original idea** — a modern, AI-powered companion app for Delhi Metro commuters. I identified that the official DMRC app and website lack AI assistance, natural language support, and a clean mobile experience. So I built one from scratch.

The entire product — from idea to Figma design to working app — was built independently.

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🤖 **AI Trip Planner** | Ask in plain English — get route, fare, interchange info and smart tips instantly |
| 📡 **Real-Time Tracker** | Live train arrival predictions and crowd level estimates |
| 🗺️ **Route Finder** | Find the best route between any two stations |
| 🔔 **Travel Alarm** | Get notified before your destination arrives |
| ₹ **Fare Calculator** | Instant fare estimate between stations |
| 📶 **Live Status** | Real-time line status and disruption alerts |
| ℹ️ **Station Info** | Facilities, landmarks and interchange details per station |
| 🌗 **Dark / Light Mode** | Full theme support |
| 🇮🇳 **Hindi / English** | Language toggle for wider accessibility |

---

## 🤖 AI Trip Planner — Powered by Groq LLaMA 3

The standout feature. Ask anything in natural language:

- *"How do I get from Dwarka to Connaught Place?"*
- *"Cheapest route to the airport?"*
- *"Which line should I take from INA to Vaishali?"*
- *"Best time to travel to avoid crowds?"*

The AI responds with the best route, line names, interchange stations, estimated time, fare, and a smart travel tip — all in seconds.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| AI Model | Groq LLaMA 3.3 70B |
| Design | Figma |
| Deployment | Netlify |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/vivekbhattacharya01-gif/Metro-sense.git
cd Metro-sense

# Install dependencies
npm install

# Create environment file
echo "GROQ_API_KEY=your_key_here" > .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📁 Project Structure

```
Metro-sense/
├── app/
│   ├── api/chat/route.ts     ← AI API route (Groq)
│   ├── page.tsx              ← Main app with tab navigation
│   └── globals.css
├── components/
│   └── metro/
│       ├── AiTripPlanner.tsx ← AI chat interface
│       ├── Dashboard.tsx     ← Home screen
│       ├── RealTimeTracker.tsx
│       ├── RouteFinder.tsx
│       ├── TravelAlarm.tsx
│       ├── FareCalculator.tsx
│       ├── LiveStatus.tsx
│       └── StationInfo.tsx
├── lib/
│   ├── metroData.ts          ← Delhi Metro station & line data
│   ├── aiService.ts          ← AI prediction service
│   └── language-context.tsx  ← Hindi/English i18n
└── .env.local                ← API keys (not committed)
```

---

## 🌐 Deployment

Deployed on **Netlify** with environment variables configured in the dashboard.

For your own deployment:
1. Push to GitHub
2. Connect repo on [netlify.com](https://netlify.com)
3. Add `GROQ_API_KEY` in Site Settings → Environment Variables
4. Deploy

---

## 🎨 Design

The UI was first designed as a **Figma prototype** before any code was written — following a proper product design workflow.

👉 [View Figma Prototype](https://www.figma.com/design/F2XJGp11Tjq8nGpPRZyUXr/Delhi-Metro-Assistant-Prototype)

---

## ⚠️ Disclaimer

This is an independent project built for learning and portfolio purposes. It is not affiliated with Delhi Metro Rail Corporation (DMRC).

Emergency: **155370**

---

## 👤 Author

**Vivek Bhattacharya**
- 🌐 Portfolio: [manga-portfolio.netlify.app](https://manga-portfolio.netlify.app)
- 💼 LinkedIn: [vivek-bhattacharya-9a661528a](https://www.linkedin.com/in/vivek-bhattacharya-9a661528a)
- 📧 Email: vivekbhattacharya01@gmail.com

---

<div align="center">
  <i>⭐ If you found this useful, consider starring the repo!</i>
</div>
