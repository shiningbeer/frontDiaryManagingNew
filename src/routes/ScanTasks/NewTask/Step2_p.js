import React from 'react';
import { connect } from 'dva';
import { Row,Col,Card,Checkbox,Form, Input, Button, Alert, Divider ,message} from 'antd';
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

class Step2 extends React.PureComponent {
  componentWillMount(){
    this.props.dispatch({
      type: 'pluginTarget/get'
    });
  }
  render() {
    const { newTask,pluginTarget, dispatch, submitting } = this.props;
    const onPrev = () => {
      dispatch(routerRedux.push('/task/newtask/step1'));
    };
   console.log(pluginTarget) 
    const {targetList,numOfChecked}=pluginTarget
    const height=window.screen.height/3
    const onValidateForm = (e) => {
      if(numOfChecked==0){
        message.config({top:height})
        message.error('请至少选择一个目标！')
        return
      }
      e.preventDefault();
      let choosedTargetList=[];
      for(var item of targetList){
        if(item.checked){
          let {_id,name,count}=item
          var target={_id,name,count}
          choosedTargetList.push(target)
        }
      }
      dispatch({
        type: 'task/saveStepData',
        stepData: {
          ...newTask,
          targetList:choosedTargetList
        },
      });
      dispatch(routerRedux.push('/task/newtask/step3'))
    
   
    };
    return (

     <div style={{ background: '#ECECEC', padding: '30px' }}>
    <Form layout="horizontal" className={styles.stepForm}>
          
    <Alert
            closable
            showIcon
            message="注意：请不要刷新此页面，否则之前步骤所输入数据将会丢失！"
            style={{ marginBottom: 24 }}
          />
      <Checkbox
        onChange={(e)=>{dispatch({type:'pluginTarget/checkedAll',checked:e.target.checked})}}
      ><strong style={{fontSize:16,color:'dodgerblue'}}>全选</strong></Checkbox>
      <Row gutter={8} style={{ marginBottom: 8 }}>
        {targetList.map((v,k)=>(
          <Col span={12} key={k}>
          <Card style={{ marginTop: 16 }}>
              <Checkbox checked={v.checked} onClick={()=>{dispatch({type:'pluginTarget/checkedOne',index:k})}}><strong style={{fontSize:16}}>{v.taskName}</strong></Checkbox>
              <p></p>
              <p>{`数量：${v.count}`}</p>
              <p>{`端口：${v.port}`}</p>
          </Card>
          </Col>
        )

        )}

      </Row>
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
          <Button type="primary"   onClick={onValidateForm} loading={submitting}>
            下一步
          </Button>
          
        </Form.Item>
      </Form>
      <Divider style={{ margin: '40px 0 24px' }} />
      <div className={styles.desc}>
        <h3>说明</h3>
        <p>插件使用的目标为单个IP，可以是zmap扫描的结果，也可以是用户添加。</p>
        <p>请至少选择一个目标。</p>
      </div>
      </div>
    );
  }
}

export default connect(({ task,pluginTarget,loading }) => {
  
  return {
  pluginTarget:pluginTarget,
  newTask:task.newTask
}})(Step2);