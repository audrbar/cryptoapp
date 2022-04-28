import React from 'react';
import millify from 'millify';
import { Collapse, Row, Col, Typography, Avatar } from 'antd';
import HTMLReactParser from 'html-react-parser';

import { useGetExchangesQuery } from '../services/cryptoApi';
import Loader from './Loader';

const { Text } = Typography;
const { Panel } = Collapse;

const Exchanges = () => {
  const { data, isFetching } = useGetExchangesQuery();
  const coinsList = data?.data?.coins;

  if (isFetching) return <Loader />;
  
console.log(data);

  return (
    <>
      <Row>
        <Col span={6}>Max Amount</Col>
        <Col span={6}>Total Synced AT</Col>
        <Col span={6}>Total Amount</Col>
        <Col span={6}>Circulating Amount</Col>
      </Row>
      <Row>
        {coinsList.map((coins) => (
          <Col span={24}>
            <Collapse>
              <Panel
                key={coins.uuid}
                showArrow={false}
                header={(
                  <Row key={coins.uuid}>
                    <Col span={6}>
                      <Text><strong>{coins.symbol}.</strong></Text>
                      <Avatar className="exchange-image" src={coins.iconUrl} />
                      <Text><strong>{coins.name}</strong></Text>
                    </Col>
                    <Col span={6}>${coins.symbol}</Col>
                    <Col span={6}>{coins.name}</Col>
                    <Col span={6}>{coins.color}%</Col>
                  </Row>
                  )}
              >
                {coins.name || ''}
              </Panel>
            </Collapse>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Exchanges;