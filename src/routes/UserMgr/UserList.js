import React, { PureComponent } from 'react';
import moment from 'moment';
import index, { connect } from 'dva';
import { Modal,Form,List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';
import {FaEdit,FaTrashO} from 'react-icons/lib/fa'
import crypto from 'crypto'
import Identicon from 'identicon.js'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
const FormItem = Form.Item;
@connect(({ usermgr, loading }) => ({
  usermgrList:usermgr.usermgrList,
  loading: loading.effects['usermgr/get'],
  addUserLoading:loading.effects['usermgr/add']
}))
@Form.create()
export default class BasicList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'usermgr/get',
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
    const { usermgrList, loading,dispatch,addUserLoading } = this.props;
    const { getFieldDecorator, getFieldValue,validateFields } = this.props.form;
    const onAddUser = () => {
      validateFields((err, values) => {
        if(values.password==null)
            values.password='888888'
        if (!err) {
          dispatch({
            type: 'usermgr/add',
            payload: values,
          });
        }
      });
    };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
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
    

    const extraContent = (
      <div className={styles.extraContent}>
      {getFieldDecorator('name', {
        rules: [{
          required: true, message: '请输入用户名',
        }],
      })(
        <Input style={{width:120,marginRight:30}} placeholder="请输入新用户名" />
      )}
      {getFieldDecorator('password', {})(
        <Input style={{width:120,marginRight:30}} placeholder="密码默认888888" />
      )}
             
          {getFieldDecorator('authority', {
            initialValue: 'user',
          })(
            <Radio.Group>
              <Radio value="user">普通</Radio>
              <Radio value="admin">管理员</Radio>
            </Radio.Group>
          )}
              
       
        <Button loading={addUserLoading} onClick={onAddUser} style={{marginLeft:20}} icon='plus'>
                添加用户
              </Button>
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 6,
      total: 50,
    };

  
    const ListContent = ({ data: { authority, taskCount, lastLoginAt }}) => {

      return(
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>用户权限</span>
          <p>{authority}</p>
        </div>
        
        <div className={styles.listContentItem}>
          <span>最后登陆时间</span>
          <p>{moment(lastLoginAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>执行任务数</span>
          <p>{taskCount}</p>
        </div>
      </div>
    )};

    const confirm = Modal.confirm;

    function showConfirm(id,name) {
      confirm({
        title: '确认删除',
        content: `确认要删除用户名为"${name}"的用户吗？`,
        onOk() {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          // }).catch(() => console.log('Oops errors!'));
          dispatch({
            type: 'usermgr/del',
            payload: id,
          });
        },
        onCancel() {},
      });
    }

    return (
      <PageHeaderLayout>
        <div className={styles.standardList} style={{marginLeft:30,marginRight:30}}>
          

          <Card
            className={styles.listCard}
            bordered={false}
            title="用户列表"
            style={{ marginTop: 24,marginLeft:30,marginRight:30 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            
            <List
              size="large"
              rowKey="id"
              loading={loading}
              
              pagination={paginationProps}
              dataSource={usermgrList}
              renderItem={(item,index) => {
                let hash = crypto.createHash('md5')
                hash.update(item.name); // 传入用户名
                let imgData = new Identicon(hash.digest('hex')).toString()
                let imgUrl = 'data:image/png;base64,'+imgData
               
                return (
                <List.Item
                // onMouseLeave={()=>this.setState({mouseOver:false})}
                  actions={[<a>重置密码</a>,
                    <div style={{width:60}}>
                    
                    <FaTrashO 
                      style={{fontSize:delBtnOutLook(index).size,color:delBtnOutLook(index).color}}
                      onClick={()=>showConfirm(item._id,item.name)}
                      onMouseEnter={()=> this.setState( {mouseOverDelBtnIndex:index})}                      
                      onMouseLeave={()=> this.setState( {mouseOverDelBtnIndex:-1})}
                    />
                </div>]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={imgUrl} shape="square" size="small" />}
                    title={item.name}
                    description={`最后登录IP:${item.lastLoginIp}`}
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
