import React, { useEffect, useRef } from 'react';
import { useModel } from 'umi';
import { List, Row, Col, Table, Divider, Tag, Input, Space, Button, InputNumber, Typography } from 'antd';
import moment from 'moment';
import RumorDetailModal from './RumorDetailModal';
import Highlighter from 'react-highlight-words';
import { WordCloud } from '@ant-design/charts';
import { useState } from 'react';
import { history } from 'umi';
import styles from './RumorDetectPage.less';
// 引入图片
import home from "../assert/语言监测_slices/home.png"
import icon1 from "../assert/语言监测_slices/icon1.png"
import icon2 from "../assert/语言监测_slices/icon2.png"
import icon3 from "../assert/语言监测_slices/icon3.png"
import icon4 from "../assert/语言监测_slices/icon4.png"
import barBack from "../assert/语言监测_slices/navigationBar.png"
const { Title, Text } = Typography;

const TableContext = React.createContext(false);

const wordCloud = (props) => {
  return (<WordCloud
    style={props.style}
    data={props.wordCouldData}
    wordField={'name'}
    weightField={'value'}
    colorField={'name'}
    tooltip={false}
    wordStyle={{
      fontFamily: 'Verdana',
      fontSize: [16, 64],
      rotation: 0,
    }}
    random={0.5}
    onReady={(plot) => {
      plot.on('element:click', (args) => {
        if (props.onElementClick != null) {
          props.onElementClick(args)
        }
      });
    }}
  ></WordCloud>)
}

const Memo = React.memo(wordCloud, (prev, next) => {
  if (prev.wordCouldData == null)
    return true;
  if (next.wordCouldData == null)
    return true;
  return prev.wordCouldData === next.wordCouldData
})

