import { routerRedux } from 'dva/router';
import { fakeAccountLogin,usermgr } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {

      const response = yield call(usermgr.getToken, payload);
      if(response==null)
        return;
     
      // Login successfully
      if (response.status == 'ok') {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        reloadAuthorized();
        localStorage.setItem('token',response.token)
        localStorage.setItem('currentUser',response.currentUser)
        yield put(routerRedux.push('/task/newtask'));
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        localStorage.removeItem('token')
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
