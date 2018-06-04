import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Modal,message,Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['node/add'],
  loading_getToken:loading.effects['node/getToken']
}))
@Form.create()
export default class NewNode extends PureComponent {
  state={
    nodeurl:''
  }
  render() {
    const { submitting,dispatch,loading_getToken } = this.props;
    const { getFieldDecorator, getFieldValue,resetFields} = this.props.form;

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
    const handleSubmit = (e) => {
      var token=localStorage.getItem('newNodeToken')
      if(token==null){
        message.warning('请先获取节点认证token!')
        return
      }
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let newValues={
            ...values,
            token,
          }
          this.props.dispatch({
            type: 'node/add',
            payload: newValues,
          });
          resetFields()
        }
      });
    }

    const confirm = Modal.confirm;
    function showConfirm(url) {
      let username=''
      let password=''
      confirm({
        title: '获取token',
        content: <Form
                      onSubmit={handleSubmit}
                      hideRequiredMark
                      style={{ marginTop: 8 }}
                    >
                      <FormItem
                        {...formItemLayout}
                        label="用户名"
                      >
                        
                          <Input onChange={(e)=>username=e.target.value} placeholder="必填项，用户名" />
                      </FormItem>
                      
                      <FormItem
                        {...formItemLayout}
                        label="密码"
                      >
                          <Input onChange={(e)=>password=e.target.value} placeholder="必填项，密码" />
                        
                      </FormItem>
                    </Form>,
        onOk() {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          // }).catch(() => console.log('Oops errors!'));
          dispatch({
            type: 'node/getToken',
            url:url,
            params:{
              username,password
            }
          });
         
          
        },
        onCancel() {},
      });
    }
    return (
      <PageHeaderLayout title="新建节点" content="节点是任务的基本工作单位，请确保连接通畅及账户和密码正确，保证任务的正常支行。">
        <Card bordered={false}>
          <Form
            onSubmit={handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="节点名"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入节点名',
                }],
              })(
                <Input placeholder="必填项，给节点起个名字" />
              )}
            </FormItem>
            
            <FormItem
              {...formItemLayout}
              label="url地址"
            >
              {getFieldDecorator('url', {rules: [{
                  required: true, message: '请输入url地址',
                }],})(
                <Input onChange={(e)=>this.setState({nodeurl:e.target.value})} placeholder="必填项，形如：http://ipblock.chacuo.net/" />
              )}
              <Button type="primary" loading={loading_getToken}onClick={()=>showConfirm(this.state.nodeurl)}>
                获取Token
              </Button>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="描述"
            >
              {getFieldDecorator('des', {})(
                <Input placeholder="可不填，对节点作简单描述。" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="节点公开"
              help="公开的节点可以被其它用户使用"
            >
              <div>
                {getFieldDecorator('shared', {
                  initialValue: false,
                })(
                  <Radio.Group>
                    <Radio value={true}>公开</Radio>
                    <Radio value={false}>不公开</Radio>
                  </Radio.Group>
                )}
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button onClick={()=>resetFields()}style={{ marginLeft: 8 }}>重置</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