const RumorDetectPage = () => {
  let messagesEnd = null;
  const [inputValue, setInputValue] = useState(50)
  const { dataSource, highPercent, loading, handleRumor, setPercent, wordCouldData, handled } = useModel('rumorDetect');
  const [searchText, setSearchText] = useState([])
  const [rumorData, setRumorData] = useState(null)
  const [type, setType] = useState(0)
  const [showHandleButton, setShowHandleButton] = useState(false)
  const [handleLoading, setHandleLoading] = useState(false)
  const [showConfirmResult, setShowConfirmResult] = useState(false)
  const [showPercent, setShowPercent] = useState(false)

  const columns = [
    {
      title: <Text strong>内容</Text>,
      dataIndex: 'text',
      filteredValue: searchText,
      ellipsis: true,
      onFilter: (value, record) => {
        return record.text.includes(value)
      },
      render: text =>
        searchText.length > 0 ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={searchText}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    },
    {
      title: <Text strong>来源</Text>,
      width: '100px',
      dataIndex: 'platform'
    },
    {
      title: <Text strong>谣言概率</Text>,
      width: '90px',
      dataIndex: 'percent',
      render: (percent, record) => (
        <>{(percent * 100).toFixed(2) + '% '}</>
      )
    },
    {
      title: <Text strong>时间</Text>,
      dataIndex: 'time',
      width: '170px',
      render: (text, record) => (
        <p>{moment(parseInt(text)).format("YYYY-MM-DD HH:mm:ss")}</p>
      )
    },
    {
      title: <Text strong>操作</Text>,
      width: '120px',
      render: (text, record) => (
        <Space>  <a
          style={{ color: "#2C8290" }}
          onClick={() => {
            setShowHandleButton(true)
            setShowConfirmResult(false)
            setShowPercent(true)
            setRumorData(record)
            setType(0)
          }} >处理</a>
          <a
            style={{ color: "#2C8290" }}
            onClick={() => {
              setShowHandleButton(true)
              setShowConfirmResult(false)
              setShowPercent(true)
              setRumorData(record)
              setType(2)
              // init()
            }} >查看</a></Space>

      )
    },
  ];

  const handledColumns = [
    {
      title: <Text strong>内容</Text>,
      dataIndex: 'text',
      filteredValue: searchText,
      ellipsis: true,
      onFilter: (value, record) => {
        return record.text.includes(value)
      },
      render: text =>
        searchText.length > 0 ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={searchText}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    },
    {
      title: <Text strong>性质</Text>,
      width: '100px',
      dataIndex: 'confirm',
      render: (confirm, record) => (
        <div>
          {confirm ? <Tag color="error">谣言</Tag> : <Tag color="success">非谣言</Tag>}
        </div>
      )
    },
    {
      title: <Text strong>来源</Text>,
      width: '100px',
      dataIndex: 'platform'
    },
    {
      title: <Text strong>谣言概率</Text>,
      width: '90px',
      dataIndex: 'percent',
      render: (percent, record) => (
        <>{(percent * 100).toFixed(2) + '% '}</>
      )
    },
    {
      title: <Text strong>处理时间</Text>,
      dataIndex: 'updateTimeLabel',
      width: '170px',
    },
    {
      title: <Text strong>操作</Text>,
      width: '100px',
      render: (text, record) => (
        <a
          style={{ color: "#2C8290" }}
          onClick={() => {
            setShowHandleButton(true)
            setShowConfirmResult(true)
            setShowPercent(true)
            setRumorData(record)
            setType(0)
          }} >修改</a>
      )
    },
  ];
  // let ChartRef = React.createRef();
  // function init() {
  //   ChartRef.current.func()
  // }
  function getHeader(title) {
    return <Title level={4}>{title}</Title>
  }

  function getFooter() {
    return <>
      <Space>
        <Button style={{ color: "#2C8290" }} onClick={() => { setSearchText([]) }} >清除关键字</Button>
        <>谣言概率过滤:<InputNumber
          min={0}
          max={100}
          formatter={value => `${value}%`}
          parser={value => value.replace('%', '')}
          defaultValue={inputValue}
          onChange={(value) => { setInputValue(value) }} />
          <Button style={{ backgroundColor: "#2C8290" }} type='primary' onClick={() => { setPercent(inputValue / 100.0) }} >修改</Button>
        </>
      </Space>
    </>
  }

  function handleCancel() {
    setRumorData(null)
  }


  function onHandleOKSuccess() {
    setHandleLoading(false)
    setRumorData(null)
  }

  function handleOK() {
    if (rumorData == null)
      return;
    if (handleLoading)
      return;
    setHandleLoading(true);
    handleRumor(rumorData.id, true, onHandleOKSuccess)
  }

  function handleNotRumor() {
    if (rumorData == null)
      return;
    if (handleLoading)
      return;
    setHandleLoading(true);
    handleRumor(rumorData.id, false, onHandleOKSuccess)
  }

  return (
    <div>
      <RumorDetailModal
        // onRef={ChartRef}
        visible={rumorData != null}
        record={rumorData}
        onCancel={handleCancel}
        onConfirmRumor={handleOK}
        OnNotRumor={handleNotRumor}
        showHandleButton={showHandleButton}
        handleLoading={handleLoading}
        showConfirmResult={showConfirmResult}
        showPercent={showPercent}
        type={type}
      ></RumorDetailModal>
      <Row style={{ height: "100%", width: '100%' }}>
        <Col span={3}>
          <div className={styles.bar}>
            <Row className={styles.barTop} justify='center' onClick={() => { history.push('/'); }} >
              <img style={{ width: "25px", marginTop: "2px", marginBottom: "2px" }} src={home}></img>
            </Row>
            <Row className={styles.barList}><img className={styles.barIcon} src={icon2}></img><p className={styles.barText}>基于评论内容</p></Row>
            <Row className={styles.barList}><img className={styles.barIcon} src={icon3}></img><p className={styles.barText}>基于传播结构</p></Row>
            <Row className={styles.barList}><img className={styles.barIcon} src={icon4}></img><p className={styles.barText}>基于用户</p></Row>
            <div className={styles.barBottom}><img src={barBack} style={{ width: "100%" }}></img></div>
          </div>
        </Col>
        <Col span={8}>
          <List
            header={<div className={styles.title}>监测内容<img className={styles.icon1} src={icon1}></img></div>}
            style={{ width: '100%', height: '100vh', overflowY: 'scroll' }}
            bordered={true}
            dataSource={dataSource ?? []}
            hoverable={true}
            renderItem={(item, index) => (
              <List.Item key={index} actions={[<Button
                style={{ color: "white", backgroundColor: "#2C8290", width: "60px", height: "30px", fontSize: "10px" }}
                onClick={() => {
                  setShowConfirmResult(false)
                  setShowHandleButton(false)
                  setShowPercent(false)
                  setRumorData(item)
                  setType(0)
                }} >详情</Button>]}>
                <List.Item.Meta
                  title={<Text style={{ width: "100%" }} ellipsis={true} >{item.text}</Text>}
                  description={moment(parseInt(item.time)).format("YYYY-MM-DD HH:mm:ss") + "          来源 : " + item.platform}
                />
              </List.Item>
            )}
          >
            <div style={{ float: "left", clear: "both" }}
              ref={(el) => { messagesEnd = el; }}>
            </div>
          </List>
        </Col>
        <Col span={13}>
          <div>
            <div><Table
              //title={() => getHeader("未处理:")}
              title={() => { return <div className={styles.title}>未处理文本<img className={styles.icon2} src={icon1}></img></div> }}
              bordered={true}
              scroll={{ y: '20vh' }}
              pagination={false}
              dataSource={highPercent}
              columns={columns}
            >
            </Table></div>
            <div> <Table
              //title={() => getHeader("已处理:")}
              title={() => { return <div className={styles.title}>已处理文本<img className={styles.icon2} src={icon1}></img></div> }}
              footer={() => getFooter()}
              bordered={true}
              scroll={{ y: '20vh' }}
              pagination={false}
              dataSource={handled}
              columns={handledColumns}
            >
            </Table></div>
            <div> <Memo
              style={{ width: "100%", height: "30vh" }}
              wordCouldData={wordCouldData}
              onElementClick={(args) => {
                setSearchText([...searchText, args.data.data.text])
              }}>
            </Memo></div>
          </div>
        </Col>
      </Row>
    </div>
  );
};


export default RumorDetectPage;