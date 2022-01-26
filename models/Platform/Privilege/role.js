import {
  getRole,
  getOperatePrivilege,
  getDataPrivilege,
  getOperatePrivilegeIdsByRoleId,
  getDataPrivilegeIdsByRoleId,
  saveOrUpdatePrivilege,
  saveOrUpdateRole,
  deleteRoleById,
  getRolesByAccount,
} from '@/services/Platform/Privilege/role';
import { message } from 'antd';

const treedata = [
  {
    name: '系统',
    id: '-1',
    code: '',
    description: '',
    type: '1',
    createdBy: '',
    createdTime: '',
    modifiedBy: '',
    modifiedTime: '',
    isValid: '0',
    children: [],
  },
  {
    name: '自定义',
    id: '-2',
    code: '',
    description: '',
    type: '3',
    createdBy: '',
    createdTime: '',
    modifiedBy: '',
    modifiedTime: '',
    isValid: '0',
    children: [],
  },
];

export default {
  namespace: 'role',

  state: {
    roleList: [],
    roleTreeList: [],
    operatePrivilegeList: [],
    dataPrivilegeList: [],
    roleOperationList: [],
    roleDataPriviledgeList: [],
    roleDetail: '',
  },

  effects: {
    /**
     * 获取角色结构树
     */
    *getAllRole(_, { call, put }) {
      const roleResponse = yield call(getRole);
      if (roleResponse.code !== 200) {
        message.warning('读取组织树信息失败！');
      } else {
        const { data } = roleResponse;
        treedata[0].children = [];
        treedata[1].children = [];
        for (let i = 0; i < data.length; i += 1) {
          const node = data[i];
          if (node.type === '1') {
            treedata[0].children.push(node);
          }
          if (node.type === '2') {
            treedata[1].children.push(node);
          }
        }

        yield put({
          type: 'saveState',
          payload: {
            roleList: roleResponse.data,
            roleTreeList: treedata,
          },
        });
        return roleResponse.data;
      }
      return null;
    },

    /**
     * 获取角色操作权限菜单
     * @param {*} param0
     * @param {*} param1
     */
    *getOperatePrivilege(_, { call, put }) {
      const roleResponse = yield call(getOperatePrivilege);
      if (roleResponse.code !== 200) {
        message.warning('读取节点信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            operatePrivilegeList: roleResponse.data,
          },
        });
      }
    },

    /**
     * 获取角色数据权限菜单
     * @param {*} param0
     * @param {*} param1
     */
    *getDataPrivilege(_, { call, put }) {
      const roleResponse = yield call(getDataPrivilege);
      if (roleResponse.code !== 200) {
        message.warning('读取节点信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            dataPrivilegeList: roleResponse.data,
          },
        });
      }
    },

    /**
     * 获取某个角色操作权限
     * @param {*} param0
     * @param {*} param1
     */
    *getRoleOperationPrivilege({ payload }, { call, put }) {
      const { roleId } = payload;
      const roleResponse = yield call(getOperatePrivilegeIdsByRoleId, roleId);
      if (roleResponse.code !== 200) {
        message.warning('获取角色操作权限信息失败！', roleResponse.message);
      } else {
        yield put({
          type: 'saveState',
          payload: {
            roleOperationList: roleResponse.data,
          },
        });
      }
    },

    /**
     * 获取某个角色数据权限
     * @param {*} param0
     * @param {*} param1
     */
    *getRoleDataPrivilege({ payload }, { call, put }) {
      const { roleId } = payload;
      const roleResponse = yield call(getDataPrivilegeIdsByRoleId, roleId);
      if (roleResponse.code !== 200) {
        message.warning('获取角色数据权限信息失败！', roleResponse.message);
      } else {
        yield put({
          type: 'saveState',
          payload: {
            roleDataPriviledgeList: roleResponse.data,
          },
        });
      }
    },

    /**
     * 保存某个角色权限
     * @param {*} param0
     * @param {*} param1
     */
    *saveOrUpdatePrivilege({ payload }, { call }) {
      const { roleId, privilegeList } = payload;
      const roleResponse = yield call(saveOrUpdatePrivilege, roleId, privilegeList);
      if (roleResponse.code !== 200) {
        message.warning('保存操作权限信息失败！');
      }
      return roleResponse;
    },

    /**
     * 删除树节点
     */
    *deleteRoleById({ payload }, { call }) {
      const { selectNodekey } = payload;
      return yield call(deleteRoleById, selectNodekey);
    },

    /**
     * 保存或更新组织信息
     */
    *saveOrUpdateRole({ payload }, { call }) {
      const { role } = payload;
      const response = yield call(saveOrUpdateRole, role);
      return response;
    },

    /**
     * 根据账号获取用户角色
     */
    *getRolesByAccount({ payload }, { call }) {
      const { account } = payload;
      const response = yield call(getRolesByAccount, account);
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
