import {
  getPagingUsers,
  saveOrUpdateUser,
  changeUserPassword,
  changeUserLocked,
  getUserByAccount,
  deleteUsers,
  resetPwd,
  getUserTreeData,
  getUserAccountNameList,
} from '@/services/Platform/Privilege/user';
import { message } from 'antd';

export default {
  namespace: 'user',

  state: {
    userList: [],
    userDTO: {},
    userTreeData: [],
    accountNameList: [],
  },

  effects: {
    /**
     * 获取分页用户信息
     */
    *getPagingUsers({ payload }, { call, put }) {
      const { currentPage, pageSize, orderCol, orderDir, searchValue, searchColumn } = payload;
      const response = yield call(
        getPagingUsers,
        currentPage,
        pageSize,
        orderCol,
        orderDir,
        searchValue,
        searchColumn
      );
      if (response.code !== 200) {
        message.warning('获取分页用户信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            userList: response.data.content,
          },
        });
        return response.data;
      }
      return null;
    },

    /**
     * 保存或更新用户信息
     */
    *saveOrUpdateUser({ payload }, { call, put }) {
      const { userToSave } = payload;
      const response = yield call(saveOrUpdateUser, userToSave);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { saveUserResult: response.code },
        });
        message.success('用户信息保存成功！');
      } else {
        message.warning(response.msg);
      }
      return response;
    },

    /**
     * 修改用户密码
     */
    *changeUserPassword({ payload }, { call }) {
      const { passwordInfo } = payload;
      const response = yield call(changeUserPassword, passwordInfo);
      return response;
    },

    /**
     * 启用/禁用用户
     */
    *changeUserLocked({ payload }, { call }) {
      const { account, unLocked } = payload;
      const response = yield call(changeUserLocked, account, unLocked);
      return response;
    },

    /**
     * 获取用户详细信息
     */
    *getUserByAccount({ payload }, { call, put }) {
      const { account } = payload;
      const response = yield call(getUserByAccount, account);
      if (response.code !== 200) {
        message.warning('获取用户信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            userDTO: response.data,
          },
        });
        return response.data;
      }
      return null;
    },

    /**
     * 删除用户
     */
    *deleteUsers({ payload }, { call, put }) {
      const { accounts } = payload;
      const response = yield call(deleteUsers, accounts);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { deleteUsersResult: response.data },
        });
        message.success('删除用户成功！');
        return response.code;
      }
      message.warning('删除用户失败！');
      return response.code;
    },

    /**
     * 重置用户密码
     */
    *resetPwd({ payload }, { call, put }) {
      const { account } = payload;
      const response = yield call(resetPwd, account);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { resetPwdResult: response.data },
        });
        message.success('重置用户密码为【Neusoft123+-*/】！');
        return response.code;
      }
      message.warning('重置用户密码失败！');
      return response.code;
    },

    /**
     * 获取机构-用户树模型数据
     * @param {*} _
     * @param {*} param1
     */
    *getUserTreeData(_, { call, put }) {
      const response = yield call(getUserTreeData);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { userTreeData: response.data },
        });
      }
      return response;
    },

    /**
     * 查询用户账号-名称map
     * @param {*} param0
     * @param {*} param1
     */
    *getUserAccountNameList({ payload }, { call, put }) {
      const { accounts } = payload;
      const response = yield call(getUserAccountNameList, accounts);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { accountNameList: response.data },
        });
        return response.data;
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
