import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from '../../../components/Result';
import styles from './style.less';

class Step4 extends React.PureComponent {
  render() {
    const { dispatch, newTask } = this.props;
    const onFinish = () => {
      dispatch(routerRedux.push('/task/newtask/step1'));
    };
    const information = (
      <div className={styles.information}>
        <Row>
          <Col span={8} className={styles.label}>任务名：</Col>
          <Col span={16}>{newTask.name}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>任务类型：</Col>
          <Col span={16}>{newTask.type}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>任务描述：</Col>
          <Col span={16}>{newTask.description}</Col>
        </Row>
        <Row>
          <Col span={8} className={styles.label}>扫描目标：</Col>
          <Col span={16}>{newTask.targetList.map((v,k)=>(`${v.name};`))}</Col>
         
          
        </Row>
        <Row>
          <Col span={8} className={styles.label}>使用插件：</Col>
          <Col span={16}>{newTask.pluginList.map((v,k)=>(`${v.name};`))}</Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          继续发布
        </Button>
        <Button onClick={()=>{ dispatch(routerRedux.push('/task/tasklist'))}}>
          查看任务
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="发布成功"
        description="任务发布成功，但尚未执行"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect(({ form,task }) => ({
  newTask:task.newTask
}))(Step4);
