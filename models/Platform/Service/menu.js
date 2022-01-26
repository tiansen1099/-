import { message } from 'antd';
import {
  queryBaseMenuDtosByProductCode,
  queryBaseMenuById,
  saveOrUpdateMenu,
} from '@/services/Platform/Service/menu';

export default {
  namespace: 'menu',

  state: {
    baseMenuDtos: [],
    baseMenu: {},
    saveMenuResult: {},
    userMenuRecords: [],
  },

  effects: {
    /**
     * 根据产品code获取产品的菜单信息
     * @param {*} param0
     * @param {*} param1
     */
    *queryBaseMenuDtosByProductCode({ payload }, { call, put }) {
      const { productCode } = payload;
      const response = yield call(queryBaseMenuDtosByProductCode, productCode);
      yield put({
        type: 'saveState',
        payload: { baseMenuDtos: response },
      });
    },

    /**
     * 根据主键查询BaseMenu
     * @param {*} param0
     * @param {*} param1
     */
    *queryBaseMenuById({ payload }, { call, put }) {
      const { baseMenuId } = payload;
      const baseMenuResponse = yield call(queryBaseMenuById, baseMenuId);
      yield put({
        type: 'saveState',
        payload: { baseMenu: baseMenuResponse },
      });
    },

    /**
     * 保存或更新菜单信息
     */
    *saveOrUpdateMenu({ payload }, { call, put }) {
      const { baseMenu } = payload;
      const { id } = baseMenu;
      const response = yield call(saveOrUpdateMenu, baseMenu);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { saveMenuResult: response },
        });
      } else {
        message.warning('菜单信息保存失败！');
      }
      // 更新服务menu
      const baseMenuResponse = yield call(queryBaseMenuById, id);
      yield put({
        type: 'saveState',
        payload: { baseMenu: baseMenuResponse },
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
  },
};
