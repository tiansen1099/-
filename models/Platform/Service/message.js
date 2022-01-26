import {
  queryUnReadMessageCount,
  reloadUnReadMessageCount,
  queryMessageCount,
  markMessageToRead,
  delMessage,
  getPagingMessageByStatus,
  markAllMessageToRead,
  deleteAllMessageByReceivedBy,
  batchMarkMessageToRead,
  batchDelMessage,
} from '@/services/Platform/Service/message';

export default {
  namespace: 'message',

  state: {
    unReadMessageCountResult: {},
    messageCountResult: {},

    unReadMessageResult: {},
    readMessageResult: {},
    // reloadUnReadMsgResult: {},
    markMessageToReadResult: {},
    delMessageResult: {},
    markAllMessageToReadResult: {},
    deleteAllMessageByReceivedByResult: {},
    batchMarkToReadResult: {},
    batchDelMessageResult: {},
  },

  effects: {
    /**
     * 查询未读消息个数-redis中查询
     * @param {*} _
     * @param {*} param1
     */
    *queryUnReadMessageCount(_, { call, put }) {
      const unReadMessageCountResult = yield call(queryUnReadMessageCount);
      yield put({
        type: 'saveState',
        payload: {
          unReadMessageCountResult,
        },
      });
      return unReadMessageCountResult;
    },

    /**
     * 刷新未读消息缓存-重置redis中数量
     * @param {*} _
     * @param {*} param1
     */
    *reloadUnReadMessageCount(_, { call, put }) {
      const reloadUnReadMsgResult = yield call(reloadUnReadMessageCount);
      yield put({
        type: 'saveState',
        payload: {
          unReadMessageCountResult: reloadUnReadMsgResult,
        },
      });
      return reloadUnReadMsgResult;
    },

    /**
     * 查询消息个数
     * @param {*} _
     * @param {*} param1
     */
    *queryMessageCount(_, { call, put }) {
      const messageCountResult = yield call(queryMessageCount);
      yield put({
        type: 'saveState',
        payload: { messageCountResult },
      });
      return messageCountResult;
    },

    /**
     * 将消息标记为已读
     * @param {*} param0
     * @param {*} param1
     */
    *markMessageToRead({ payload }, { call, put }) {
      const { messageId } = payload;
      const markMessageToReadResult = yield call(markMessageToRead, messageId);
      yield put({
        type: 'saveState',
        payload: { markMessageToReadResult },
      });
      return markMessageToReadResult;
    },

    /**
     * 删除消息
     * @param {*} param0
     * @param {*} param1
     */
    *delMessage({ payload }, { call, put }) {
      const { messageId } = payload;
      const delMessageResult = yield call(delMessage, messageId);
      yield put({
        type: 'saveState',
        payload: { delMessageResult },
      });
      return delMessageResult;
    },

    /**
     * 分页查询未读消息列表
     * @param {*} param0
     * @param {*} param1
     */
    *queryPagingUnReadMessageList({ payload }, { call, put }) {
      const { currentPage, pageSize, orderCol, orderDir, searchColumn, searchValue } = payload;
      const unReadStatus = '1';
      const unReadMessageResult = yield call(
        getPagingMessageByStatus,
        unReadStatus,
        currentPage,
        pageSize,
        orderCol,
        orderDir,
        searchColumn,
        searchValue
      );
      yield put({
        type: 'saveState',
        payload: { unReadMessageResult },
      });
      return unReadMessageResult;
    },

    /**
     * 分页查询已读消息列表
     * @param {*} param0
     * @param {*} param1
     */
    *queryPagingReadMessageList({ payload }, { call, put }) {
      const { currentPage, pageSize, orderCol, orderDir, searchColumn, searchValue } = payload;
      const readStatus = '2';
      const readMessageResult = yield call(
        getPagingMessageByStatus,
        readStatus,
        currentPage,
        pageSize,
        orderCol,
        orderDir,
        searchColumn,
        searchValue
      );
      yield put({
        type: 'saveState',
        payload: { readMessageResult },
      });
      return readMessageResult;
    },

    /**
     * 将所有未读消息标记为已读
     * @param {*} _
     * @param {*} param1
     */
    *markAllMessageToRead(_, { call, put }) {
      const markAllMessageToReadResult = yield call(markAllMessageToRead);
      yield put({
        type: 'saveState',
        payload: { markAllMessageToReadResult },
      });
      return markAllMessageToReadResult;
    },

    /**
     * 清空所有已读消息
     * @param {*} _
     * @param {*} param1
     */
    *deleteAllMessageByReceivedBy(_, { call, put }) {
      const deleteAllMessageByReceivedByResult = yield call(deleteAllMessageByReceivedBy);
      yield put({
        type: 'saveState',
        payload: { deleteAllMessageByReceivedByResult },
      });
      return deleteAllMessageByReceivedByResult;
    },

    /**
     * 批量设置消息为已读
     * @param {*} param0
     * @param {*} param1
     */
    *batchMarkMessageToRead({ payload }, { call, put }) {
      const { messageIds } = payload;
      const batchMarkToReadResult = yield call(batchMarkMessageToRead, messageIds);
      yield put({
        type: 'saveState',
        payload: { batchMarkToReadResult },
      });
      return batchMarkToReadResult;
    },

    /**
     * 批量删除消息
     * @param {*} param0
     * @param {*} param1
     */
    *batchDelMessage({ payload }, { call, put }) {
      const { messageIds } = payload;
      const batchDelMessageResult = yield call(batchDelMessage, messageIds);
      yield put({
        type: 'saveState',
        payload: { batchDelMessageResult },
      });
      return batchDelMessageResult;
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
