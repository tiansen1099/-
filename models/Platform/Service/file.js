import { message } from 'antd';
import {
  download,
  deleteFile,
  batchDeleteFile,
  querypdf,
  convertPdf,
} from '@/services/Platform/Service/file';

export default {
  namespace: 'file',

  state: {
    deleteFileResult: {},
  },

  effects: {
    /**
     * 删除文件
     * @param fileId
     */
    *deleteFile({ payload }, { call, put }) {
      const { fileId } = payload;
      const response = yield call(deleteFile, fileId);
      if (response && response.code === 200) {
        yield put({
          type: 'saveState',
          payload: { deleteFileResult: response },
        });
        message.success('文件删除成功！');
      } else {
        message.warning('文件删除失败！');
      }
    },

    /**
     * 批量删除文件
     * @param {*} param0
     * @param {*} param1
     */
    *batchDeleteFile({ payload }, { call }) {
      const { fileIds } = payload;
      const response = yield call(batchDeleteFile, fileIds);
      return response;
    },

    /**
     * 文件转换
     * @param {文件ID} fileId
     * @param {文件格式后缀} formate
     */
    *converFileToPdf(action, { call }) {
      const response = yield call(convertPdf, action.payload.fileId);
      return response;
    },

    /**
     * 下载文件
     * @param {文件ID} fileId
     */
    *download(action, { call }) {
      return yield call(download, action.payload.fileId);
    },

    /**
     * 查询文件是否存在PDF
     * @param {文件ID} fileId
     */
    *querypdf(action, { call }) {
      return yield call(querypdf, action.payload.fileId);
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
