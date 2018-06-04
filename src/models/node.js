import { node } from '../services/api';
import { message } from 'antd';
export default {
  namespace: 'node',

  state: {
    nodeList: [],
    numOfChecked:0,
    checkedAll:false,
  },

  effects: {
    *get(_, { call, put }) {
      const response = yield call(node.get);
      yield put({
        type: 'getSuccess',
        nodeList: response,
      });
    },    
    *add({payload}, { call, put }) {
      const response=yield call(node.add,{newNode:payload});
      response=='ok'?message.success('添加节点成功'):message.warning('添加节点失败')
      localStorage.removeItem('newNodeToken')
    },    
    *getToken({url,params}, { call, put }) {
      const response=yield call(node.getToken,url,params)
      
      switch(response.code){
        case 200:
        if(url.indexOf('http://')!=0){
          message.warning('url格式填写不正确，请以http://开头')
          break
        }
        var token=yield response.body.then((r)=>{return r})
        message.success('获取token成功')
        localStorage.setItem('newNodeToken',token)
        break
        case 600:
        message.warning('节点服务器无法连接，请确认所填写url地址正确。')
        break
        case 401:
        message.warning('用户名密码错误!')
        break
        default:
        message.warning('获取token失败')      
      }
      
      
    },
    *del({payload}, { call, put }) {
      const re =yield call(node.del,{nodeId:payload});
      re=='ok'?message.success('删除节点成功'):message.warning('删除节点失败')
      yield put({
        type: 'get',
      });
    },   
  },

  reducers: {
    getSuccess(state, {nodeList}) {
      for(var item of nodeList){
          item.checked=false
      }
      return {
        ...state,
        nodeList:nodeList,
      };
    },
    checkedAll(state,{checked}){
        let num=checked?state.nodeList.length:0
        for(var item of state.nodeList){
            item.checked=checked
        }
        
        return {
            ...state,
            numOfChecked:num,
            nodeList:state.nodeList,
            checkedAll:checked
          };
    },
    checkedOne(state,{index}){
        state.nodeList[index].checked=!state.nodeList[index].checked
        let num=0
        for(var item of state.nodeList){
          item.checked?num=num+1:num=num
        }
        return {
            ...state,
            numOfChecked:num,
            nodeList:state.nodeList,
          };

    },
  },
};
