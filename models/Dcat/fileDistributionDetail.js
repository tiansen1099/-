import { message } from 'antd';
import {
  saveDistributionMetadata,
  getFileDistributionDetail,
  updateDistributionstasDownloadCount,
  updateDistributionstasAccessCount,
} from '@/services/Dcat/distribution';

export default {
  namespace: 'fileDistributionDetail',

  state: {
    fileInfoDetail: null,
  },

  effects: {
    /**
     * 发布文件资源
     */
    *saveFileDistribution(action, { call }) {
      const { distributionDto } = action.payload;
      const response = yield call(saveDistributionMetadata, distributionDto);
      if (response.code === 200) {
        message.success('文件发布成功！请等待审核！');
      } else {
        message.warning('文件发布失败！' + response.msg);
      }
      return response;
    },

    *getFileDetailByCode(action, { put, call }) {
      const { fileCode } = action.payload;
      const response = yield call(getFileDistributionDetail, fileCode);
      yield put({
        type: 'setState',
        payload: {
          fileInfoDetail: response,
        },
      });
      return response;
    },

    *updateDistributionFileDownloadCount(action, { select, put, call }) {
      const { fileInfoDetail } = yield select(state => state.fileDistributionDetail);
      yield call(updateDistributionstasDownloadCount, action.payload.code);
      fileInfoDetail.downloadCount += 1;
      yield put({
        type: 'setState',
        payload: {
          fileInfoDetail: {
            ...fileInfoDetail,
          },
        },
      });
    },
    *updateDistributionstasAccessCount(action, { select, put, call }) {
      const { fileInfoDetail } = yield select(state => state.fileDistributionDetail);
      yield call(updateDistributionstasAccessCount, action.payload.code);
      fileInfoDetail.accessCount += 1;
      yield put({
        type: 'setState',
        payload: {
          fileInfoDetail: {
            ...fileInfoDetail,
          },
        },
      });
    },
  },

  reducers: {
    setState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
