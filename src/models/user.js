import { query as queryUsers, queryCurrent } from '../services/user';
import crypto from 'crypto'
import Identicon from 'identicon.js'
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      // const response = yield call(queryCurrent);
      let hash = crypto.createHash('md5')
      let name=localStorage.getItem('currentUser')
      hash.update(name); // 传入用户名
      let imgData = new Identicon(hash.digest('hex')).toString()
      let imgUrl = 'data:image/png;base64,'+imgData
      let user={
        name: name,
        avatar: imgUrl,
      }
      yield put({
        type: 'saveCurrentUser',
        payload: user,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
