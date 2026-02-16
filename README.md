
# 🥭 Mango - AI Ad Creative Platform

Mango is a professional-grade AI application designed to generate high-converting Facebook, Instagram, and TikTok ad creatives. Unlike generic image generators, Mango uses a sophisticated **Multi-Agent System** that mimics a real-world creative agency workflow: Strategy → Art Direction → Production → Copywriting.

Built with **React 19**, **Tailwind CSS**, and powered by **Google's Gemini 3 Pro** models.

---

## 🚀 Key Features

### 🧠 Intelligent Agent Pipeline
- **Planner Agent**: Analyzes product info and audience psychographics to generate a strategic brief, hooks, and emotional angles.
- **Director Agent**: Translates the brief into technical photography directives (lighting, camera lenses, composition) and enforces brand guidelines.
- **Production Agent**: Generates high-fidelity assets using `gemini-3-pro-image-preview`.
- **Copywriter Agent**: Writes platform-specific primary text, headlines, and CTAs using direct-response frameworks.

### 🔥 Advanced Tools
- **Competitor Spy**: Upload a competitor's ad to deconstruct their strategy, find weaknesses, and generate a counter-creative.
- **Brand DNA System**: Define and store brand identities (Hex codes, fonts, tone of voice) to ensure consistent output.
- **Performance Prediction**: An AI scoring system that predicts Attention, Clarity, and Conversion potential before you spend ad budget.
- **Website Scraper**: Auto-fill campaign briefs by analyzing any product URL.
- **Creative Studio**: Built-in editor to add text overlays and hooks to generated images.
- **Batch Generator**: Agency-mode tool to generate concepts for multiple products simultaneously.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (Dark mode optimized)
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Visual Effects**: Three.js (Landing page light pillars)
- **State Management**: React Context + LocalStorage persistence
- **Icons**: Heroicons (via SVG)

---

## 🤖 AI Models Used

Mango leverages specific Gemini models for specialized tasks:

| Feature | Model | Purpose |
| :--- | :--- | :--- |
| **Strategy & Logic** | `gemini-3-pro-preview` | Complex reasoning, brief generation, competitor analysis. |
| **Image Generation** | `gemini-3-pro-image-preview` | High-fidelity ad creatives (1K resolution). |
| **Copywriting** | `gemini-3-flash-preview` | Fast, punchy text generation for headlines and captions. |

---

## ⚡ Supabase Database Setup

To make this app production-ready with a real backend, please refer to **[SUPABASE.md](./SUPABASE.md)**.

That file contains the complete SQL schema, Row Level Security (RLS) policies, and storage configuration required to deploy the backend features (Auth, Persistence, History).

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Cloud Project with Gemini API access enabled.
- An API Key with access to the `gemini-3-pro` series models.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/mango.git
    cd mango
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm start
    ```

### API Key Configuration
The app requires a valid Google GenAI API key.
- On first load, if running in a supported environment (like AI Studio), it may request the key automatically.
- Otherwise, ensure your environment provides `process.env.API_KEY` or follow the in-app prompts if configured for client-side entry.

---

## 🛡️ Privacy & Data

Mango processes data using Google's Gemini API.
- Generated images and campaign data are stored locally in the browser (`localStorage`) for persistence.
- No personal data is sent to third-party servers other than the necessary API calls to Google for generation.

---

## 📄 License

This project is licensed under the MIT License.
