# Note AI — AI Notes Summarizer

Note AI is a web application that helps you turn long notes into concise, easy-to-understand summaries. It uses AI to extract key points, identify important keywords, and explain complex information in simple language.

## 🌐 Live Demo

**Deployed Website:** https://note-ai-summarizer.vercel.app/

**GitHub Repository:** https://github.com/Tanupriya91/note-ai

## ✨ Features

- **AI-Powered Summarization:** Convert lengthy notes into concise summaries.
- **Key Points Extraction:** Quickly understand the most important information.
- **Keyword Identification:** Extract important terms with their meanings.
- **Simple Explanations:** Understand complex topics in beginner-friendly language.
- **Clean User Interface:** A minimal, distraction-free experience.
- **Copy Results:** Easily copy generated summaries and explanations.
- **Fast Processing:** Generate useful summaries using Google's Gemini API.

## 🛠️ Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI Integration:** Google Gemini API
- **Deployment:** Vercel
- **Package Manager:** pnpm

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Tanupriya91/note-ai.git
cd note-ai
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Get an API key from [Google AI Studio](https://aistudio.google.com/apikey).

**Important:** Keep your API key private. Never commit `.env.local` or expose your API key in frontend code.

### 4. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
note-ai/
├── app/
│   ├── api/
│   │   └── summarize/
│   │       └── route.ts
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── public/
├── .env.local
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | API key used by the server to access Google's Gemini API |

Configure the same environment variable in your Vercel project settings before deploying.

## 🌍 Deployment

The application is deployed on Vercel.

- **Live Application:** https://note-ai-summarizer.vercel.app/
- **Source Code:** https://github.com/Tanupriya91/note-ai

To deploy your own version, import the repository into Vercel, configure the required environment variables, and deploy the project.

## 🎯 Purpose

Note AI aims to make studying, revising, and understanding information easier by transforming lengthy notes into clear, structured, and beginner-friendly content.

## 📄 License

This project is available on GitHub. Add a license file if you intend to distribute it under a specific open-source license.
