import {
  tableSearch,
  getFileAggs,
  saveDistribution,
  deleteDistributions,
  getDistributionDetail,
  getOrgDataRuleRefByOrgId,
  changeToProcessing,
  getDistSubRelations,
  getRelationDistDetailDTO,
  existPublishedOrReviewingDistByAccount,
  existPublishedOrReviewingDistByOrg,
  getDistributionOuterPageQuery,
  saveDistributionOuter,
  deleteDistributionOuter,
  getDistributionOuter,
} from '@/services/Dcat/government';
import { message } from 'antd';

export default {
  namespace: 'dcatGovernment',

  state: {
    tableResult: {
      total: 0,
      data: [],
      iTotalRecords:0,
    },
    listDatanew:[],
    distribution: {},
    createUserOrgList: [], // 资源创建者所关联的机构列表
    orgDataRule: {},
    fileAggs: {},
    distributionDto: {},
    distSubRelations: {},
  },

  effects: {
    /**
     * 分页查询目录资源列表
     * @param {*} action
     * @param {*} param1
     */
    *getTableSearch(action, {select, call, put }) {
      const { data } = yield select(state => state.dcatGovernment.tableResult);
      const {payload} = action;
      const {currentPage} = payload;
      const response = yield call(tableSearch, action.payload);
      const listResult = response.data;
      const iTotalRecords = response.data.iTotalRecords;
      const tableResult = { total: listResult.iTotalDisplayRecords, data: listResult.listData, iTotalRecords:iTotalRecords};

      
      if(currentPage !== 0){
        tableResult.data = data.concat(listResult.listData)
      }

      yield put({
        type: 'setState',
        payload: {
          tableResult: {
            total:listResult.iTotalDisplayRecords,
            data: tableResult.data,
            iTotalRecords:iTotalRecords,
          },
          listDatanew:listResult.listData,
        },
      });
      return tableResult;
    },

    /**
     * 查询文件资源的统计数
     * @param {*} action
     * @param {*} param1
     */
    *getFileAggs(action, { call, put }) {
      const result = yield call(getFileAggs, action.payload);
      yield put({
        type: 'setState',
        payload: {
          fileAggs: result,
        },
      });
    },

    /**
     * 保存资源
     */
    *saveDistribution(action, { call }) {
      const { distributionDto } = action.payload;
      return yield call(saveDistribution, distributionDto);
    },

    /**
     * 删除资源
     */
    *deleteDistributions(action, { call }) {
      const { codes } = action.payload;
      // 接口是void类型，无返回
      return yield call(deleteDistributions, codes);
    },

    /**
     * 根据code查询资源信息
     */
    *getDistributionDtoByCode(action, { put, call }) {
      const { code } = action.payload;
      const distribution = yield call(getDistributionDetail, code);
      yield put({
        type: 'setState',
        payload: {
          distribution,
        },
      });
      return distribution;
    },

    *getOrgDataRuleRefByOrgId(action, { call, put }) {
      const { orgId } = action.payload;
      const orgDataRule = yield call(getOrgDataRuleRefByOrgId, orgId);
      yield put({
        type: 'setState',
        payload: {
          orgDataRule,
        },
      });
      return orgDataRule;
    },

    *changeToProcessing(action, { call, put }) {
      const { code } = action.payload;
      const changeResult = yield call(changeToProcessing, code);
      if (changeResult && changeResult.code === 200) {
        yield put({
          type: 'setState',
          payload: {
            distributionDto: changeResult.data,
          },
        });
      }
      return changeResult;
    },

    *getDistSubscriptionRelations(action, { call, put }) {
      const { code } = action.payload;
      const result = yield call(getDistSubRelations, code);
      if (result && result.code === 200) {
        yield put({
          type: 'setState',
          payload: {
            distSubRelations: result.data,
          },
        });
      }
      return result;
    },

    *getRelationDistDetailDTO(action, { call }) {
      const { distCode } = action.payload;
      return yield call(getRelationDistDetailDTO, distCode);
    },

    *existPublishedOrReviewingDistByAccount(action, { call }) {
      const { accounts } = action.payload;
      return yield call(existPublishedOrReviewingDistByAccount, accounts);
    },

    *existPublishedOrReviewingDistByOrg(action, { call }) {
      const { orgCode } = action.payload;
      return yield call(existPublishedOrReviewingDistByOrg, orgCode);
    },

    /**
     * 分页查询外部资源
     * @param {*} action
     * @param {*} param1
     * @returns {IterableIterator<*>}
     */
    *getDistributionOuterPageQuery(action, { call, put }) {
      const result = yield call(getDistributionOuterPageQuery, action.payload);
      if (result && result.code === 200) {
        const tableResult = { total: result.iTotalRecords, data: result.data.data };
        yield put({
          type: 'setState',
          payload: {
            tableResult,
          },
        });
        return tableResult;
      }
      message.warning('查询外部资源失败！错误信息：' + result.msg);
      return null;
    },

    /**
     * 保存外部资源
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *saveDistributionOuter(action, { call }) {
      const { distributionOuter } = action.payload;
      const result = yield call(saveDistributionOuter, distributionOuter);
      if (result && result.code === 200) {
        message.success('外部资源保存成功！');
      } else {
        message.warning('外部资源保存失败！错误信息：' + result.msg);
      }
    },

    /**
     * 删除外部资源
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *deleteDistributionOuter(action, { call }) {
      const { id } = action.payload;
      return yield call(deleteDistributionOuter, id);
    },

    /**
     * 根据ID获取外部资源
     * @param action
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getDistributionOuter(action, { call }) {
      const { id } = action.payload;
      const result = yield call(getDistributionOuter, id);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取外部资源失败！错误信息：' + result.msg);
      return '';
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
