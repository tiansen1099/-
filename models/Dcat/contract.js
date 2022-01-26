import {
  getContractForVersionById,
  getAppContractVersionsById,
  getAppContractRes,
  assignTask,
  getContractListByIdAndVersion,
  getContractRelationInfor,
  contractTabelSearch,
  deleteContract,
  downloadDocmount,
  templateManagerSearch,
  contractSearch,
  saveOrUpdateContract,
  reflectRelation,
  queryContractTemplateList,
  queryContractTemplateDetails,
  deleteContractTemplate,
  saveTemplate,
  getContractTemplateById,
  getDistributionListIdByExecute,
} from '@/services/Dcat/contract';
import DiResponse from '@/components/DiResponse';
import { getCatalogTree } from '@/services/Dcat/catalog';
import { message } from 'antd';

export default {
  namespace: 'contract',

  state: {
    versions: [],
    tableList: {
      data: [],
      total: 0,
    },
    templateList: {
      data: [],
      total: 0,
    },
    contractData: {},
    catalogData: null,
    selectedCatalog: null,
    tableResult: {
      data: [],
      total: 0,
    },
    searchState: {
      isPublished: 'Y',
      fromType: 1,
      loading: false,
      searchValue: '',
      start: 0,
      length: 8,
      serviceType: null,
      businessCategory: null,
      businessName: null,
    },
    templatInfo: null,
  },

  effects: {
    /**
     * 获取版本列表
     */
    *getContractForVersionById({ payload }, { call, put }) {
      const response = yield call(getContractForVersionById, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      yield put({
        type: 'saveState',
        payload: {
          versions: response.data,
        },
      });
      return response.data;
    },
    /**
     * 获取应用契约版本列表
     */
    *getAppContractVersionsById({ payload }, { call, put }) {
      const response = yield call(getAppContractVersionsById, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      yield put({
        type: 'saveState',
        payload: {
          versions: response.data,
        },
      });
      return response.data;
    },
    /**
     * 获取契约信息
     */
    *getContractInfo({ payload, app }, { call }) {
      const response = yield call(getContractListByIdAndVersion, payload, app);
      const responseRelation = yield call(getContractRelationInfor, payload, app);
      const responseRes = app ? yield call(getAppContractRes, payload) : null;
      if (response && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      if (responseRelation && responseRelation.code !== 200) {
        DiResponse.error(responseRelation.msg);
        return null;
      }
      if (app && responseRes && responseRes.code !== 200) {
        DiResponse.error(responseRes.msg);
        return null;
      }
      const data = {
        info: response.data,
        relationInfo: responseRelation && responseRelation.data,
        res: responseRes && responseRes.data,
      };
      return data;
    },
    /**
     * 分页查询契约业务列表
     * @param {*} action
     * @param {*} param1
     */
    *getTableSearch(action, { call, put }) {
      const result = yield call(contractTabelSearch, action.payload);
      const tableList = { total: result.data.iTotalRecords, data: result.data.data };
      yield put({
        type: 'saveState',
        payload: {
          tableList,
        },
      });
      return tableList;
    },

    /**
     * 删除中台业务
     */
    *deleteContract(action, { call }) {
      // 接口是void类型，无返回
      return yield call(deleteContract, action.payload);
    },

    /**
     * 文档下载
     */
    *downloadDocmount({ payload, callback, app }, { call }) {
      const response = yield call(downloadDocmount, payload, app);
      if (response instanceof Blob) {
        if (callback && typeof callback === 'function') {
          callback(response);
        }
      } else {
        message.warning('下载失败');
      }
    },
    /**
     * 发布任务
     */
    *assignTask({ payload }, { call }) {
      const data = payload;
      const response = yield call(assignTask, data);
      if (response && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response;
    },

    /**
     * 分页查询模板列表
     * @param {*} action
     * @param {*} param1
     */
    *getTemplateTableSearch(action, { call, put }) {
      const result = yield call(templateManagerSearch, action.payload);
      const templateList = { total: result.data.total, data: result.data.list };
      yield put({
        type: 'saveState',
        payload: {
          templateList,
        },
      });
      return templateList;
    },

    /**
     * 获取目录树
     */
    *getCatalogTree({ payload }, { put, call }) {
      const { type } = payload;
      const catalogData = yield call(getCatalogTree, type);
      yield put({
        type: 'saveState',
        payload: {
          catalogData,
        },
      });
    },

    /**
     * 首页-查询契约列表
     * @param {*} action
     * @param {*} param1
     */
    *searchContract(action, { select, call, put }) {
      let searchState = yield select(state => state.contract.searchState);
      const { data } = yield select(state => state.contract.tableResult);
      const catalogData = yield call(getCatalogTree, 'CONTRACT');
      const { selectedCatalog } = yield select(state => state.contract);
      yield put({
        type: 'saveState',
        payload: {
          searchState: {
            ...searchState,
            ...action.payload,
            loading: true,
          },
        },
      });

      searchState = yield select(state => state.contract.searchState);
      const {
        start,
        length,
        searchValue,
        businessCategory,
        businessName,
        serviceType,
      } = searchState;

      //  设置查询条件
      const params = {};
      params.fromType = 1;
      params.from = start;
      // params.size = length;
      params.size = window.innerHeight > 1000 ? length * 2 : length;
      params.order = 'createdTime';
      params.orderDir = 'desc';
      params.data = {};
      const allResult = yield call(contractSearch, params);

      // 关键字查询
      if (searchValue !== '') {
        params.data.contractName = searchValue;
      }

      // 目录信息
      if (selectedCatalog !== null) {
        if (selectedCatalog[0] !== null && selectedCatalog[1] !== null) {
          let colValue = selectedCatalog[1].id;
          if (selectedCatalog[2] !== null) {
            colValue = selectedCatalog[2].id;
            params.data.contentsThird = colValue;
          } else {
            params.data.contentsSecond = colValue;
          }
        }
      }

      // 契约分类
      if (serviceType !== undefined && serviceType !== null) {
        params.data.serviceType = serviceType;
      }

      // 业务分类和业务名称信息
      if (businessCategory !== undefined && businessCategory !== null) {
        params.data.businessClassificationFirst = businessCategory;
      }
      if (businessName !== undefined && businessName !== null) {
        params.data.businessClassificationSecond = businessName;
      }

      const result = yield call(contractSearch, params);
      const resultData =
        result.data.data === undefined || result.data.data === null ? [] : result.data.data;
      let putResult;
      const total = result.data.iTotalRecords;
      if (start === 0) {
        putResult = resultData;
      } else {
        putResult = data.concat(resultData);
      }

      // 添加目录资源数
      const catalogArray =
        allResult.data.egg_contents === undefined || allResult.data.egg_contents === null
          ? []
          : allResult.data.egg_contents;
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
        type: 'saveState',
        payload: {
          searchState: {
            ...searchState,
            start: start + 1,
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
     * 首页-重置查询条件
     */
    *clearSearchState(action, { put }) {
      yield put({
        type: 'saveState',
        payload: {
          searchState: action.payload,
        },
      });
    },

    /**
     * 发布-新增or编辑契约
     */
    *saveOrUpdateContract({ payload }, { call }) {
      const response = yield call(saveOrUpdateContract, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response;
    },

    /**
     * 编辑-获取契约信息
     */
    *getContractByIdAndVersion({ payload }, { call }) {
      const response = yield call(getContractListByIdAndVersion, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 发布-示例映射
     */
    *reflectRelation({ payload }, { call }) {
      const response = yield call(reflectRelation, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response;
    },

    /**
     * 模板引用-获取模板列表
     */
    *queryContractTemplateList({ payload }, { call }) {
      const response = yield call(queryContractTemplateList, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 模板引用-获取模板详细
     */
    *queryContractTemplateDetails({ payload }, { call }) {
      const response = yield call(queryContractTemplateDetails, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
    },

    /**
     * 删除契约模板
     */
    *deleteContractTemplate(action, { call }) {
      const response = yield call(deleteContractTemplate, action.payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response;
    },

    /**
     * 保存契约模板
     */
    *saveTemplate(action, { call }) {
      const response = yield call(saveTemplate, action.payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response;
    },
    /**
     * 分页查询契约业务列表
     * @param {*} action
     * @param {*} param1
     */
    *getContractTemplateById(action, { call, put }) {
      const result = yield call(getContractTemplateById, action.payload);

      if (result !== null && result.code !== 200) {
        DiResponse.error(result.msg);
        return null;
      }
      const templatInfo = result.data;
      yield put({
        type: 'saveState',
        payload: {
          templatInfo,
        },
      });
      return templatInfo;
    },

    /**
     * 执行任务
     */
    *getDistributionListIdByExecute({ payload }, { call }) {
      const response = yield call(getDistributionListIdByExecute, payload);
      if (response !== null && response.code !== 200) {
        DiResponse.error(response.msg);
        return null;
      }
      return response.data;
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
