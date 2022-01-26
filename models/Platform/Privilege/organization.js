import {
  getOrganization,
  getOrganizationDetail,
  saveOrUpdateOrganization,
  deleteOrganizationById,
  getOrganizationSystemList,
  getAllOrganizationList,
  getOrganizationRegionList,
  getOrganizationRegionListById,
  getOrganizationByCode,
} from '@/services/Platform/Privilege/organization';
import { message } from 'antd';

export default {
  namespace: 'organization',

  state: {
    organizationList: [],
    organizationDetail: '',
    systemList: [],
    allOrganizationList: [],
    regionList: [],
  },

  effects: {
    /**
     * 获取组织结构树
     */
    *getAllOrganization(_, { call, put }) {
      const organizationResponse = yield call(getOrganization);
      if (organizationResponse.code !== 200) {
        message.warning('读取组织树信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            organizationList: organizationResponse.data,
          },
        });
        return organizationResponse.data;
      }
      return null;
    },

    /**
     * 获取机构信息列表
     */
    *getAllOrganizationList(_, { call, put }) {
      const response = yield call(getAllOrganizationList);
      if (response.code !== 200) {
        message.warning('读取组织列表信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            allOrganizationList: response.data,
          },
        });
      }
    },

    /**
     * 获取节点详情
     * @param {*} param0
     * @param {*} param1
     */
    *getOrganizationDetail({ payload }, { call, put }) {
      const { keyValue } = payload;
      const organizationResponse = yield call(getOrganizationDetail, keyValue);
      if (organizationResponse.code !== 200) {
        message.warning('读取节点信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            organizationDetail: organizationResponse.data,
          },
        });
      }
    },

    /**
     * 删除树节点
     */
    *deleteOrganizationById({ payload }, { call, put }) {
      const { selectNodekey } = payload;
      const response = yield call(deleteOrganizationById, selectNodekey);
      if (response && response.code === 200) {
        message.success('删除成功！');
        // 重新获取树
        const organizationResponse = yield call(getOrganization);
        yield put({
          type: 'saveState',
          payload: { organizationList: organizationResponse.data },
        });
        return response.code;
      }
      message.warning(response.msg);
      return response.code;
    },

    /**
     * 保存或更新组织信息
     */
    *saveOrUpdateOrganization({ payload }, { call, put }) {
      const { organization } = payload;
      const response = yield call(saveOrUpdateOrganization, organization);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { saveOrganizationResult: response.code },
        });
        message.success('信息保存成功！');
        // 更新组织树menu
        const organizationResponse = yield call(getOrganization);
        yield put({
          type: 'saveState',
          payload: { organizationList: organizationResponse.data },
        });
      } else {
        message.warning('菜单信息保存失败！');
      }
      return response;
    },

    /**
     * 获取节点详情
     * @param {*} param0
     * @param {*} param1
     */
    *getOrganizationSystemList({ payload }, { call, put }) {
      const { organizationId } = payload;
      const response = yield call(getOrganizationSystemList, organizationId);
      if (response.code !== 200) {
        message.warning('查询机构系统信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            systemList: response.data,
          },
        });
      }
      return response.data;
    },
    /**
     * 根据id获取行政机构信息
     * @param {*} param0
     * @param {*} param1
     */
    *getOrganizationRegionListById({ payload }, { call }) {
      const { id } = payload;
      const response = yield call(getOrganizationRegionListById, id);
      return response;
    },

    /**
     * 获取行政区信息
     * @param {*} param0
     * @param {*} param1
     */
    *getOrganizationRegionList({ payload }, { call, put }) {
      const { parentId } = payload;
      const response = yield call(getOrganizationRegionList, parentId);
      if (response.code !== 200) {
        message.warning('查询机构行政区信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            regionList: response.data,
          },
        });
      }
      return response.data;
    },

    *getOrganizationByCode({ payload }, { call }) {
      const { code } = payload.organization;
      const response = yield call(getOrganizationByCode, code);
      return response;
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
