import {
  distSearch,
  getFileDistTotalInfo,
  updateDistributionstasDownloadCount,
  updateDistributionstasAccessCount,
} from '@/services/Dcat/distribution';
import { getCatalogsStatistic, getCatalogTree } from '@/services/Dcat/catalog';
import { getSessionCache } from '@/utils/Platform/platformUtil';
import { urlPreContext } from '@/defaultSettings';

export default {
  namespace: 'fileDistribution',
  state: {
    netdiskId: '151528d4b581404c990b87dcf628eafb',
    catalogData: null,
    selectedCatalog: null,
    fielOutputStream: null,
    tableResult: {
      data: [],
      total: 0,
    },
    searchState: {
      loading: false,
      searchValue: '',
      start: 0,
      length: 12,
    },
    statistic: {
      fileTotal: 0,
      filePublish: 0,
      fileApprovaling: 0,
      catalogTotal: 0,
      catalogLevel1: 0,
      catalogLevel2: 0,
    },
    preview: {
      previewName: '',
      previewStatus: 'none',
      previewUrl: null,
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
  effects: {
    *getStatistic(_, { select, put, call }) {
      const { statistic } = yield select(state => state.fileDistribution);
      const fileStatistic = yield call(getFileDistTotalInfo);
      const catalogStatistic = yield call(getCatalogsStatistic);
      if (fileStatistic !== undefined && catalogStatistic !== undefined) {
        yield put({
          type: 'setState',
          payload: {
            statistic: {
              ...statistic,
              fileTotal: fileStatistic.fileDistNum,
              filePublish: fileStatistic.publishFileDistNum,
              fileApprovaling: fileStatistic.reviewingFileDistNum,
              catalogLevel1: catalogStatistic.level1,
              catalogLevel2: catalogStatistic.level2,
              catalogLevel3: catalogStatistic.level3,
            },
          },
        });
      }
    },
    *getCatalogTree({ payload }, { put, call }) {
      const { type } = payload;
      const catalogData = yield call(getCatalogTree, type);
      yield put({
        type: 'setState',
        payload: {
          catalogData,
        },
      });
    },
    /**
     * 查询文件资源列表
     * @param {*} action
     * @param {*} param1
     */
    *getFileDistributionList(action, { select, put, call }) {
      let searchState = yield select(state => state.fileDistribution.searchState);
      const { data } = yield select(state => state.fileDistribution.tableResult);
      const catalogData = yield call(getCatalogTree, 'FILE');
      const { selectedCatalog } = yield select(state => state.fileDistribution);
      yield put({
        type: 'setState',
        payload: {
          searchState: {
            ...searchState,
            ...action.payload,
            loading: true,
          },
        },
      });
      searchState = yield select(state => state.fileDistribution.searchState);
      const { start, length, searchValue } = searchState;
      const conditions = [];
      conditions.push({
        colName: 'status',
        operator: 'eq',
        colValue: 'APPROVE',
      });
      conditions.push({
        colName: 'type',
        operator: 'eq',
        colValue: 'FILE',
      });
      const allResult = yield call(distSearch, start, length, conditions);

      if (selectedCatalog !== null) {
        if (selectedCatalog[0] !== null && selectedCatalog[1] !== null) {
          let colValue = selectedCatalog[1].id;
          if (selectedCatalog[2] !== null) {
            colValue = selectedCatalog[2].id;
          }
          const catalogIdCondition = {
            colName: 'catalogId',
            operator: 'eq',
            colValue,
          };
          conditions.push(catalogIdCondition);
        }
      }
      if (searchValue !== '') {
        const nameCondition = {
          colName: 'name',
          operator: 'like',
          colValue: searchValue,
        };
        conditions.push(nameCondition);
      }
      // 业务分类和业务名称信息
      if (searchState.businessCategory !== null && searchState.businessCategory !== undefined) {
        const businessCategoryCondition = {
          colName: 'businessCategory',
          operator: 'eq',
          colValue: searchState.businessCategory,
        };
        conditions.push(businessCategoryCondition);
      }

      if (searchState.businessName !== null && searchState.businessName !== undefined) {
        const businessNameCondition = {
          colName: 'businessName',
          operator: 'eq',
          colValue: searchState.businessName,
        };
        conditions.push(businessNameCondition);
      }
      const result = yield call(distSearch, start, length, conditions);
      const resultData = result.data === null ? [] : result.data;
      let putResult;
      const total = result.iTotalRecords;
      if (start === 0) {
        putResult = resultData;
      } else {
        putResult = data.concat(resultData);
      }
      // 添加目录文档数
      const catalogArray =
        allResult.aggsData === null ? [] : allResult.aggsData.aggs_catalogPath.buckets;
      const fillCountNum = catalogTree => {
        catalogTree.map(item => {
          const catalog = item;
          const countCatalog = catalogArray.find(value => value.key === item.id);
          catalog.count = countCatalog ? countCatalog.doc_count : 0;
          if (catalog.children !== null && catalog.children !== undefined) {
            fillCountNum(catalog.children);
          }
          return item;
        });
      };
      fillCountNum(catalogData);
      yield put({
        type: 'setState',
        payload: {
          catalogData,
          searchState: {
            ...searchState,
            start: start + length,
            loading: false,
          },
          tableResult: {
            total,
            data: putResult,
          },
        },
      });
    },
    *updateDistributionstasDownloadCount(action, { select, put, call }) {
      yield call(updateDistributionstasDownloadCount, action.payload.code);
      const { index } = action.payload;
      if (index !== undefined) {
        const { data } = yield select(state => state.fileDistribution.tableResult);
        data[index].downloadCount += 1;
        yield put({
          type: 'setState',
          payload: {
            tableResult: {
              data,
            },
          },
        });
      }
    },
    *setPreviewUrl(action, { put }) {
      const diToken = getSessionCache('diToken');
      const browserUrl = `${window.location.protocol}//${window.location.host}${urlPreContext}`;
      const { fileName } = action.payload;
      const previewStatus = 'block';
      const previewUrl =
        `${browserUrl}/pdfjs/web/viewer.html?file=` +
        encodeURIComponent(
          `${browserUrl}/di/service/file/preview?diToken=${diToken}&fileId=${action.payload.fileId}`
        );
      yield put({
        type: 'setState',
        payload: {
          preview: {
            previewName: fileName,
            previewStatus,
            previewUrl,
          },
        },
      });
    },
    *updateDistributionstasAccessCount(action, { select, put, call }) {
      yield call(updateDistributionstasAccessCount, action.payload.code);
      const { index } = action.payload;
      if (index !== undefined) {
        const { data } = yield select(state => state.fileDistribution.tableResult);
        data[index].accessCount += 1;
        yield put({
          type: 'setState',
          payload: {
            tableResult: {
              data,
            },
          },
        });
      }
    },

    *clearSearchState(action, { put }) {
      yield put({
        type: 'setState',
        payload: {
          searchState: action.payload,
        },
      });
    },
  },
};
