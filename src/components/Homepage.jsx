import React from 'react';
import millify from 'millify';
import { Link } from "react-router-dom";
import { Typography, Row, Col, Statistic } from "antd";
import { useGetCryptosQuery } from '../services/cryptoApi';
import { Cryptocurrencies, News } from '../components';
import Loader from './Loader';

const { Title } = Typography;

const Homepage = () => {
  const { data, isFetching } = useGetCryptosQuery(10);
  const cryptos = data?.data?.coins;

  if (isFetching || !cryptos) return <Loader />;

  // CoinGecko API doesn't provide global stats directly
  // Calculate approximate stats from the top cryptocurrencies
  const totalMarketCap = cryptos.reduce((acc, coin) => acc + (coin.marketCap || 0), 0);
  const total24hVolume = cryptos.reduce((acc, coin) => acc + (coin.marketCap || 0) * 0.05, 0); // Approximate

  return (
    <>
      <Title level={2} className="heading">Global Crypto Stats</Title>
      <Row>
        <Col span={12}><Statistic title="Total Cryptocurrencies" value="10,000+" /></Col>
        <Col span={12}><Statistic title="Total Exchanges" value="500+" /></Col>
        <Col span={12}><Statistic title="Total Market Cap" value={`$${millify(totalMarketCap)}`} /></Col>
        <Col span={12}><Statistic title="Total 24h Volume" value={`$${millify(total24hVolume)}`} /></Col>
        <Col span={12}><Statistic title="Total Markets" value="50,000+" /></Col>
        <Col span={12}><Statistic title="Top Coins Displayed" value={cryptos.length} /></Col>
      </Row>
      <div className="home-heading-container">
        <Title level={2} className="home-title">Top 10 Cryptocurrencies in the world</Title>
        <Title level={3} className="show-more"><Link to="/cryptocurrencies">Show More</Link></Title>
      </div>
      <Cryptocurrencies simplified={true} />
      <div className="home-heading-container">
        <Title level={2} className="home-title">Latest Crypto News</Title>
        <Title level={3} className="show-more"><Link to="/news">Show More</Link></Title>
      </div>
      <News simplified={true} />
    </>
  );
}

export default Homepage;
