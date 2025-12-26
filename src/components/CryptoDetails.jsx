import React, { useState, useEffect, useMemo } from 'react';
import HTMLReactParser from "html-react-parser";
import { useParams } from 'react-router-dom';
import { Col, Row, Typography, Select } from "antd";
import millify from 'millify';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Loader from './Loader';
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import LineChart from './LineChart';

const { Title, Text } = Typography;

// Define all possible time periods with their corresponding days
const allTimePeriods = [
  { value: '3h', label: '3h', days: 0.125 },
  { value: '24h', label: '24h', days: 1 },
  { value: '7d', label: '7d', days: 7 },
  { value: '30d', label: '30d', days: 30 },
  { value: '3m', label: '3m', days: 90 },
  { value: '1y', label: '1y', days: 365 },
  { value: '3y', label: '3y', days: 1095 },
  { value: '5y', label: '5y', days: 1825 }
];

const CryptoDetails = () => {
  const { coinUuid } = useParams();
  const [timePeriod, setTimePeriod] = useState('7d');
  const { data, isFetching } = useGetCryptoDetailsQuery(coinUuid);
  const { data: coinHistory, isFetching: isHistoryFetching } = useGetCryptoHistoryQuery({ coinUuid, timePeriod });
  const cryptoDetails = data?.data?.coin;

  // Calculate coin age to determine available time periods - recalculates for each coin
  const coinAgeInDays = useMemo(() => {
    if (!cryptoDetails?.listedAt) {
      // If no listedAt data, assume coin is old enough for all periods
      return 10000;
    }
    const now = Date.now() / 1000; // Current time in seconds
    const ageInSeconds = now - cryptoDetails.listedAt;
    const ageInDays = ageInSeconds / (60 * 60 * 24); // Convert to days

    // Add 1 day buffer to avoid edge cases
    return Math.max(0, ageInDays + 1);
  }, [cryptoDetails?.listedAt]);

  // Filter time periods based on this specific coin's age
  const timeOptions = useMemo(() => {
    // Filter to only show periods where we have enough historical data
    const validPeriods = allTimePeriods.filter(period => period.days <= coinAgeInDays);

    // Always show at least the shortest period (3h)
    return validPeriods.length > 0 ? validPeriods : [allTimePeriods[0]];
  }, [coinAgeInDays]);

  // Reset time period when switching coins only
  useEffect(() => {
    // When coin changes, reset to 7d if available, otherwise longest available
    if (timeOptions.length > 0) {
      const defaultPeriod = timeOptions.find(opt => opt.value === '7d');
      if (defaultPeriod) {
        setTimePeriod('7d');
      } else {
        setTimePeriod(timeOptions[timeOptions.length - 1].value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinUuid]);

  if (isFetching || !cryptoDetails) return <Loader />;

  const stats = [
    { title: 'Price to USD', value: `$ ${cryptoDetails?.price ? millify(cryptoDetails.price) : 'N/A'}`, icon: <DollarCircleOutlined /> },
    { title: 'Rank', value: cryptoDetails?.rank || 'N/A', icon: <NumberOutlined /> },
    { title: 'Listed At', value: `$ ${cryptoDetails?.listedAt ? millify(cryptoDetails.listedAt) : 'N/A'}`, icon: <ThunderboltOutlined /> },
    { title: 'Market Cap', value: `$ ${cryptoDetails?.marketCap ? millify(cryptoDetails.marketCap) : 'N/A'}`, icon: <DollarCircleOutlined /> },
    { title: 'All-time-high(daily avg.)', value: `$ ${cryptoDetails?.allTimeHigh?.price ? millify(cryptoDetails.allTimeHigh.price) : 'N/A'}`, icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: 'Number Of Markets', value: cryptoDetails?.numberOfMarkets || 'N/A', icon: <FundOutlined /> },
    { title: 'Number Of Exchanges', value: cryptoDetails?.numberOfExchanges || 'N/A', icon: <MoneyCollectOutlined /> },
    { title: 'Aprroved Supply', value: cryptoDetails?.supply?.total ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: 'Total Supply', value: `$ ${cryptoDetails?.supply?.total ? millify(cryptoDetails.supply.total) : 'N/A'}`, icon: <ExclamationCircleOutlined /> },
    { title: 'Circulating Supply', value: `$ ${cryptoDetails?.supply?.circulating ? millify(cryptoDetails.supply.circulating) : 'N/A'}`, icon: <ExclamationCircleOutlined /> },
  ];

  return (
    <Col className="coin-detail-container">
      <Col className="coin-heading-container">
        <Title level={2} className="coin-name">
          {data?.data?.coin.name} ({data?.data?.coin.slug}) Price
        </Title>
        <p>{cryptoDetails.name} live price in US Dollar (USD). View value statistics, market cap and supply.</p>
      </Col>
      {timeOptions.length > 0 && (
        <>
          <Select
            value={timePeriod}
            className="select-timeperiod"
            placeholder="Select Timeperiod"
            onChange={(value) => setTimePeriod(value)}
            options={timeOptions}
            disabled={isHistoryFetching}
          />
          {isHistoryFetching ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <Loader />
            </div>
          ) : coinHistory?.data?.history && coinHistory.data.history.length > 0 ? (
            <LineChart coinHistory={coinHistory} currentPrice={millify(cryptoDetails.price)} coinName={cryptoDetails.name} />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
              <p>No historical data available for this time period.</p>
            </div>
          )}
        </>
      )}
      <Col className="stats-container">
        <Col className="coin-value-statistics">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">{cryptoDetails.name} Value Statistics</Title>
            <p>An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
          </Col>
          {stats.map(({ icon, title, value }) => (
            <Col className="coin-stats" key={title}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
        <Col className="other-stats-info">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">Other Stats Info</Title>
            <p>An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
          </Col>
          {genericStats.map(({ icon, title, value }) => (
            <Col className="coin-stats" key={title}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>
      <Col className="coin-desc-link">
        <Row className="coin-desc">
          <Title level={3} className="coin-details-heading">What is {cryptoDetails.name}?</Title>
          {HTMLReactParser(cryptoDetails.description || '')}
        </Row>
        <Col className="coin-links">
          <Title level={3} className="coin-details-heading">{cryptoDetails.name} Links</Title>
          {cryptoDetails.links?.map((link, index) => (
            <Row className="coin-link" key={index}>
              <Title level={5} className="link-name">{link.type || 'Link'}</Title>
              <a href={link.url || link} target="_blank" rel="noreferrer">{link.name || link}</a>
            </Row>
          ))}
        </Col>
      </Col>
    </Col>
  );
}

export default CryptoDetails;
