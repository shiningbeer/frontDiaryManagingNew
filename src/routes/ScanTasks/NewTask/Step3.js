import React from 'react';
import { connect } from 'dva';
import { Row,Col,Card,Checkbox,Form, Input, Button, Alert, Divider,message } from 'antd';
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

class Step3 extends React.PureComponent {
  componentWillMount(){
    this.props.dispatch({
      type: 'plugin/get'
    });
  }
  render() {
    
    const { plugin, newTask,dispatch, submitting } = this.props;
    const {pluginList,numOfChecked}=plugin
    const height=window.screen.height/3
    const onPrev = () => {
      dispatch(routerRedux.push('/task/newtask/step2'));
    };
    const onValidateForm = (e) => {
      if(numOfChecked==0){
        message.config({top:height})
        message.error('请至少选择一个插件！')
        return
      }
      e.preventDefault();
      let choosedpluginList=[];
      for(var item of pluginList){
        if(item.checked)
          choosedpluginList.push({
            name:item.name,
            port:item.port,
            protocal:item.protocal
          })
      }
      dispatch({
        type: 'task/add',
        payload: {
          ...newTask,
          pluginList:choosedpluginList
        },
      });
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
         onChange={(e)=>{dispatch({type:'plugin/checkedAll',checked:e.target.checked})}}
       ><strong style={{fontSize:16,color:'dodgerblue'}}>全选</strong></Checkbox>
       <Row gutter={8} style={{ marginBottom: 8 }}>
         {pluginList.map((v,k)=>{
           let disabled=false
           if(v.protocal==''||v.port=='')
              disabled=true
           return (
           <Col span={12} key={k}>
           <Card style={{ marginTop: 16 }}>
               <Checkbox disabled={disabled} checked={v.checked} onClick={()=>{dispatch({type:'plugin/checkedOne',index:k})}}><strong style={{fontSize:16}}>{v.name}</strong></Checkbox>
           </Card>
           </Col>
         )}
 
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

export default connect(({task,plugin,loading }) => {
  return {
  submitting: loading.effects['task/add'],
  plugin:plugin,
  newTask:task.newTask
}})(Step3);
