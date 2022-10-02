import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, Button, Typography, Tag } from 'antd';
import moment from 'moment';
import styles from "./RumorDetailModal.less"
import * as echarts from 'echarts'
// 引入图片
import close from "../assert/语言监测-处理_slices/close.png"
import icon2 from "../assert/语言监测-处理_slices/icon2.png"
const { Text } = Typography;

const RumorDetailModal = ({ visible, record, onCancel, onConfirmRumor, OnNotRumor, showHandleButton, handleLoading, showConfirmResult, showPercent, type }) => {
  // useImperativeHandle(onRef, () => {
  //   // 需要将暴露的接口返回出去
  //   return {
  //     func: initCharts,
  //   };
  // });

  useEffect(() => {
    if (document.getElementById("main")) {
      let chartInstance = echarts.init(document.getElementById("main")!)
      const option = {
        title: {
          text: '测试',
          subtext: 'Default layout',
          top: 'bottom',
          left: 'right'
        },
        color: ["gray"],
        tooltip: {
        },
        series: [
          {
            name: '测试',
            type: 'graph',
            layout: 'force',
            data: record?.graphData?.nodes,
            links: record?.graphData?.edges,
            roam: true,
            label: {
              position: 'right'
            },
            force: {
              repulsion: 100
            }
          }
        ]
      };
      chartInstance.setOption(option);
    }

  })
  // function initCharts() {


  // }
  return (
    <div>
      <Modal
        getContainer={false}
        wrapClassName='web'
        title={[
          <div style={{ display: "flex", justifyContent: " space-between" }}><p style={{ fontWeight: "600" }}>查看</p> <img onClick={onCancel} style={{ height: "16px" }} src={close}></img></div>
        ]}
        visible={visible}
        closable={false}
        footer={[
          // type == 2 && <Button onClick={initCharts}>ceshi</Button>,
          type == 0 && showHandleButton && <Button style={{ width: "100px", borderRadius: "8px", backgroundColor: "#F5F7FA " }} loading={handleLoading} key="submit1" onClick={OnNotRumor}>
            非谣言
          </Button>,
          type == 0 && showHandleButton && <Button style={{ width: "100px", borderRadius: "8px", backgroundColor: "#2C8290 " }} loading={handleLoading} key="submit2" type="primary" onClick={onConfirmRumor}>
            谣言
          </Button>,
        ]}
      >
        {type == 2 && <div id="main" style={{ height: "400px" }}></div>}
        {type == 0 && record != null &&
          <div>
            {showConfirmResult && (record?.confirm ? <p>性质:<Tag color="error">谣言</Tag></p> : <p>性质:<Tag color="success">非谣言</Tag></p>)}
            {showPercent && <p><img style={{ height: "16px" }} src={icon2}></img><Text strong={true} type={'danger'}>{`谣言概率:${(record.percent * 100).toFixed(2)}%`}</Text></p>}
            <p>{record?.text}</p>
            <p style={{ color: "#999" }}>{`来源 : ${record.platform}           ${moment(parseInt(record.time)).format("YYYY-MM-DD HH:mm:ss")}`}</p>
            <img src={`${record.picture}`} referrerpolicy="no-referrer" style={{ width: '100%' }} />
          </div>}
      </Modal>
    </div>

  );
};

export default RumorDetailModal;