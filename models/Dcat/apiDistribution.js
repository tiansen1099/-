import {
  distSearch,
  getAPITotalInfo,
  undoSubscription,
  checkPublish,
} from '@/services/Dcat/distribution';
import { getCatalogTree } from '@/services/Dcat/catalog';
import DiResponse from '@/components/DiResponse';

export default {
  namespace: 'apiDistribution',
  state: {
    catalogData: null,
    selectedCatalog: null,
    tableResult: {
      data: [],
      total: 0,
    },
    searchState: {
      loading: false,
      type: 'API',
      searchValue: '',
      start: 0,
      length: 8,
      businessCategory: null,
      businessName: null,
      tabType: 'all', // all;mySubscription;myPublish
    },
    statistic: {
      apiDistNum: 0,
      reviewingApiDistNum: 0,
      apiPubDistNum: 0,
      reviewingPubApiDistNum: 0,
      apiSubDistNum: 0,
      reviewingSubApiDistNum: 0,
    },
  },
  effects: {
    /**
     * 查询数据
     * @param {*} action
     * @param {*} param1
     */
    *getDistributions(action, { select, call, put }) {
      let searchState = yield select(state => state.apiDistribution.searchState);
      const { data } = yield select(state => state.apiDistribution.tableResult);
      const catalogData = yield call(getCatalogTree, 'API');
      const { selectedCatalog } = yield select(state => state.apiDistribution);
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
      searchState = yield select(state => state.apiDistribution.searchState);
      // const { start, length, searchValue } = searchState;
      const { start, searchValue } = searchState;
      let { length } = searchState;
      length = window.innerHeight > 1000 ? length * 2 : length;
      //  设置查询条件
      const conditions = [];
      // 类型过滤
      const apiCondition = {
        colName: 'type',
        operator: 'eq',
        colValue: 'API',
      };
      conditions.push(apiCondition);
      const allResult = yield call(distSearch, start, length, conditions);
      if (searchValue !== '') {
        const nameCondition = {
          colName: 'name',
          operator: 'like',
          colValue: searchValue,
        };
        conditions.push(nameCondition);
      }

      // 目录信息
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

      // 全部、我的订阅、我的发布信息
      if (searchState.tabType === 'MYSUBSCRIBE' || searchState.tabType === 'MYPUBLISH') {
        const tabTypeCondition = {
          colName: searchState.tabType,
          operator: 'eq',
          colValue: true,
        };
        conditions.push(tabTypeCondition);
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

      // 添加目录资源数
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
          searchState: {
            ...searchState,
            start: start + length,
            loading: false,
          },
          tableResult: {
            total,
            data: putResult,
          },
          catalogData,
        },
      });
    },

    /**
     * 获取统计数据
     */
    *getStatistic(_, { call, put }) {
      const data = yield call(getAPITotalInfo);
      if (data !== undefined) {
        yield put({
          type: 'setState',
          payload: {
            statistic: data,
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
     * 取消订阅
     * @param {*} action
     * @param {*} param1
     */
    *undoSubscription(action, { select, call, put }) {
      const { data } = yield select(state => state.apiDistribution.tableResult);
      let { total } = yield select(state => state.apiDistribution.tableResult);
      const { subscribeTabType, tabType } = yield select(
        state => state.apiDistribution.searchState
      );
      const { item } = action.payload;
      const ids = [item.subscribeId];
      const response = yield call(undoSubscription, ids);
      if (!response || response.code !== 200) {
        return response;
      }
      const position = data.findIndex(index => index.id === item.id);
      if (tabType === 'sub' && subscribeTabType === 'SUBSCRIBED') {
        data.splice(position, 1);
        total -= 1;
      } else {
        item.subscribeStatus = 'UNSUBSCRIBED';
        item.subscribeNum -= 1;
        data.splice(position, 1, item);
      }
      yield put({
        type: 'setState',
        payload: {
          tableResult: {
            data,
            total,
          },
        },
      });
      return response;
    },

    *clearSearchState(action, { put }) {
      yield put({
        type: 'setState',
        payload: {
          searchState: action.payload,
        },
      });
    },

    /**
     * @description: 校验是否可以发布
     * @param {*}
     * @return {*}
     */
    *checkPublish({ payload }, { call }) {
      const response = yield call(checkPublish, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
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
