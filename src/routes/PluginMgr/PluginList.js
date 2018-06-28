import React, { PureComponent } from 'react';
import moment from 'moment';
import index, { connect } from 'dva';
import { Form,Modal,Checkbox,message,Upload,List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';
import {FaEdit,FaTrashO} from 'react-icons/lib/fa'
import crypto from 'crypto'
import Identicon from 'identicon.js'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './style.less';
const Dragger = Upload.Dragger;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Search } = Input;
const FormItem = Form.Item;
@connect(({ plugin, loading }) => ({
  pluginList:plugin.pluginList,
  loading: loading.effects['plugin/get']
}))
@Form.create()
export default class PluginList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'plugin/get',
      payload: {
        count: 6,
      },
    });
  }
  state={
    mouseOverEditBtnIndex:-1,
    mouseOverDelBtnIndex:-1,
    modalVisible:false,
    selectedPlugin:{},
  }
  render() {
    const { pluginList, loading,dispatch } = this.props;
    const { getFieldDecorator, getFieldValue,resetFields } = this.props.form;

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    const onModalOk=()=>{
      this.props.form.validateFieldsAndScroll((err, values) => {
        if(!err){
          console.log(values)
          dispatch({
            type:'plugin/update',
            payload:{
              name:this.state.selectedPlugin.name,
              update:values
            }
          })
          resetFields()
          this.setState({
            modalVisible:false,
          })
        }
      })
    }

    const onModalCancel=()=>{
      this.setState({
        modalVisible:false,
      })
      resetFields()
     
    }

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
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">我的</RadioButton>
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

    const ListContent = ({ data: { user, port,protocal,uploadAt, }}) => {
      if(port=='')
        port='请完善'
      if(protocal=='')
        protocal='请完善'
      return(
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>用户</span>
          <p>{user}</p>
        </div>
        
        <div className={styles.listContentItem}>
          <span>所用端口</span>
          <p>{port}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>TCP/UDP</span>
          <p>{protocal}</p>
        </div>
        
        <div className={styles.listContentItem}>
          <span>上传时间</span>
          <p>{moment(uploadAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      </div>
    )};
    const props = {
      name: 'file',
      multiple: true,
      action: 'http://localhost:1978/plugin/add',
      headers:{'token':localStorage.getItem('token')},
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
          dispatch({
            type: 'plugin/get',
            payload: {
              count: 6,
            },
          });
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const confirm = Modal.confirm;
    function showConfirm(name) {
      confirm({
        title: '确认删除',
        content: `确认要删除插件"${name}"吗？`,
        onOk() {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          // }).catch(() => console.log('Oops errors!'));
          dispatch({
            type: 'plugin/del',
            payload: name,
          });
        },
        onCancel() {},
      });
    }

    return (
      <PageHeaderLayout title="插件管理" content="本工具只支持python所写的插件。">
        <div className={styles.standardList} style={{marginLeft:30,marginRight:30}}>
        <Modal
          title={`编辑插件信息-->${this.state.selectedPlugin.name}`}
          visible={this.state.modalVisible}
          onOk={onModalOk}
          onCancel={onModalCancel}
          maskClosable={false}>
          <Form
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            
            
            <FormItem
              {...formItemLayout}
              label="插件描述"
            >
              {getFieldDecorator('description', {initialValue:this.state.selectedPlugin.description,})(
                <TextArea style={{ minHeight: 16 }} placeholder="可不填，插件的简单描述。" rows={4} />
              )}
            </FormItem>
            
            <FormItem
              {...formItemLayout}
              label="使用协议"
            >
              <div>
                {getFieldDecorator('protocal', {
                  initialValue:this.state.selectedPlugin.protocal,
                  rules: [{
                    required: true, message: '请选择协议',
                  }],
                })(
                  <Radio.Group>
                    <RadioButton value='TCP'>TCP</RadioButton>
                    <RadioButton value='UDP'>UDP</RadioButton>
                  </Radio.Group>
                )}
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="使用端口"
            >
              {getFieldDecorator('port', {
                rules: [{
                  required: true, message: '请输入端口号',
                }],
                initialValue:this.state.selectedPlugin.port,
              })(
                <Input placeholder="必填项，插件使用的端品号" />
              )}
            </FormItem>
            
          </Form>
        </Modal>
        <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">添加新插件</p>
              <p className="ant-upload-hint">点击选择插件或者直接将插件文件拖拽入框内，支持多选。请注意不要与已有插件同名！</p>
              <p className="ant-upload-hint"><strong>插件上传后必须点击编辑图标完善端口信息和协议信息，否则无法使用！。</strong></p>
            </Dragger>
          <Card
            className={styles.listCard}
            bordered={false}
            title="插件列表"
            style={{ marginTop: 24,marginLeft:30,marginRight:30 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            
            <List
              size="large"
              rowKey="id"
              loading={loading}
              
              pagination={paginationProps}
              dataSource={pluginList}
              renderItem={(item,index) => {
                let hash = crypto.createHash('md5')
                hash.update(item.name); // 传入用户名
                let imgData = new Identicon(hash.digest('hex')).toString()
                let imgUrl = 'data:image/png;base64,'+imgData
                let description=item.description
                if(item.description=='')
                    description='用户尚未更新描述。'
                return (
                <List.Item
                // onMouseLeave={()=>this.setState({mouseOver:false})}
                  actions={[<a>详细</a>,
                    <div style={{width:100}}>
                    
                    <FaEdit
                      style={{fontSize: editBtnOutLook(index).size,color: editBtnOutLook(index).color,marginTop:6}}
                      onMouseEnter={()=> this.setState( {mouseOverEditBtnIndex:index})}                      
                      onMouseLeave={()=> this.setState( {mouseOverEditBtnIndex:-1})}
                      onClick={()=>this.setState({modalVisible:true,selectedPlugin:item})}
                    />
                    <FaTrashO 
                      style={{fontSize:delBtnOutLook(index).size,color:delBtnOutLook(index).color}}
                      onClick={()=>showConfirm(item.name)}
                      onMouseEnter={()=> this.setState( {mouseOverDelBtnIndex:index})}                      
                      onMouseLeave={()=> this.setState( {mouseOverDelBtnIndex:-1})}
                    />
                </div>]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={imgUrl} shape="square" size="small" />}
                    title={item.name}
                    description={description}
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
