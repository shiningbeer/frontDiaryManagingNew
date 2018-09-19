import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  message, Form, Divider, Modal, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';

const { Description } = DescriptionList;
@connect(({ task }) => ({
  taskDetail: task.taskDetail,
  taskResult: task.taskResult,

}))




export default class TaskDetail extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'task/getDetail',
      taskId: this.props.match.params.id,
    });

  }
  state = {
    modalVisible: false,
    currentNode: ''
  }

  render() {
    const { taskDetail, taskResult } = this.props;
    const onModalOk = () => {
      this.setState({
        modalVisible: false,
      })
    }

    const onModalCancel = () => {
      this.setState({
        modalVisible: false,
      })

    }


    return (
      <PageHeaderLayout title="任务详细信息" content={<a href='/#/task/tasklist'>返回列表</a>}>
        <Modal
          title={`当前扫描结果`}
          visible={this.state.modalVisible}
          onOk={onModalOk}
          onCancel={onModalCancel}
          maskClosable={false}
        >
          <div style={{ wordWrap: 'break-word' }}>
            {JSON.stringify(taskResult)}
          </div>
        </Modal>
        <Card bordered={false}>
          <div style={{ wordWrap: 'break-word' }}>
            {JSON.stringify(taskDetail)}
            <p></p>
            <a onClick={() => {
              this.setState({
                modalVisible: true,
              })
              this.props.dispatch({
                type: 'task/getTaskResult',
                taskId: taskDetail._id,
              });
            }} style={{ marginRight: 60 }}>查看结果</a>
            <a onClick={() => {
              if(taskDetail.resultCollected!=true){
                message.warning('结果没有存储完毕，无法导入！')
                return
              }
              if (taskDetail.toES == true)
                message.warning('请不要重复导入！')
              else {
                this.props.dispatch({
                  type: 'task/resultToES',
                  taskId: taskDetail._id,
                })
              }
            }}>结果导入ES</a>
          </div>
          <Divider style={{ marginBottom: 32 }} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
