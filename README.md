# 📸 PokéBag OCR & Investment Advisor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen)]()

A local Pokémon Go inventory tool that converts screenshots into structured JSON using OCR. Designed to help players analyze their collection and get AI-powered investment guidance for PvP leagues.

> **Privacy First**: No game automation. No API scraping. All processing happens locally in the browser.

## 📋 Table of Contents

- [Features](#-features)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Usage](#-usage)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Use Cases](#-use-cases)
- [Limitations](#-limitations)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Legal](#-legal)

## 🚀 Features

- 📸 Upload Pokémon list screenshot
- 🔎 Extract Pokémon name & CP using OCR
- 📦 Convert results into structured JSON
- 💾 Store your collection locally
- 🔍 Search within your Pokémon inventory
- 🤖 Generate AI-based Master League investment suggestions
- ✍️ Manually edit IV and additional stats (optional)

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ or later
- npm or yarn
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pogo-inventory-ai.git
   cd pogo-inventory-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Open Pokémon tab in Pokémon Go**
2. **Take screenshot** (name + CP visible)
3. **Upload screenshot** to the application
4. **OCR extracts**: Pokémon name and CP value
5. **Review & edit** the extracted data
6. **Get AI suggestions** for Master League optimization

### Example Output

```json
[
  { "name": "Dialga", "cp": 4032 },
  { "name": "Mewtwo", "cp": 4178 }
]
```

## 🧠 How It Works

The application workflow is simple and privacy-focused:

1. **Screenshot Upload** - Select a Pokémon inventory screenshot
2. **OCR Processing** - Tesseract.js extracts Pokémon names and CP values locally
3. **Data Structuring** - Results are converted to JSON format
4. **Local Storage** - Data is saved in your browser's LocalStorage
5. **AI Analysis** (Optional) - Send to OpenAI for investment suggestions
6. **Display & Edit** - View, search, and manually adjust your collection

All processing is done client-side. No data is sent to external servers without your explicit consent.

## 🎯 Use Cases

- 🏆 Master League team planning
- 💰 Investment prioritization (XL vs non-XL)
- 🔍 Collection search & filtering
- 📊 Long-term Pokémon tracking

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tesseract.js** | OCR processing |
| **LocalStorage** | Client-side data persistence |
| **OpenAI API** | Optional AI analysis (optional) |

## ⚠️ Limitations

- OCR accuracy depends on screenshot clarity
- IV values must be entered manually (MVP)
- No live battle simulation
- Local-only storage (no sync across devices)
- Requires JavaScript enabled in browser

## 🔮 Future Improvements

- [ ] Multi-screenshot merge capability
- [ ] Detail screen OCR (IV parsing)
- [ ] League-based scoring system
- [ ] PvP meta dataset integration
- [ ] Offline PWA mode
- [ ] Cross-device sync support
- [ ] Batch upload functionality
- [ ] Export to CSV/PDF

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 Legal

- This project is **not affiliated** with Niantic or Pokémon
- It does **not interact** with the game or automate gameplay
- It only processes **user-provided screenshots**
- Users are responsible for complying with Pokémon Go's Terms of Service

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.