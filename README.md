# orbital25

Team 7212 Orbital 25

# TradeConnect

**TradeConnect** is a gamified stock trading simulator that empowers users to learn investing through real-time stock data, risk-free trading, and social features. Designed for Orbital 2025, it promotes financial literacy through interactive simulations and peer engagement.

## 🚀 Features

- ✅ User Authentication (Sign Up / Log In)
- 📊 Dashboard with live stock data (via [Finnhub API](https://finnhub.io))
- 💸 Place Buy/Sell orders
- 📁 Personal Portfolio with:
- 🧾 Transaction History of executed trades
- ⏳ Pending Orders page for limit order tracking
- 👥 Social Feed showing friends' trading activity
- ❤️ Watchlist for tracking selected stocks
- 🔍 Friend Search and Requests system
- 🏆 Leaderboard showing top traders
- 🧭 Responsive Navigation bar

> 🛠️ Future plans: Portfolio analytics, mini strategy games, and filtered leaderboards.

---

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Material UI
- **Backend**: Django + Django REST Framework
- **Database**: SQLite3 (Django)
- **Authentication**: Django Auth + JWT
- **Stock Data API**: [Finnhub](https://finnhub.io)

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- npm / pip

### Setup

1. Clone the Repository

```
gh repo clone UnhelpfulYoda149/orbital25
```

2. Install Frontend Dependencies

```
cd orbital25/my-app
npm install
```

3. Environment Variables
   Create a .env file in my-app

```
REACT_APP_API_URL=http://localhost:8000
```

4. Install Backend Dependencies

```
cd orbital25/backend
pip install -r backend_requirements.txt
python manage.py migrate
```

5. Environment Variables
   Create a .env file in backend

```
REACT_APP_FINNHUB_KEY=d0t6tapr01qid5qd4bb0d0t6tapr01qid5qd4bbg
```

6. Run the backend

```
python manage.py runserver
```

7. Run the frontend

```
npm start
```
