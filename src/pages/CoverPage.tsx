import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Space, Row, Col, Table, Divider, Tag, Input, Typography, Upload, Layout, Radio, Button, message } from 'antd';
import { LoadingOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { WordCloud } from '@ant-design/charts';
import { useState } from 'react';
import styles from "./CoverPage.less"
import { history } from 'umi';
// 引入图片
import home from "../assert/deepfake copy_slices/home.png"
import icon1 from "../assert/deepfake copy_slices/icon1.png"
const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;
const { Title } = Typography;
const CoverPage = () => {
    const { dataSource, loading, run, onGetTextCover, onGetPictureCover, result, textResult, coverLoading } = useModel('cover');
    const [inputText, setInputText] = useState("");
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
        <div>

            <Layout className={styles.layout}>
                <Row align='middle' className={styles.home}>
                    <Button onClick={() => { history.push('/'); }}><div className={styles.homeContainer}><img style={{ width: "20px", height: "20px", marginRight: "10px" }} src={home}></img><p className={styles.homeText}>主页</p></div></Button>
                </Row>
                <Row className={styles.container}>
                    <Col span={12}>
                        <Space direction="vertical" style={{ borderBottomLeftRadius: "1%", borderTopLeftRadius: "1%", padding: "30px", backgroundColor: "#fff", width: "100%", height: "100%" }}>
                            <div className={styles.title}>选择图片<img className={styles.icon1} src={icon1}></img></div>
                            <div style={{ margin: "0 auto", width: '312px', height: '182px', border: '1px solid  black', backgroundColor: 'white' }}>
                                {inputImage != "" && <img
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
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
                                    <Button loading={uploading} style={{ marginRight: '10px' }}  >上传</Button>
                                </Upload>
                                <Button style={{ color: "white", backgroundColor: "#2C8290" }} loading={coverLoading} onClick={() => {
                                    if (inputImage == "" || inputImage == null) {
                                        message.error("请先上传一张图片")
                                        return;
                                    }
                                    if (dataSource?.data?.pictureName == null) {
                                        message.error("请先获取一张载体")
                                        return;
                                    }
                                    onGetPictureCover(inputImage, dataSource?.data?.pictureName)
                                }} >隐写</Button>
                            </div>
                            <div className={styles.title}>载体<img className={styles.icon2} src={icon1}></img></div>
                            <div style={{ margin: "0 auto", width: '312px', height: '182px', border: '1px solid  black', backgroundColor: 'white' }}>
                                {dataSource?.data?.picture != null && <img
                                    style={{
                                        height: '100%',
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        display: 'block',
                                        margin: 'auto'
                                    }}
                                    src={`data:image/png;base64,${dataSource?.data?.picture}`}
                                />
                                }
                            </div>
                            <div style={{ display: "flex", justifyContent: "center" }}><Button loading={loading} onClick={() => { run(); }} >换一张</Button>
                            </div>


                        </Space>
                    </Col>    <div className={styles.dashed}>
                    </div>
                    <Col span={12}>
                        <Space direction="vertical" style={{ borderBottomRightRadius: "1%", borderTopRightRadius: "1%", padding: "30px", backgroundColor: "#fff", width: "100%", height: "100%" }}>
                            <div className={styles.title}>隐写结果<img className={styles.icon1} src={icon1}></img></div>
                            <div style={{ margin: "0 auto", width: '312px', height: '182px', border: '1px solid  black', backgroundColor: 'white' }}>
                                {result?.outputPicture != null && result?.outputPicture != "" && <img
                                    style={{
                                        height: '100%',
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        display: 'block',
                                        margin: 'auto'
                                    }}
                                    src={`data:image/png;base64,${result?.outputPicture}`}
                                />}
                            </div>

                            {result?.outputPicture != null && result?.outputPicture != "" ?
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Button loading={false} style={{ color: "white", backgroundColor: "#2C8290" }}
                                        onClick={() => {
                                            var a = document.createElement("a"); //Create <a>
                                            a.href = "data:image/png;base64," + result?.outputPicture; //Image Base64 Goes here
                                            var now = new Date();
                                            var fileName = moment(parseInt(now.getTime())).format("YYYYMMDDHHmmss");
                                            a.download = `${fileName}.png`; //File name Here
                                            a.click(); //Downloaded file
                                        }}
                                    >
                                        下载
                                    </Button></div>
                                :
                                <p />
                            }
                            {!(result?.outputPicture != null && result?.outputPicture != "") && <p />
                            }

                            <div className={styles.title}>重建结果<img className={styles.icon1} src={icon1}></img></div>
                            <div style={{ margin: "0 auto", width: '312px', height: '182px', border: '1px solid  black', backgroundColor: 'white' }}>
                                {result?.rebuildingPicture != null && result?.rebuildingPicture != "" && <img
                                    style={{
                                        height: '100%',
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        display: 'block',
                                        margin: 'auto'
                                    }}
                                    src={`data:image/png;base64,${result?.rebuildingPicture}`}
                                />
                                }
                            </div>
                        </Space>
                    </Col>
                </Row>
            </Layout>
        </div>
    );
};


export default CoverPage;