import {
  queryLoginUrl,
  queryLogoutUrl,
  queryCurrentUser,
  queryAccessToken,
  doDiLogout,
  doOauthLoginPassword,
  getUserAuthorization,
  menuEntryAuthorization,
} from '@/services/api';
import { queryProductList } from '@/services/Platform/Service/product';
import { notification } from 'antd';
import { homepage } from '@/defaultSettings';
import {
  getSessionCache,
  addSessionCache,
  clearSessionCache,
  isMenuIntegration,
} from '@/utils/Platform/platformUtil';
import router from 'umi/router';
import DiResponse from '@/components/DiResponse';

/**
 * 产品首页是否是Iframe页面
 * @type {string}
 */
const HOME_URI_IS_FRAME_TRUE = '1';

export default {
  namespace: 'login',

  state: {
    loginMode: '',
    loginUrl: '',
    currentUser: {},
    user: {},
    accessTokenResponse: '',
    loginResult: '', // 登录结果-报错信息
  },

  effects: {
    /**
     * 查询登录地址
     * cas 返回cas登录地址
     * oauth 授权码返回oauth地址
     * oauth 用户名密码模式返回空
     * @param {*} _
     * @param {*} param1
     */
    *fetchLoginUrl(_, { call, put }) {
      const loginUrlResult = yield call(queryLoginUrl);
      if (!loginUrlResult) {
        notification.open({
          message: '获取登录地址请求失败',
          description: '请求失败，请检查后台服务是否正常启动！',
        });
      } else if (loginUrlResult.code !== 200) {
        notification.open({
          message: '获取登录地址请求失败',
          description: loginUrlResult.msg,
        });
      } else {
        yield put({
          type: 'saveState',
          payload: {
            loginMode: loginUrlResult.msg,
            loginUrl: loginUrlResult.data,
          },
        });
      }
    },

    /**
     * 查询当前登录的人（权限认证使用）
     * @param {*} _
     * @param {*} param1
     */
    *fetchCurrentUser(_, { call, put }) {
      const userResponse = yield call(queryCurrentUser);
      if (userResponse && userResponse.code === 200) {
        yield put({
          type: 'saveState',
          payload: {
            currentUser: userResponse.data,
          },
        });
        return userResponse.data;
      }
      return {};
    },

    /**
     * 获取当前登录的用户
     * @param {*} _
     * @param {*} param1
     */
    *getCurrentUser(_, { call, put }) {
      const userResponse = yield call(queryCurrentUser);
      if (userResponse && userResponse.code === 200) {
        yield put({
          type: 'saveState',
          payload: {
            user: userResponse.data,
          },
        });
        return userResponse.data;
      }
      return {};
    },

    /**
     * 退出登录
     * @param {*} param0
     * @param {*} param1
     */
    *fetchLogout(_, { call }) {
      const logoutUrlResult = yield call(queryLogoutUrl);
      let logoutUrl = null;
      const isMenuIntegrationFlag = isMenuIntegration();
      try {
        if (logoutUrlResult && logoutUrlResult.code === 200) {
          const loginMode = logoutUrlResult.msg;
          logoutUrl = logoutUrlResult.data;
          if (loginMode === 'cas') {
            // cas 模式退出，跨域调用前端退出
            const script = document.createElement('script');
            script.setAttribute('src', logoutUrl);
            document.getElementsByTagName('head')[0].appendChild(script);
          } else if (loginMode === 'AuthorizationCode') {
            // oauth 授权码模式退出，跨域调用前端退出
            if (logoutUrl) {
              const script = document.createElement('script');
              script.setAttribute('src', logoutUrl);
              document.getElementsByTagName('head')[0].appendChild(script);
            }
          }
          // 清diToken
          const diToken = getSessionCache('diToken');
          if (diToken) {
            yield call(doDiLogout);
          }
        }
      } finally {
        yield clearSessionCache();
        if (isMenuIntegrationFlag && logoutUrl !== null) {
          window.top.location.href = logoutUrl;
        } else {
          window.top.location.href = window.location.origin + homepage;
        }
      }
    },

    /**
     * Oauth用户名密码模式登录，获取diToken
     * @param {*} param0
     * @param {*} param1
     */
    *fetchLoginPassword({ payload }, { call, put }) {
      const { values } = payload;
      const { username, password, code, home, productId, productCode } = values;
      const loginResponse = yield call(doOauthLoginPassword, username, password);
      const close = () => {
        router.push(homepage);
      };
      if (!loginResponse) {
        notification.open({
          message: '登录失败',
          description: 'DI服务请求失败，请检查服务是否启动！',
          onClose: close,
        });
      } else if (loginResponse.code !== 200) {
        yield put({
          type: 'saveState',
          payload: {
            loginResult: '用户名或密码错误',
          },
        });
      } else {
        yield addSessionCache('diToken', loginResponse.msg);
        yield put({
          type: 'saveState',
          payload: {
            diToken: loginResponse.msg,
            // currentUser: loginResponse.data,
            loginResult: '',
          },
        });
        if (code) {
          window.top.location.href = window.location.origin + '/api/api_details?code=' + code;
        } else if(home) {
          window.top.location.href = `${window.location.origin}${home}`;
          addSessionCache('productId', productId);
          addSessionCache('productCode', productCode);
        } else {
          const userProductList = yield call(queryProductList);
          let loginSuccessPage;
          if (userProductList.length === 1) {
            const productId = userProductList[0].id;
            const productCode = userProductList[0].code;
            const { homeUri } = userProductList[0];
            addSessionCache('productId', productId);
            addSessionCache('productCode', productCode);
            const { homeIsFrame } = userProductList[0];
            if (homeIsFrame === HOME_URI_IS_FRAME_TRUE) {
              loginSuccessPage = '/console/framepage/' + productId + '/' + homeUri;
            } else {
              loginSuccessPage = '/' + homeUri;
            }
          } else {
            loginSuccessPage = '/home';
          }
          window.top.location.href = `${window.location.origin}${loginSuccessPage}`;
        }
      }
    },

    /**
     * 查询当前accessToken
     * @param {*} _
     * @param {*} param1
     */
    *fetchAccessToken(_, { call, put }) {
      const accessTokenResponse = yield call(queryAccessToken);
      if (accessTokenResponse) {
        yield put({
          type: 'saveState',
          payload: {
            accessTokenResponse,
          },
        });
      }
    },

    /**
     * 校验diToken是否有效
     * @param {*} param0
     * @param {*} param1
     */
    *checkDiToken({ payload }, { call }) {
      const { pathname } = payload;
      const accessTokenResponse = yield call(queryAccessToken);
      if (accessTokenResponse && accessTokenResponse.code !== 200) {
        if (pathname !== homepage) {
          window.top.location.href = homepage;
        }
      }
    },

    /**
     * 获取用户权限
     * @param {*} _
     * @param {*} call
     */
    *getUserAuthorization(_, { call }) {
      const response = yield call(getUserAuthorization);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 菜单式集成认证登录
     * @param {*} _
     * @param {*} call
     */
    *menuEntryAuthorization(_, { call, put }) {
      const userResponse = yield call(menuEntryAuthorization);
      if (userResponse && userResponse.code === 200) {
        yield put({
          type: 'saveState',
          payload: {
            user: userResponse.data,
          },
        });
        return userResponse.data;
      }
      if (userResponse == null) {
        DiResponse.error('认证失败，认证接口返回的用户信息为空，请联系第三方认证接口提供商');
        return null;
      }
      if (userResponse.code !== 200) {
        DiResponse.error(userResponse.msg);
      }
      return null;
    },
  },

  reducers: {
    saveState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },

  subscriptions: {
    // 校验token
    checkAccessToken({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (
          pathname.indexOf('/exception') === 0 ||
          pathname.indexOf('/authorization') === 0 ||
          pathname.indexOf('/menuEntry') === 0
        ) {
          return;
        }
        dispatch({
          type: 'checkDiToken',
          payload: {
            pathname,
          },
        });
      });
    },
  },
};
