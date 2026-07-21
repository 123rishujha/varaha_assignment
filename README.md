# Varaha Assignment

An interactive map application built with **React**, **Mapbox GL JS**, and **Turf.js** that supports drawing and geospatial operations on the map.

---

## 🛠️ Tech Stack

| Tech                   | Version |
| ---------------------- | ------- |
| React                  | ^19.2.7 |
| Mapbox GL JS           | ^3.26.0 |
| @mapbox/mapbox-gl-draw | ^1.5.1  |
| @turf/turf             | ^7.3.5  |
| Vite                   | ^8.1.1  |

---

## ⚙️ Prerequisites

Make sure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) (v18 or above recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A **Mapbox Access Token** — get one free at [mapbox.com](https://account.mapbox.com/)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/123rishujha/varaha_assignment.git
cd varaha_assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project:

```bash
touch .env
```

Add your Mapbox token inside `.env`:

```env
VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
```

> ⚠️ Never commit your `.env` file — it's already in `.gitignore`.

### 4. Start the development server

```bash
npm run dev
```

Open your browser and go to: `http://localhost:5173`

---

## 📦 Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build the project for production     |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint to check for code issues  |

---

## 📁 Project Structure

```
varaha_assignment/
├── public/          # Static assets
├── src/             # React source code
├── .env             # Environment variables (not committed)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## 🔑 Environment Variables

| Variable            | Description                     |
| ------------------- | ------------------------------- |
| `VITE_MAPBOX_TOKEN` | Your Mapbox public access token |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👤 Author

**Rishu Jha** — [GitHub](https://github.com/123rishujha)
