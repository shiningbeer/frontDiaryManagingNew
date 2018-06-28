import React, { PureComponent } from 'react';
import moment from 'moment';
import index, { connect } from 'dva';
import { message,Checkbox,Modal,List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';
import {FaPauseCircle,FaPlayCircle,FaTrashO} from 'react-icons/lib/fa'
import crypto from 'crypto'
import Identicon from 'identicon.js'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;


class TaskList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'task/get',
      payload: {},
    });
  }
  state={
    mouseOverPlayBtnIndex:-1,
    mouseOverDelBtnIndex:-1,
    modalVisible:false,
    selectedTask:{},
  }
  render() {
    const {taskList,node,loading,dispatch } = this.props;
    const {nodeList,numOfChecked,checkedAll}=node

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    const onModalOk=()=>{
      if(numOfChecked==0){
        message.config({top:window.screen.height/3})
        message.error('请至少选择一个节点！')
        return
      }
      let choosedNodeList=[];
      for(var item of nodeList){
        if(item.checked){
          let {_id,name}=item
          var node={_id,name}
          choosedNodeList.push(node)
        }
      }
      dispatch({
        type: 'task/start',
        payload: {task:this.state.selectedTask,nodeList:choosedNodeList},
      });
      dispatch({type:'node/checkedAll',checked:false})
      this.setState({
        modalVisible:false,
        selectedTask:{}
      })
    }
    const onModalCancel=()=>{
      this.setState({
        modalVisible:false,
        selectedTask:{}
      })
      dispatch({type:'node/checkedAll',checked:false})
    }
    const playBtnOutLook=(index)=>index==this.state.mouseOverPlayBtnIndex?
          {
            size:30,
            color:'red'
          }:
          {
            size:30,
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
        <RadioGroup defaultValue="all" style={{marginLeft:10}}>
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">未开始</RadioButton>
          <RadioButton value="waiting">进行中</RadioButton>
          <RadioButton value="waiting">已结束</RadioButton>
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


    const confirm = Modal.confirm;
    function showConfirm(id,name) {
      confirm({
        title: '确认删除',
        content: `确认要删除任务"${name}"吗？`,
        onOk() {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          // }).catch(() => console.log('Oops errors!'));
          dispatch({
            type: 'task/del',
            payload: id,
          });
        },
        onCancel() {},
      });
    }
    

    const OPER_STATUS = {
      new: 'new',
      run:'run',
      pause:'pause',
      complete:'complete',
      delete:'delete'
    }
  const IMPL_STATUS={
    wrong:'wrong',  
    waiting:'waiting',
    running:'running',
    complete:'complete',
  }
    const ListContent = ({ data: { user, createdAt, percent, operStatus,implStatus }}) => {
      let pstatus,sstatus
      console.log(percent)
      switch(operStatus){
        case OPER_STATUS.pause:
          sstatus='暂停中'
          break
        case OPER_STATUS.new:
          sstatus='新任务'
          break
        case OPER_STATUS.complete:
          sstatus='已完成'
          break
        case OPER_STATUS.run:
          sstatus='进行中'
          break
        default:
          sstatus='进行中'
      }
      switch(implStatus){
        case IMPL_STATUS.wrong:
          pstatus='exception'
          sstatus='出错了'
          break
        case IMPL_STATUS.waiting:
          pstatus='normal'
          if (sstatus!='新任务')
            sstatus='等待中'
          break
        case IMPL_STATUS.running:
          pstatus='normal'
          break
        case IMPL_STATUS.complete:
          pstatus='success'
          sstatus='已完成'
          break
        default:
        pstatus='exception'
      }

      return(
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>用户</span>
          <p>{user}</p>
        </div>
        
        <div className={styles.listContentItem}>
          <span>创建时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress percent={parseFloat(percent.toFixed(1))} status={pstatus} strokeWidth={6} style={{ width: 120 }} />
        </div>
        <div className={styles.listContentItem}>
          <span>状态</span>
          <p>{sstatus}</p>
        </div>
      </div>
    )};

    

    return (
      <PageHeaderLayout>
        <div className={styles.standardList} style={{marginLeft:30,marginRight:30}}>
        <Modal
          title="选择扫描节点"
          visible={this.state.modalVisible}
          onOk={onModalOk}
          onCancel={onModalCancel}
          maskClosable={false}
        >
           <Checkbox
        onChange={(e)=>{dispatch({type:'node/checkedAll',checked:e.target.checked})}}
        checked={checkedAll}
      ><strong style={{fontSize:16,color:'dodgerblue'}}>全选</strong></Checkbox>
      <Row gutter={8} style={{ marginBottom: 8 }}>
        {nodeList.map((v,k)=>(
          <Col span={12} key={k}>
          <Card style={{ marginTop: 16 }}>
              <Checkbox checked={v.checked} onClick={()=>{dispatch({type:'node/checkedOne',index:k})}}><strong style={{fontSize:16}}>{v.name}</strong></Checkbox>
          </Card>
          </Col>
        )

        )}

      </Row>
        </Modal>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="我的任务" value="8个任务" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周任务平均处理时间" value="32 IP/分钟" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周完成任务数" value="24个任务" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="任务列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button onClick={()=>{dispatch(routerRedux.push('/task/newtask'))}} type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
              添加新任务
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              
              pagination={paginationProps}
              dataSource={taskList}
              renderItem={(item,index) => {
                let hash = crypto.createHash('md5')
                hash.update(item.name); // 传入用户名
                let imgData = new Identicon(hash.digest('hex')).toString()
                let imgUrl = 'data:image/png;base64,'+imgData
                if(item.description=='')
                  item.description=`用户${item.user}有点懒，什么描述都没添加。`
                let actionOption=item.user==localStorage.getItem('currentUser')?
                <div style={{width:100}}>
                    {item.operStatus!=OPER_STATUS.run?
                    <FaPlayCircle 
                      style={{fontSize:playBtnOutLook(index).size,color:playBtnOutLook(index).color}}
                      onMouseEnter={()=> this.setState( {mouseOverPlayBtnIndex:index})}                      
                      onMouseLeave={()=> this.setState( {mouseOverPlayBtnIndex:-1})}
                      onClick={()=>{
                        
                        if(item.operStatus==OPER_STATUS.new){
                          this.setState({modalVisible:true,selectedTask:{id:item._id,name:item.name,targetList:item.targetList,plugin:item.plugin}})
                          dispatch({type:'node/get'})
                        }
                        else if (item.operStatus==OPER_STATUS.pause){
                          dispatch({type:'task/resume',taskId:item._id})
                        }
                        else
                        message.warning('任务已经完成！')
                    }}
                      />:
                    <FaPauseCircle 
                      style={{fontSize:playBtnOutLook(index).size,color:playBtnOutLook(index).color}}
                      onMouseEnter={()=> this.setState( {mouseOverPlayBtnIndex:index})}                      
                      onMouseLeave={()=> this.setState( {mouseOverPlayBtnIndex:-1})}
                      onClick={()=>{dispatch({type:'task/pause',taskId:item._id})}}
                    />}
                    <FaTrashO 
                      style={{fontSize:delBtnOutLook(index).size,color:delBtnOutLook(index).color}}
                      onClick={()=>showConfirm(item._id,item.name)}
                      onMouseEnter={()=> this.setState( {mouseOverDelBtnIndex:index})}                      
                      onMouseLeave={()=> this.setState( {mouseOverDelBtnIndex:-1})}
                    />
                </div>:
                    <div style={{width:100}}>
                    {item.status!=2?
                    <FaPlayCircle 
                      style={{fontSize:playBtnOutLook(index).size,color:'grey'}}
                      />:
                    <FaPauseCircle 
                      style={{fontSize:playBtnOutLook(index).size,color:'grey'}}
                    />}
                    <FaTrashO 
                      style={{fontSize:delBtnOutLook(index).size,color:'grey'}}
                    />
                </div>
                return (
                <List.Item
                // onMouseLeave={()=>this.setState({mouseOver:false})}
                  actions={[<a href={`/#/task/taskdetail/${item._id}`}>详细</a>, actionOption]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={imgUrl} shape="circle" size="small" />}
                    title={item.name}
                    description={item.description}
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
export default connect(({ task, node,loading }) => ({
  taskList:task.taskList,
  node:node,
  loading: loading.effects['task/get'],
}))(TaskList);
