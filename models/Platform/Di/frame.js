import { message } from 'antd';
import { getProductId, getMenuUri, getSessionCache } from '@/utils/Platform/platformUtil';
import { queryProductById } from '@/services/Platform/Service/product';
import { queryMenuByProductIdAndMenuUri } from '@/services/Platform/Service/menu';
import { urlPreContext } from '@/defaultSettings';

export default {
  namespace: 'frame',

  state: {
    currentMenu: {},
    framePath: '',
    allBreadcrumbList: [],
    diBreadcrumbList: [],
    productBreadcrumbList: [],
    frameLoading: true,
  },

  effects: {
    *initFramepage({ payload }, { call, put }) {
      const { productId, menuUri, search } = payload;
      const currentProduct = yield call(queryProductById, productId);
      if (!currentProduct) {
        message.warning('加载当前服务信息失败，请检查参数是否正确！');
        return;
      }
      const diPath = window.location.origin;
      const { id, name } = currentProduct;
      const productCode = getSessionCache('productCode');
      const currentMenu = yield call(queryMenuByProductIdAndMenuUri, id, menuUri);
      if (currentMenu) {
        if (search) {
          if (search.indexOf('?frameurl=') >= 0) {
            currentMenu.menuLink = search.substr(10);
          }
        }
        if (currentMenu.menuLink && currentMenu.menuLink.indexOf('?') < 0) {
          currentMenu.menuLink =
            currentMenu.menuLink +
            '?diToken=' +
            getSessionCache('diToken') +
            '&diPath=' +
            diPath +
            urlPreContext +
            '&productId=' +
            productId +
            '&productCode=' +
            productCode +
            '&temp=' +
            Math.random();
        } else {
          currentMenu.menuLink =
            currentMenu.menuLink +'&'+search.substr(1)+
            '&diToken=' +
            getSessionCache('diToken') +
            '&diPath=' +
            diPath +
            urlPreContext +
            '&productId=' +
            productId +
            '&productCode=' +
            productCode +
            '&temp=' +
            Math.random();
        }
        if(search){
          currentMenu.menuLink=currentMenu.menuLink+'&'+search.substr(1);
        }
        yield put({
          type: 'saveState',
          payload: {
            currentMenu,
            framePath: currentMenu.menuLink,
          },
        });

        const diBreadcrumbData = [];
        if (name) {
          diBreadcrumbData.push({
            title: name,
          });
        }
        if (currentMenu.name) {
          diBreadcrumbData.push({
            title: currentMenu.name,
          });
        }
        yield put({
          type: 'saveState',
          payload: {
            diBreadcrumbList: diBreadcrumbData,
            allBreadcrumbList: diBreadcrumbData,
          },
        });
      }
    },

    *addProductBreadcrumb({ payload }, { put }) {
      const { breadcrumb, pathname } = payload;
      yield put({
        type: 'addBreadcrumbList',
        payload: { productBrList: breadcrumb, pathname },
      });
    },

    *clearProductBreadcrumb(_, { put }) {
      yield put({
        type: 'clearBreadcrumbList',
        payload: {},
      });
    },

    /**
     * 控制是否loading完成
     * @param {*} param0
     * @param {*} param1
     */
    *frameLoading({ payload }, { put }) {
      const { showLoading } = payload;
      yield put({
        type: 'saveState',
        payload: { frameLoading: showLoading },
      });
    },
  },

  reducers: {
    saveState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    addBreadcrumbList(state, action) {
      const diBrList = state.diBreadcrumbList;
      const { productBrList, pathname } = action.payload;
      if (diBrList && diBrList.length > 0 && productBrList && productBrList.length > 0) {
        diBrList[diBrList.length - 1].href = pathname;
      }
      let breadcrumbList = [];
      if (diBrList) {
        breadcrumbList = breadcrumbList.concat(diBrList);
      }
      const newProductBrList = [];
      if (productBrList) {
        productBrList.map(item => {
          const newItem = item;
          if (item.href && item.href !== '') {
            newItem.href = pathname + '?frameurl=' + item.href;
          }
          newProductBrList.push(newItem);
          return item;
        });
        breadcrumbList = breadcrumbList.concat(newProductBrList);
      }

      return {
        ...state,
        diBreadcrumbList: diBrList,
        productBreadcrumbList: newProductBrList,
        allBreadcrumbList: breadcrumbList,
      };
    },

    clearBreadcrumbList(state) {
      const diBrList = state.diBreadcrumbList;
      if (diBrList && diBrList.length > 0) {
        diBrList[diBrList.length - 1].href = '';
      }
      return {
        ...state,
        diBreadcrumbList: diBrList,
        productBreadcrumbList: [],
        allBreadcrumbList: diBrList,
      };
    },

    removeAllBreadcrumbList(state) {
      const diBrList = state.diBreadcrumbList;
      if (diBrList && diBrList.length > 0) {
        diBrList[diBrList.length - 1].href = '';
      }
      return {
        ...state,
        diBreadcrumbList: diBrList,
        productBreadcrumbList: [],
        allBreadcrumbList: [],
      };
    },
  },

  subscriptions: {
    updateFrameUrl({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname.includes('console/framepage/')) {
          const diToken = getSessionCache('diToken');
          if (!diToken) {
            window.location.href = '/home';
            return;
          }
          const productId = getProductId(pathname);
          const menuUri = getMenuUri(pathname);
          dispatch({
            type: 'initFramepage',
            payload: {
              productId,
              menuUri,
              search,
            },
          });
          dispatch({
            type: 'frameLoading',
            payload: {
              showLoading: true,
            },
          });
        }
      });
    },
  },
};
