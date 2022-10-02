import React from 'react';
import styles from './index.less';
import { Layout, Row, Col, Space, Button, Typography } from 'antd';
import { history } from 'umi';
// 引入图片
import pic1 from "../assert/首页_slices/publicOpinionMonitoring.png"
import pic2 from "../assert/首页_slices/rumorDetect.png"
import pic3 from "../assert/首页_slices/deepfake.png"
import pic4 from "../assert/首页_slices/yinxie.png"

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;
export default function IndexPage() {
  return (
    <Layout>
      <div className={styles.container}>
        <Row style={{ height: "100vh" }} justify="center" align="middle">
          <div style={{ width: '100%', verticalAlign: 'middle' }}>
            <Space style={{ width: '100%', verticalAlign: 'middle' }} align={'center'} direction="vertical">
              <p className={styles.title}>不完备信息环境下网络敏感事件</p>
              <p className={styles.title}>检测识别与管控系统</p>
              <Space>
                <Button className={styles.button} onClick={() => { window.open("http://dkelab.cn") }} ><div className={styles.innerButton}><img className={styles.pic} src={pic1}></img><p className={styles.buttonText}>舆情监控</p></div></Button>
                <Button className={styles.button} onClick={() => { history.push('/rumorDetect'); }} ><div className={styles.innerButton}><img className={styles.pic} src={pic2}></img><p className={styles.buttonText}>谣言检测</p></div></Button>
                <Button className={styles.button} onClick={() => { history.push('/deepfake'); }}><div className={styles.innerButton}><img className={styles.pic} src={pic3}></img><p className={styles.buttonText}>deepfake</p></div></Button>
                <Button className={styles.button} onClick={() => { history.push('/cover'); }} ><div className={styles.innerButton}><img className={styles.pic} src={pic4}></img><p className={styles.buttonText}>隐写</p></div></Button>
              </Space>
            </Space>
          </div>
        </Row>
      </div>


    </Layout>
  );
}
