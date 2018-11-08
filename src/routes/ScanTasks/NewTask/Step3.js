import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Checkbox, Form, Input, Button, Alert, Divider, message } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step3 extends React.PureComponent {
  componentWillMount() {
    this.props.dispatch({
      type: 'plugin/get'
    });
  }
  state = {
    useDesignatedPort: false
  }
  render() {

    const { form, plugin, newTask, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { pluginList, numOfChecked } = plugin
    const height = window.screen.height / 3
    const onPrev = () => {
      dispatch(routerRedux.push('/task/newtask/step2'));
    };
    const onValidateForm = (e) => {
      if (newTask.type != 'zmap' && numOfChecked == 0) {
        message.config({ top: height })
        message.error('请至少选择一个插件！')
        return
      }

      if(newTask.type=='zmap'){
        validateFields((err, value) => {
          if(!err){
            dispatch({
              type: 'task/add',
              newTask: {
                ...newTask,
                ...value
              },
            })
          }
        })
        return
      }
      e.preventDefault();

      validateFields((err, value) => {
        let choosedpluginList = [];
        for (var item of pluginList) {
          if (this.state.useDesignatedPort)
            item.port = value.port
          if (item.checked)
            choosedpluginList.push({
              name: item.name,
              port: item.port,
              protocal: item.protocal
            })
        }
        if (!err||!this.state.useDesignatedPort) {

          dispatch({
            type: 'task/add',
            newTask: {
              ...newTask,
              pluginList: choosedpluginList,
            },
          })
        }
      })

    };
    const chooseToShow = () => {
      console.log(newTask.type)
      if (newTask.type == 'zmap') {
        return (
          <div>
            <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>

              <Form.Item
                {...formItemLayout}
                label="扫描端口"
              >
                <Input.Group compact>

                  {getFieldDecorator('port', {
                    initialValue: '',
                    rules: [
                      { required: true, message: '请输入扫描端口', pattern: '[0-9]+' },
                    ],
                  })(
                    <Input size='large' style={{ width: 'calc(100%)' }} placeholder="必填项，请输入要扫描的端口。" />
                  )}
                </Input.Group>

              </Form.Item>
            </Form>
          </div>)
      }
      else {
        return (
          <div>



            <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>

              <Form.Item>

                <Input.Group compact>
                  <Checkbox
                    onChange={(e) => { console.log(this.state.useDesignatedPort); this.setState({ useDesignatedPort: e.target.checked }) }}
                  ><strong style={{ fontSize: 16, color: 'dodgerblue' }}>指定端口:</strong></Checkbox>
                  {getFieldDecorator('port', {
                    initialValue: '',
                    rules: [
                      { required: true, message: '请输入扫描端口', pattern: '[0-9]+' },
                    ],
                  })(

                    <Input size='large' style={{ width: 'calc(50%)' }} placeholder="请输入指定的扫描端口。" />
                  )}
                </Input.Group>

              </Form.Item>
            </Form>
            <p></p>
            <Checkbox
              onChange={(e) => { dispatch({ type: 'plugin/checkedAll', checked: e.target.checked }) }}
            ><strong style={{ fontSize: 16, color: 'dodgerblue' }}>全选</strong></Checkbox>
            <Row gutter={8} style={{ marginBottom: 8 }}>
              {pluginList.map((v, k) => {
                let disabled = false
                if (v.protocal == '' || v.port == '')
                  disabled = true
                return (
                  <Col span={12} key={k}>
                    <Card style={{ marginTop: 16 }}>
                      <Checkbox disabled={disabled} checked={v.checked} onClick={() => { dispatch({ type: 'plugin/checkedOne', index: k }) }}><strong style={{ fontSize: 16 }}>{v.name}</strong></Checkbox>
                      <p></p>
                      <p>{`默认端口：${v.port}`}</p>
                    </Card>
                  </Col>
                )
              })}

            </Row></div>)

      }
    }

    return (

      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Form layout="horizontal" className={styles.stepForm}>
          <Alert
            closable
            showIcon
            message="注意：请不要刷新此页面，否则之前步骤所输入数据将会丢失！"
            style={{ marginBottom: 24 }}
          />

          {chooseToShow()}


          <Divider style={{ margin: '40px 0 24px' }} />
          <Form.Item
            style={{ marginBottom: 8 }}
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label=""
          >
            <Button onClick={onPrev} style={{ marginRight: 8 }}>
              上一步
           </Button>
            <Button type="primary" onClick={onValidateForm} loading={submitting}>
              提交
           </Button>

          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <p>插件是本平台提供的扫描插件，任何用户均可使用，但插件的增加和删除仅管理员用户可使用。</p>
          <p>请至少选择一个插件。</p>
        </div>
      </div>
    );
  }
}

export default connect(({ task, plugin, loading }) => {
  return {
    submitting: loading.effects['task/add'],
    plugin: plugin,
    newTask: task.newTask
  }
})(Step3);
