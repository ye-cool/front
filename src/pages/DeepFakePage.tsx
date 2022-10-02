import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Space, Image, Row, Col, Card, Divider, Tag, Input, Spin, Upload, Layout, Button, message, Typography } from 'antd';
import { LoadingOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { WordCloud } from '@ant-design/charts';
import { useState } from 'react';
import styles from "./DeepFakePage.less"
import { history } from 'umi';
// 引入图片
import home from "../assert/deepfake copy_slices/home.png"
import icon1 from "../assert/deepfake copy_slices/icon1.png"
const { Title, Text, Link } = Typography;
const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;
const DeepFakePage = () => {

    const { dataSource, loading, run, examplePicture } = useModel('deepfake');
    const [inputImage, setInputImage] = useState("");
    const [uploading, setUploading] = useState(false)

    function beforeUpload(file) {
        if (file.type !== 'image/png') {
            message.error(`${file.name}不是PNG文件,请上传PNG文件`);
            return false;
        }
        console.log(file)

        let callback = imageByte => {
            let base64String = arrayBufferToBase64(imageByte)
            setInputImage(base64String)
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsArrayBuffer(file);

        return false;
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    return (
        <Layout className={styles.layout}>
            <Row align='middle' className={styles.home}>
                <Button onClick={() => { history.push('/'); }}><div className={styles.homeContainer}><img style={{ width: "20px", height: "20px", marginRight: "10px" }} src={home}></img><p className={styles.homeText}>主页</p></div></Button>
            </Row>
            <Row className={styles.container}>
                <Col span={12} style={{ paddingRight: "0.5vh" }}>
                    <Space direction="vertical" style={{ borderRadius: "1%", padding: "30px", backgroundColor: "#fff", width: "100%", height: "100%" }}>
                        <div className={styles.title}>未处理文件<img className={styles.icon1} src={icon1}></img></div>
                        <Text>深度伪造，就是人工智能的深度换脸技术；简单来说就是脸部替换，可以将B的脸换到A的脸上。和PS不同的是，这项技术不仅可以生成图片，还是可以生成视频的，而且你并不需要懂得那么多的技术；只要你收集到足够素材，程序的AI就可以帮你自动完成。</Text>
                        <p />
                        <p />
                        <div className={styles.title}>视频介绍<img className={styles.icon2} src={icon1}></img></div>
                        <p />
                        <p />
                        <Text strong>参考链接:</Text>
                        <Link href="https://blog.csdn.net/koest/article/details/80726074" target="_blank">深度伪造介绍</Link>
                        <p />
                        <p />
                        <video autoplay="autoplay" controls style={{ background: '#fff', height: "239px" }}>
                            <source src="/api/play/deepfake" type="video/mp4" />
                        </video>
                    </Space>
                </Col>
               
                <Col span={12} style={{ paddingLeft: "0.5vh" }}>
                    <Space direction="vertical" style={{ borderRadius: "1%", padding: "30px", backgroundColor: "#fff", width: "100%", height: "100%" }}>
                        <div style={{ margin: "0 auto", width: '252px', height: '252px', border: '1px solid  black', backgroundColor: 'white' }}>
                            {inputImage != "" && <img
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'block',
                                    margin: 'auto'
                                }}
                                src={`data:image/png;base64,${inputImage}`}
                            />
                            }
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Upload
                                
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                            >
                                <Button loading={uploading} style={{marginRight:"10px"}}>上传</Button>
                            </Upload>
                            <div> </div>
                            <Button
                                style={{ color: "white", backgroundColor: "#2C8290" }}
                                loading={loading}
                                onClick={() => {
                                    if (inputImage == "" || inputImage == null) {
                                        message.error("请先上传一张图片")
                                        return;
                                    }
                                    run(inputImage)
                                }} >验证</Button>
                        </div>
                        <div className={styles.title}>返回结果：<img className={styles.icon3} src={icon1}></img></div>
                        <Card style={{ backgroundColor: "#F6FCFD", marginTop:"10px", marginBottom: "30px" }}>
                            {dataSource != null && <p>{`置信度:${dataSource.data?.percent}%`}</p>}
                            {dataSource != null && <p>DeepFake: <>{dataSource.data?.percent > 60 ? <Tag color="error">是</Tag> : <Tag color="success">否</Tag>}</></p>}
                        </Card>
                        <div className={styles.title}>示例：<img className={styles.icon4} src={icon1}></img></div>
                        {
                            examplePicture != null && <>
                                <Divider></Divider>
                                <Space>
                                    {
                                        examplePicture.data.map(element => {
                                            return <Image
                                                preview={false}
                                                onClick={() => { setInputImage(element) }}
                                                width={80}
                                                height={80}
                                                src={`data:image/png;base64,${element}`}
                                            />
                                        })
                                    }

                                </Space>
                            </>
                        }
                    </Space>
                </Col>
            </Row>
        </Layout >
    );
};


export default DeepFakePage;