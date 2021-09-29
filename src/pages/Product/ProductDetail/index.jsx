import React, { useState } from "react";
import "./index.css";
import "antd/dist/antd.css";
import { Row, Col, Breadcrumb, Image, Rate, Button } from 'antd';
import {
    CommentOutlined,
  } from '@ant-design/icons';

const ProductDetail = () => {
    //const { path } = useRouteMatch();
    const [visible, setVisible] = useState(false);
    return (
        <div className="htmlProductDetail">
            <div className="relatePage">
                <Row justify="space-around">
                    <Col span={24}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item href="">Product</Breadcrumb.Item>
                            <Breadcrumb.Item href="">Shirt</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>
            </div>
            <div className="detailProduct">
                <Row >
                    <Col span={8}>
                    <Image
                        preview={{ visible: false }}
                        width={350}
                        src="/image/product/product4.jpg"
                        onClick={() => setVisible(true)}
                    />
                    <div style={{ display: 'none' }}>
                        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
                        <Image src="/image/product/product4.jpg" />
                        <Image src="/image/product/product2_1.jpg" />
                        <Image src="/image/product/product2.jpg" />
                        </Image.PreviewGroup>
                    </div>
                    </Col>
                    <Col span={16}>
                        <Row>
                            <h1>AT Basic Jean </h1>
                        </Row>
                        <Row>
                            <h2>350.000d</h2>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Rate disabled allowHalf defaultValue={4.5}></Rate>
                            </Col>
                            <Col span={6}>
                                <CommentOutlined style={{ fontSize: '23px', color: '#08c' }} value="Danh gia"/>
                                <Button type="text">Đánh Giá</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
    );
  };
  
  export { ProductDetail };