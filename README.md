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

3. Install Backend Dependencies

```
cd orbital25/backend
pip install -r backend_requirements.txt
python manage.py migrate
```

4. Run the backend

```
python manage.py runserver
```

5. Run the frontend

```
npm start
```
