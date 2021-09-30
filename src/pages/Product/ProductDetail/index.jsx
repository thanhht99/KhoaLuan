import React, { useState } from "react";
import "./index.css";
import "antd/dist/antd.css";
import { 
    Row, 
    Col, 
    Breadcrumb, 
    Image, 
    Rate, 
    Button, 
    Radio, 
    Divider, 
    InputNumber, 
    Collapse, 
    Comment, 
    Tooltip, 
    List,
    Avatar,
    Form,
    Input
} from 'antd';
import {
    CommentOutlined,
    ShoppingCartOutlined,
  } from '@ant-design/icons';
import moment from 'moment';


const ProductDetail = () => {
    //const { path } = useRouteMatch();
    const [visible, setVisible] = useState(false);

    //chon size + mau
    const [value, setValue] = React.useState(1);
    const onChange = e => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
      };


    //so luong them vao gio hang
    const onChangeNumber = value => {
        console.log('changed', value);
      };
    
    //phan mo ta chi tiet san pham
    const { Panel } = Collapse;
    const callback = key=> {
        console.log(key);
      }; 
    const text = `
        Chất liệu: Cotton Compact
        Thành phần: 100% Cotton
        - Thân thiện
        - Thấm hút thoát ẩm
        - Mềm mại
        - Kiểm soát mùi
        - Điều hòa nhiệt
        + Họa tiết in dẻo
        - HDSD:
        + Nên giặt chung với sản phẩm cùng màu
        + Không dùng thuốc tẩy hoặc xà phòng có tính tẩy mạnh
        + Nên phơi trong bóng râm để giữ sp bền màu
      `;
    
    //data - list comment
    const data = [
    {
        actions: [<span key="comment-list-reply-to-0">Reply to</span>],
        author: 'Han Solo',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: (
        <p>
            Toi rat thich chiec quan nay, no that dep.
        </p>
        ),
        datetime: (
        <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment().subtract(1, 'days').fromNow()}</span>
        </Tooltip>
        ),
    },
    {
        actions: [<span key="comment-list-reply-to-0">Reply to</span>],
        author: 'Zayn Malik',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content: (
        <p>
            Love this jean, love its materials.
        </p>
        ),
        datetime: (
        <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment().subtract(2, 'days').fromNow()}</span>
        </Tooltip>
        ),
    },
    ];

    //Phan them binh luan
    const { TextArea } = Input;
    const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
    );

    const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
            Add Comment
        </Button>
        </Form.Item>
    </>
    );


    //class them binh luan
    class AddComment extends React.Component {
        state = {
          comments: [],
          submitting: false,
          value: '',
        };
      
        handleSubmit = () => {
          if (!this.state.value) {
            return;
          }
      
          this.setState({
            submitting: true,
          });
      
          setTimeout(() => {
            this.setState({
              submitting: false,
              value: '',
              comments: [
                ...this.state.comments,
                {
                  author: 'Han Solo',
                  avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                  content: <p>{this.state.value}</p>,
                  datetime: moment().fromNow(),
                },
              ],
            });
          }, 1000);
        };
      
        handleChange = e => {
          this.setState({
            value: e.target.value,
          });
        };
      
        render() {
          const { comments, submitting, value } = this.state;
      
          return (
            <>
              {comments.length > 0 && <CommentList comments={comments} />}
              <Comment
                avatar={
                  <Avatar
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    alt="Han Solo"
                  />
                }
                content={
                  <Editor
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                    submitting={submitting}
                    value={value}
                  />
                }
              />
            </>
          );
        }
    }


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
                        <div className="formDetailProduct">
                            <Row>
                                <span>Chat lieu vai : Jean </span>
                            </Row>
                            <Divider />
                            <Row>
                                <span> Size :</span>   
                                <Radio.Group onChange={onChange} value={value}>
                                    <Radio value={1}>XS</Radio>
                                    <Radio value={2}>S</Radio>
                                    <Radio value={3}>M</Radio>
                                    <Radio value={4}>L</Radio>
                                    <Radio value={5}>XL</Radio>
                                </Radio.Group>
                            </Row>
                            <Divider />
                            <Row>
                                <span> Chon mau :</span>   
                                <Radio.Group onChange={onChange} defaultValue="a">
                                    <Radio.Button value="a">Trang</Radio.Button>
                                    <Radio.Button value="b">Xam</Radio.Button>
                                    <Radio.Button value="c">Xanh</Radio.Button>
                                    <Radio.Button value="d">Den</Radio.Button>
                                </Radio.Group>
                            </Row>
                            <Divider />
                            <Row>
                                <span> So luong :</span>   
                                <InputNumber min={1} max={20} defaultValue={1} onChange={onChangeNumber} />
                            </Row>
                            <div>
                                <Button size="large" style={{ backgroundColor: "orange" }}><ShoppingCartOutlined />Them vao gio hang</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="infoProduct">
                <Collapse defaultActiveKey={['1','2']} onChange={callback}>
                    <Panel header="CHI TIET SAN PHAM" key="1">
                        <Row>Danh muc :</Row>
                        <Row>Thuong hieu :</Row>
                        <Row>Chat lieu :</Row>
                        <Row>Kho hang :</Row>
                    </Panel>
                    <Panel header="MO TA SAN PHAM" key="2">
                        <p>{text}</p>
                    </Panel>
                </Collapse>
            </div>
            <div className="commentProduct">
                <h1 style={{textAlign:"center"}}>DANH GIA SAN PHAM</h1>
                <div>
                    <Row>
                        <Col span={6} style={{textAlign:"center"}}>
                            <p>4.5/5</p>
                            <p><Rate disabled allowHalf defaultValue={4.5}></Rate></p>
                        </Col>
                        <Col span={18}>
                            <Button >Tat ca</Button>
                            <Button >1 sao</Button>
                            <Button >2 sao</Button>
                            <Button >3 sao</Button>
                            <Button >4 sao</Button>
                            <Button >5 sao</Button>
                        </Col>
                    </Row>
                </div>
                <div>
                    <List
                        className="comment-list"
                        header={`${data.length} replies`}
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                        <li>
                            <Comment
                            actions={item.actions}
                            author={item.author}
                            avatar={item.avatar}
                            content={item.content}
                            datetime={item.datetime}
                            />
                        </li>
                        )}
                    />
                </div>
                <div>
                    <AddComment />
                </div>
            </div>
        </div>
    );
  };
  
  export { ProductDetail };