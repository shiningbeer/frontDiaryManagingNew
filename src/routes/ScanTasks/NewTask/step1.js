import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Alert, Radio } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const formItemLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 80,
  },
};

@Form.create()
class Step1 extends React.PureComponent {
  state = {
    type: 'zmapPlugin',
    
  }
  render() {
    const { form, dispatch, newTask } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const typeDes={
      'zmap':'使用Zmap工具对指定IP段进行扫描，获取扫描结果。',
      'plugin':'使用选择的插件对指定IP段进行扫描，获取扫描结果。',
      'zmapPlugin':'以zmap扫描的结果作为目标IP，使用选择的插件进行扫描，获取扫描结果。',
    }
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'task/saveStepData',
            stepData: {
              ...values,
              type:this.state.type
            }
          });
          this.state.type=='plugin'?dispatch(routerRedux.push('/task/newtask/step2_p')):dispatch(routerRedux.push('/task/newtask/step2'))
          
        }
      });
    };
    return (

      <Fragment>

        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>

          <Form.Item
            {...formItemLayout}
            label="任务名"
          >
            <Input.Group compact>

              {getFieldDecorator('name', {
                initialValue: '',
                rules: [
                  { required: true, message: '请输入任务名' },
                ],
              })(
                <Input size='large' style={{ width: 'calc(100%)' }} placeholder="必填项，请输入任务名" />
              )}
            </Input.Group>

          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label="任务类型"
          >
            <RadioGroup defaultValue="zmapPlugin" onChange={(e) => { this.setState({type:e.target.value}) }}>
              <RadioButton value="zmap">zmap扫描</RadioButton>
              <RadioButton value="plugin">插件扫描</RadioButton>
              <RadioButton value="zmapPlugin">zmap和插件扫描</RadioButton>
              <p>{typeDes[this.state.type]}</p>
            </RadioGroup>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="描述"
          >
            {getFieldDecorator('description', {
              initialValue: '',
            })(
              <Input.TextArea style={{ width: 'calc(100% )', height: '200px' }} placeholder="可不填，请输入任务描述" />
            )}
          </Form.Item>

          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
          </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <p>任务名为任务非唯一标识，取名时请简要标记任务的特点。在任务描述中可对任务进行一些介绍，以在查阅时了解任务的目的和性质。</p>
        </div>
      </Fragment>

    );
  }
}
export default connect(({ task }) => ({
  newTask: task.newTask
}))(Step1);
