import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class NewUser extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  }
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

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

    return (
      <PageHeaderLayout title="新建目标" content="目标是IP列表集合，供发布任务时选用。每一行为一个ip段，格式必须形如：192.168.4.1-192.168.255.255">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="目标名"
            >
              {getFieldDecorator('title', {
                rules: [{
                  required: true, message: '请输入目标名',
                }],
              })(
                <Input placeholder="给目标起个名字" />
              )}
            </FormItem>
            
            <FormItem
              {...formItemLayout}
              label="描述"
            >
              {getFieldDecorator('title', {})(
                <Input placeholder="可填写目标ip来源于哪里，比如来源于http://ipblock.chacuo.net/" />
              )}
            </FormItem>
            
            <FormItem
              {...formItemLayout}
              label="IP范围"
            >
              {getFieldDecorator('goal', {
                rules: [{
                  required: true, message: '请输入IP范围',
                }],
              })(
                <TextArea style={{ minHeight: 64 }} placeholder="每一行为一个ip段，格式必须形如：192.168.4.1-192.168.255.255" rows={16} />
              )}
            </FormItem>
            
            <FormItem
              {...formItemLayout}
              label="目标公开"
              help="公开的目标可以被其它用户使用"
            >
              <div>
                {getFieldDecorator('public', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">公开</Radio>
                    <Radio value="2">不公开</Radio>
                  </Radio.Group>
                )}
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>取消</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
