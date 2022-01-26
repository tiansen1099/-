import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { message } from 'antd';
import { queryProductById } from '@/services/Platform/Service/product';
import { queryMenuDto } from '@/services/Platform/Service/menu';

// Conversion router to menu.
function formatter(data) {
  if (!data) {
    return undefined;
  }
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }
      const result = {
        ...item,
      };
      if (item.routes) {
        const children = formatter(item.routes);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = (menuData,privilegeList) => {
  if (!menuData) {
    return [];
  }
  console.log('filterMenuData-privilegeList',privilegeList)
  console.log('filterMenuData-menuData',menuData)
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => getSubMenu(item))
    .filter(item => item);
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};
  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'dimenu',

  state: {
    currentProduct: {},
    // 前端定义的menu信息
    menuData: [],
    // 产品menu信息
    productMenuData: [],
    routerData: [],
    breadcrumbNameMap: {},
    menuDataArr: [],
  },

  effects: {
    *initDiMenuData({ payload }, { put }) {
      const { routes, privilegeList } = payload;
      // console.log('privilegeList',privilegeList);
      const originalMenuData = memoizeOneFormatter(routes);
      const routeArr = [];
      originalMenuData.forEach(item=>{
        if(item.path !== undefined){
          routeArr.push(item.path);
        }
      });
      const privilegeArr = [];
      privilegeList.forEach(item=>{
        privilegeArr.push("/"+item.code)
      })
      const willRemove = []
      routeArr.forEach(str=>{
        if(!privilegeArr.includes(str)){
          willRemove.push(str)
        }
      })
      const finalOriginalMenuData = [];
      originalMenuData.forEach(item3=>{
        if(!willRemove.includes(item3.path)){
          finalOriginalMenuData.push(item3);
        }
      })
      const menuData = filterMenuData(finalOriginalMenuData , privilegeList);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(finalOriginalMenuData);
      yield put({
        type: 'saveState',
        payload: { menuData, breadcrumbNameMap, routerData: routes },
      });
    },

    // 初始化产品信息的菜单数据
    *initProductMenuData({ payload }, { call, put }) {
      const { productId } = payload;
      const curProduct = yield call(queryProductById, productId);
      if (curProduct) {
        // 设置title为管理中心
        yield put({
          type: 'saveState',
          payload: { currentProduct: curProduct },
        });
        const menuDtos = yield call(queryMenuDto, productId);
        if (!menuDtos) {
          message.warning('DI请求失败，请检查后台服务是否启动！');
        }
        const originalMenuData = memoizeOneFormatter(menuDtos);
        const productMenuData = filterMenuData(originalMenuData);
        const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
        yield put({
          type: 'saveState',
          payload: { productMenuData, breadcrumbNameMap },
        });
      } else {
        message.warning('加载服务菜单失败，请检查参数是否正确！');
      }
    },

    // 查询菜单信息
    *queryMenuData({ payload }, { call, put }) {
      const { productId } = payload;
      if (productId) {
        const menuDataArr = yield call(queryMenuDto, productId);
        yield put({
          type: 'saveState',
          payload: { menuDataArr },
        });
        return menuDataArr;
      }
      return [];
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
};
