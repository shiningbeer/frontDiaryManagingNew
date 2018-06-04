import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,Divider, Modal,Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';

const { Description } = DescriptionList;
@connect(({ loading,task }) => ({
  submitting: loading.effects['target/add'],
  taskDetail:task.taskDetail,
  nodeTasks:task.nodeTasks,
  nodeTaskResult:task.nodeTaskResult
  
}))
export default class TaskDetail extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'task/getDetail',
      payload: {id:this.props.match.params.id},
    });
    this.props.dispatch({
      type: 'task/getNodeTasks',
      payload: {id:this.props.match.params.id},
    });
  }
  state={
    modalVisible:false,
    currentNode:''
  }
  
  render() {
    const { submitting,taskDetail,nodeTasks,nodeTaskResult} = this.props;
    const onModalOk=()=>{
      this.setState({
        modalVisible:false,
      })
    }
    
    const onModalCancel=()=>{
      this.setState({
        modalVisible:false,
      })
     
    }


    return (
    <PageHeaderLayout title="任务详细信息" content={<a href='/#/task/tasklist'>返回列表</a>}>
        <Modal
          title={`任务${taskDetail.name}在节点${this.state.currentNode}上的扫描结果`}
          visible={this.state.modalVisible}
          onOk={onModalOk}
          onCancel={onModalCancel}
          maskClosable={false}
        >
        <div>
        {JSON.stringify(nodeTaskResult)}
        </div>
        </Modal>
        <Card bordered={false}>
          <div>
            {JSON.stringify(taskDetail)}
          </div>
          <Divider style={{ marginBottom: 32 }} />
          {nodeTasks.map((v,k)=>{
            let syncStatus,implStatus
            switch(v.syncStatus){
              case -1:
                syncStatus='未接收'
                break          
              case 0:
                syncStatus='已同步'
                break          
              case 1:
                syncStatus='未同步'
                break
              default:
                syncStatus='已同步'          
            }
            switch(v.implStatus){
              case -1:
                implStatus='出错'
                break          
              case 0:
                implStatus='正常'
                break          
              case 1:
                implStatus='完成'
                break
              default:
                implcStatus='正常'  
            }
            
           return (

             <div key={k}>
            <DescriptionList size="large" title={<p>{`工作节点：${v.node.name}-------`}<a onClick={()=>{
              this.setState({
                modalVisible:true,
                currentNode:v.node.name,
              })
              this.props.dispatch({
                type: 'task/getNodeTaskResult',
                payload: {nodeTaskId:v._id,nodeId:v.node._id,skip:0,limit:10},
              });
            }}>查看结果</a></p>} style={{ marginBottom: 32 }} >
                <Description term="IP数量">{v.ipTotal}</Description>
                <Description term="IP完成数">{v.progress}</Description>
                
                <Description term="执行状态">{implStatus}</Description>
                <Description term="同步状态">{syncStatus}</Description>
                <Description term="错误信息">{v.errMsg}</Description>
                <Description></Description>

            </DescriptionList>
          
          <Divider style={{ marginBottom: 32 }} />
          
          </div>
         )}
 
         )}
          
          
          
        </Card>
      </PageHeaderLayout>
    );
  }
}
