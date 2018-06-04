import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { task } from '../services/api';

export default {
  namespace: 'task',

  state: {
    newTask: {
      name: '',
      description: '',
      targetList:[],
      pluginList: [],
    },
    taskList:[],
    taskDetail:{},
    nodeTasks:[],
    nodeTaskResult:[]
  },
 
  effects: {
    *add({ payload }, { put,call }) {
      const result= yield call(task.add, {newTask:payload});
      if(result=='ok'){
        yield put({
          type: 'saveStepData',
          payload,
        });
        yield put(routerRedux.push('/task/newtask/step4'));
      }
    },
    *get({ payload }, { put,call }){
      const result= yield call(task.get, payload);
      yield put({
        type: 'getTaskList',
        taskList:result
      });
    },
    *getDetail({ payload }, { put,call }){
      const result= yield call(task.getDetail, payload);
      yield put({
        type: 'getTaskDetail',
        taskDetail:result
      });
    },
    *getNodeTasks({ payload }, { put,call }){
      const result= yield call(task.getNodeTasks, payload);
      yield put({
        type: 'getTaskNodeTasks',
        nodeTasks:result
      });
    },
    *getNodeTaskResult({ payload }, { put,call }){
      const result= yield call(task.getResult, payload);
      yield put({
        type: 'getResult',
        nodeTaskResult:result
      });
    },
    *del({payload}, { call, put }) {
      const re =yield call(task.del,{taskId:payload});
      re=='ok'?message.success('删除任务成功'):message.warning('删除任务失败')
      yield put({
        type: 'get',
        payload:{},
      });
    }, 
    *start({payload}, { call, put }) {
      const re =yield call(task.start,payload);
      re=='ok'?message.success('任务已开始'):message.warning('开始任务失败')
      yield put({
        type: 'get',
        payload:{},
      });
    }, 
    *resume({taskId}, { call, put }) {
      const re =yield call(task.resume,{taskId});
      re=='ok'?message.success('继续任务成功'):message.warning('继续任务失败')
      yield put({
        type: 'get',
        payload:{},
      });
    }, 
    *pause({taskId}, { call, put }) {
      const re =yield call(task.pause,{taskId});
      re=='ok'?message.success('成功暂停任务'):message.warning('暂停任务失败')
      yield put({
        type: 'get',
        payload:{},
      });
    }, 

  },

  reducers: {
    saveStepData(state, { payload }) {
      return {
        ...state,
        newTask: {
          ...state.newTask,
          ...payload,
        },
      };
    },
    getTaskList(state,{taskList}){
      return {
        ...state,
        taskList,
      };
    },
    getTaskDetail(state,{taskDetail}){
      return {
        ...state,
        taskDetail,
      };
    },
    getTaskNodeTasks(state,{nodeTasks}){
      return {
        ...state,
        nodeTasks,
      };
    },
    getResult(state,{nodeTaskResult}){
      return {
        ...state,
        nodeTaskResult,
      };
    },
  },
};
