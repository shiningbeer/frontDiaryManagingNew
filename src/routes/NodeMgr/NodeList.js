import React, { PureComponent } from 'react';
import moment from 'moment';
import index, { connect } from 'dva';
import { Modal,List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';
import {FaEdit,FaTrashO} from 'react-icons/lib/fa'
import crypto from 'crypto'
import Identicon from 'identicon.js'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ node, loading }) => ({
  nodeList:node.nodeList,
  loading: loading.effects['node/get']
}))
export default class BasicList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'node/get',
      payload: {
        count: 6,
      },
    });
  }
  state={
    mouseOverEditBtnIndex:-1,
    mouseOverDelBtnIndex:-1
  }
  render() {
    const { nodeList, loading,dispatch } = this.props;

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const editBtnOutLook=(index)=>index==this.state.mouseOverEditBtnIndex?
          {
            size:28,
            color:'red'
          }:
          {
            size:28,
            color:'dodgerblue'
          }
    const delBtnOutLook=(index)=>index==this.state.mouseOverDelBtnIndex?
          {
            size:30,
            color:'red'
          }:
          {
            size:30,
            color:'dodgerblue'
          }
    const confirm = Modal.confirm;
    function showConfirm(id,name) {
      confirm({
        title: '确认删除',
        content: `确认要删除节点"${name}"吗？`,
        onOk() {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          // }).catch(() => console.log('Oops errors!'));
          dispatch({
            type: 'node/del',
            payload: id,
          });
        },
        onCancel() {},
      });
    }

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="mine">我的</RadioButton>
          <RadioButton value="available">可用</RadioButton>
          <RadioButton value="idle">空闲</RadioButton>
        </RadioGroup>
       
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入"
          onSearch={() => ({})}
        />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 6,
      total: 50,
    };

    const ListContent = ({ data: { user, ipLeft, createdAt }}) => {

      return(
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>用户</span>
          <p>{user}</p>
        </div>

        <div className={styles.listContentItem}>
          <span>创建时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>IP剩余</span>
          <p>{ipLeft}</p>
        </div>
      </div>
    )};

    

    return (
      <PageHeaderLayout>
        <div className={styles.standardList} style={{marginLeft:30,marginRight:30}}>
          <Card bordered={false}>
            <Row>
              <Col sm={6} xs={24}>
                <Info title="我的节点" value="3个" bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title="空闲节点数" value="6个" bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title="可用节点数" value="6个" bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title="节点总数" value="35个" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="节点列表"
            style={{ marginTop: 24,marginLeft:30,marginRight:30 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button onClick={()=>{dispatch(routerRedux.push('/node/newnode'))}} type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
              添加新节点
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              
              pagination={paginationProps}
              dataSource={nodeList}
              renderItem={(item,index) => {
                let hash = crypto.createHash('md5')
                hash.update(item.name); // 传入用户名
                let imgData = new Identicon(hash.digest('hex')).toString()
                let imgUrl = 'data:image/png;base64,'+imgData
                if(item.des=='')
                    item.des=`用户${item.user}有点懒，什么描述都没添加。`
                let actionOption=item.user==localStorage.getItem('currentUser')?
                <div style={{width:100}}>                  
                  <FaEdit
                    style={{fontSize: editBtnOutLook(index).size,color: editBtnOutLook(index).color,marginTop:6}}
                    onMouseEnter={()=> this.setState( {mouseOverEditBtnIndex:index})}                      
                    onMouseLeave={()=> this.setState( {mouseOverEditBtnIndex:-1})}
                  /> 
                  <FaTrashO 
                    style={{fontSize:delBtnOutLook(index).size,color:delBtnOutLook(index).color}}
                    onClick={()=>showConfirm(item._id,item.name)}
                    onMouseEnter={()=> this.setState( {mouseOverDelBtnIndex:index})}                      
                    onMouseLeave={()=> this.setState( {mouseOverDelBtnIndex:-1})}
                  />
                </div>:
                <div style={{width:100}}>
                  <FaEdit style={{fontSize: editBtnOutLook(index).size,color: 'grey',marginTop:6}}/>
                  <FaTrashO  style={{fontSize:delBtnOutLook(index).size,color:'grey'}}/>
                </div>
                return (
                <List.Item
                // onMouseLeave={()=>this.setState({mouseOver:false})}
                  actions={[<a>详细</a>,actionOption]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={imgUrl} shape="square" size="small" />}
                    title={item.name}
                    description={item.url}
                  />
                  <ListContent data={item}/>
                </List.Item>
              )}}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
