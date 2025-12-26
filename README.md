# 🪙 Cryptoverse - Cryptocurrency Tracking Application

A modern, feature-rich cryptocurrency tracking application built with React that provides real-time cryptocurrency data, market statistics, detailed coin information, exchange listings, and the latest crypto news.

![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🏠 Homepage
- **Global Crypto Statistics**: View comprehensive market stats including total cryptocurrencies, exchanges, market cap, and 24h trading volume
- **Top 10 Cryptocurrencies**: Quick overview of the top-performing cryptocurrencies
- **Latest News Feed**: Stay updated with the most recent cryptocurrency news

### 💰 Cryptocurrencies
- Browse up to **100 cryptocurrencies** with real-time data
- **Search Functionality**: Quickly find specific cryptocurrencies by name
- Display key metrics:
  - Current price
  - 24h price change percentage
  - Market capitalization
  - Rank
- Interactive cards with cryptocurrency logos and symbols

### 📊 Detailed Coin Information
- Comprehensive cryptocurrency details including:
  - Current price and market statistics
  - All-time high prices
  - Supply information (circulating, total)
  - Number of markets and exchanges
  - Historical price data
- **Interactive Line Charts**: Visualize price history across multiple timeframes:
  - 24 hours
  - 7 days
  - 30 days
  - 1 year
  - 5 years
- Social links and official websites
- Detailed descriptions and key information

### 📰 Crypto News
- Latest cryptocurrency news from multiple sources
- Article cards with:
  - Thumbnails
  - Publication date
  - Source information
  - Direct links to full articles
- Filter news by specific cryptocurrencies

### 🏢 Exchanges
- Comprehensive list of cryptocurrency exchanges
- Exchange information and rankings

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.3.1**: Modern React with hooks
- **React Router DOM 6.30.2**: Client-side routing
- **React Redux 9.2.0**: State management
- **Redux Toolkit 2.11.2**: Efficient Redux development

### UI Components & Styling
- **Ant Design (antd) 5.23.4**: Professional UI component library
- **Ant Design Icons 5.5.2**: Icon system
- **Custom CSS**: Additional styling

### Data Visualization
- **Chart.js 4.5.1**: Powerful charting library
- **React-Chartjs-2 5.3.1**: React wrapper for Chart.js
- **chartjs-adapter-moment 1.0.1**: Time scale support
- **Moment.js 2.30.1**: Date and time formatting

### Utilities
- **Axios 1.13.2**: HTTP client for API requests
- **Millify 6.1.0**: Number formatting (e.g., 1M, 1B)
- **html-react-parser 5.2.11**: HTML string parsing

### APIs
- **CoinGecko API v3**: Free cryptocurrency data (no API key required)
- **CryptoCompare API**: Cryptocurrency news feed

## 📁 Project Structure

```
cryptoapp/
├── public/
│   └── index.html                 # HTML template
├── src/
│   ├── App.js                     # Main application component
│   ├── App.css                    # Global styles
│   ├── index.js                   # Application entry point
│   ├── app/
│   │   └── store.js               # Redux store configuration
│   ├── components/
│   │   ├── Navbar.jsx             # Navigation component
│   │   ├── Homepage.jsx           # Homepage with stats
│   │   ├── Cryptocurrencies.jsx   # Crypto list with search
│   │   ├── CryptoDetails.jsx      # Detailed coin information
│   │   ├── LineChart.jsx          # Price chart component
│   │   ├── Exchanges.jsx          # Exchange listings
│   │   ├── News.jsx               # News feed component
│   │   ├── Loader.jsx             # Loading component
│   │   └── index.js               # Component exports
│   └── services/
│       ├── cryptoApi.js           # CoinGecko API integration
│       └── cryptoNewsApi.js       # CryptoCompare news API
├── build/                         # Production build (generated)
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have:
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cryptoapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   The application will open automatically in your browser at [http://localhost:3000](http://localhost:3000)

### Available Scripts

#### `npm start`
Runs the app in development mode with hot reloading.
- Open [http://localhost:3000](http://localhost:3000) to view it in your browser
- The page reloads automatically when you make changes
- Lint errors appear in the console

#### `npm test`
Launches the test runner in interactive watch mode.

#### `npm run build`
Builds the app for production to the `build` folder:
- Optimizes React for best performance
- Minifies code and includes hashes in filenames
- Ready for deployment

#### `npm run eject`
**⚠️ Warning: This is a one-way operation!**

Ejects from Create React App, giving you full control over webpack, Babel, and ESLint configurations.

## 🔌 API Integration

### CoinGecko API
The application uses the free CoinGecko API v3 for cryptocurrency data:
- **Base URL**: `https://api.coingecko.com/api/v3`
- **No API key required**
- Provides:
  - Cryptocurrency prices and market data
  - Historical price data
  - Coin details and statistics
  - Market rankings

### CryptoCompare API
Used for cryptocurrency news:
- **Base URL**: `https://min-api.cryptocompare.com/data/v2`
- **No API key required**
- Provides latest news articles from various sources

## 🎨 Key Components

### Homepage Component
- Displays global statistics
- Shows top 10 cryptocurrencies
- Presents latest news
- Uses `useGetCryptosQuery` RTK Query hook for data fetching

### Cryptocurrencies Component
- Lists cryptocurrencies with pagination
- Real-time search filtering
- Responsive card layout
- Links to detailed coin pages

### CryptoDetails Component
- Comprehensive coin information
- Interactive price charts with multiple timeframes
- Supply and market statistics
- Links to exchanges and resources

### LineChart Component
- Built with Chart.js and React-Chartjs-2
- Responsive design
- Multiple timeframe support
- Formatted axes with price and time data

### News Component
- Displays latest crypto news
- Filter by cryptocurrency
- Article cards with images
- External links to full articles

## 🎯 Features Highlight

### Redux Toolkit Query (RTK Query)
Efficient data fetching and caching:
- Automatic re-fetching
- Built-in loading and error states
- Optimistic updates
- Cache management

### Responsive Design
- Mobile-first approach
- Ant Design's responsive grid system
- Adaptive layouts for all screen sizes

### State Management
- Redux Toolkit for global state
- RTK Query for server state
- React hooks for local state

## 📦 Build and Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder:
- Minified and optimized code
- Static files ready for deployment
- Performance optimizations applied

### Deployment Options

The build folder can be deployed to:
- **Vercel**: Zero-config deployment for React apps
- **Netlify**: Drag-and-drop or Git-based deployment
- **GitHub Pages**: Free hosting for static sites
- **AWS S3**: Cloud storage with CloudFront CDN
- **Firebase Hosting**: Google's hosting solution

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory for custom configuration:

```env
REACT_APP_API_URL=https://api.coingecko.com/api/v3
REACT_APP_NEWS_API_URL=https://min-api.cryptocompare.com/data/v2
```

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **CoinGecko** for providing free cryptocurrency data API
- **CryptoCompare** for the news API
- **Ant Design** for the beautiful UI components
- **Chart.js** for powerful data visualization
- **Create React App** for the build configuration

## 📧 Contact & Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Check existing issues before creating new ones

## 🔮 Future Enhancements

Potential features for future versions:
- [ ] Portfolio tracking
- [ ] Price alerts and notifications
- [ ] User authentication
- [ ] Favorite cryptocurrencies
- [ ] Advanced filtering and sorting
- [ ] Dark/light theme toggle
- [ ] Multi-currency support
- [ ] Historical data comparison
- [ ] Mobile app version
- [ ] Real-time WebSocket price updates

---
