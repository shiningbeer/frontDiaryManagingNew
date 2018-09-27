import React, { Component, Fragment } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Card, Steps } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NotFound from '../../Exception/404';
import { getRoutes } from '../../../utils/utils';
import styles from './index.less';
const { Step } = Steps;
export default class Newtask extends Component {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'step1': return 0;
      case 'step2': return 1;
      case 'step3': return 2;
      case 'step4': return 3;
      default: return 0;
    }
  }
  render() {
    const { match, routerData } = this.props;
    return (
      <div>
         <PageHeaderLayout title="发布新任务" content="用户可在此处按步骤发布定制化任务。">
         <Card>
         <Fragment>
      <Steps  current={this.getCurrentStep()} className={styles.steps}>
              <Step title="填写信息" />
              <Step title="选择目标" />
              <Step title="选择插件/端口" />
              <Step title="完成" />
            </Steps>
            <Switch>
            {
                getRoutes(match.path, routerData).map(item => (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                ))
              }
              <Redirect exact from="/task/newtask" to="/task/newtask/step1" />
              <Route render={NotFound} />
            </Switch>
            </Fragment>
            </Card>
      </PageHeaderLayout>
      </div>
    );
  }
}
