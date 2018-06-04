import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider,Alert } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Option } = Select;

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
  render() {
    const { form, dispatch, newTask } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'task/saveStepData',
            payload: values,
          });
          dispatch(routerRedux.push('/task/newtask/step2'));
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
          {...formItemLayout}
          label="描述"
        >
          {getFieldDecorator('description', {
            initialValue:'',
          })(
            <Input.TextArea style={{ width: 'calc(100% )',height:'200px' }} placeholder="可不填，请输入任务描述" />
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
  newTask:task.newTask
}))(Step1);
