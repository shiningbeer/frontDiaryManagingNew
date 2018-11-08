import { target } from '../services/api';
import { message } from 'antd';
export default {
  namespace: 'pluginTarget',

  state: {
    targetList: [],
    numOfChecked:0
  },

  effects: {
    *get(_, { call, put }) {
      const response = yield call(target.getZmapResult);
      yield put({
        type: 'getSuccess',
        targetList: response,
      });
    },    

    *del({payload}, { call, put }) {
      const re =yield call(target.del,{targetId:payload});
      re=='ok'?message.success('删除目标成功'):message.warning('删除目标失败')
      const response = yield call(target.get);
      yield put({
        type: 'getSuccess',
        targetList: response,
      });
    },   
  },

  reducers: {
    getSuccess(state, {targetList}) {
      for(var item of targetList){
          item.checked=false
          item.name=item.taskName
      }
      return {
        ...state,
        targetList:targetList,
      };
    },
    checkedAll(state,{checked}){
        let num=checked?state.targetList.length:0
        for(var item of state.targetList){
            item.checked=checked
        }
        
        return {
            ...state,
            numOfChecked:num,
            targetList:state.targetList,
          };
    },
    checkedOne(state,{index}){
        state.targetList[index].checked=!state.targetList[index].checked
        let num=0
        for(var item of state.targetList){
          item.checked?num=num+1:num=num
        }
        return {
            ...state,
            numOfChecked:num,
            targetList:state.targetList,
          };

    },
  },
};
