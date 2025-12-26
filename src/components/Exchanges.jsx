import React from 'react';
import millify from 'millify';
import { Collapse, Row, Col, Typography, Avatar } from 'antd';
import HTMLReactParser from 'html-react-parser';

import { useGetExchangesQuery } from '../services/cryptoApi';
import Loader from './Loader';

const { Text } = Typography;

const Exchanges = () => {
  const { data, isFetching } = useGetExchangesQuery();
  const exchangesList = data?.data?.exchanges;

  if (isFetching || !exchangesList) return <Loader />;

  return (
    <>
      <Row>
        <Col span={6}>Exchanges</Col>
        <Col span={6}>24h Trade Volume</Col>
        <Col span={6}>Country</Col>
        <Col span={6}>Year Established</Col>
      </Row>
      <Row>
        {exchangesList.map((exchange) => (
          <Col span={24} key={exchange.id}>
            <Collapse
              items={[
                {
                  key: exchange.id,
                  showArrow: false,
                  label: (
                    <Row key={exchange.id}>
                      <Col span={6}>
                        <Text><strong>{exchange.rank}.</strong></Text>
                        <Avatar className="exchange-image" src={exchange.image} />
                        <Text><strong>{exchange.name}</strong></Text>
                      </Col>
                      <Col span={6}>{exchange.volume24h ? `${millify(exchange.volume24h)} BTC` : 'N/A'}</Col>
                      <Col span={6}>{exchange.country || 'N/A'}</Col>
                      <Col span={6}>{exchange.yearEstablished || 'N/A'}</Col>
                    </Row>
                  ),
                  children: HTMLReactParser(exchange.description || '')
                }
              ]}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Exchanges;