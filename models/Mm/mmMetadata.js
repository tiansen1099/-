import {
  metadataSearch,
  metadataGetElement,
  metadataGetElements,
  metadataGetOwnedElements,
  metadataGetEsElements,
  metadataDeleteElements,
  metadataSaveElements,
  metadataGetOwnedElementsByIDsAndTypes,
} from '@/services/Mm/mmMetadata';
import { getDcatAssociatedDistListByAssetIds } from '@/services/Dcat/asset';
import { getIngestionInstancesByIds } from '@/services/Mm/mmIngestion';

export default {
  namespace: 'mmMetadata',

  state: {
    searchResult: {
      iTotalRecords: 0,
      aggsData: [],
      scrollId: '',
      elements: [],
      // 全量数据和已发布资源数据
      allData: [],
      allAssociatedDist: {},
      asset: {},
      columnAssets: [],
      allIngestions: {},
    },

    searchSchema: {},
    elements: [],
    batchAssetElements: [],
  },

  effects: {
    *getAssetElementsByOwnerIdAndName(action, { call, put }) {
      const { assetNames, owner, types } = action.payload;
      const elementIdAndType = {
        elementIds: [owner],
        types,
      };
      const response = yield call(metadataGetOwnedElementsByIDsAndTypes, elementIdAndType);
      const batchAssetElements = response.filter(item => {
        const index = assetNames.findIndex(assetName => assetName === item.name);
        if (index !== -1) {
          assetNames.splice(index, 1);
          return true;
        }
        return false;
      });
      if (assetNames.length !== 0) {
        return {
          code: 500,
          msg: `不存在名为 ${assetNames[0]} 的库表或视图资产，请检查批量发布数据资产配置`,
        };
      }
      yield put({
        type: 'setState',
        payload: {
          batchAssetElements,
        },
      });
      return {
        code: 200,
        data: batchAssetElements,
      };
    },

    *metadataGetOwnedElementsByIDsAndTypes(action, { call }) {
      const { owners, types } = action.payload;
      const elementIdAndType = {
        elementIds: owners,
        types,
      };
      const response = yield call(metadataGetOwnedElementsByIDsAndTypes, elementIdAndType);
      return response;
    },

    /**
     * 分页检索元数据信息
     * @param {*} action
     * @param {*} param1
     */
    *metadataSearch(action, { select, call, put }) {
      const { currentPage } = action.payload;
      const response = yield call(metadataSearch, action.payload);
      const { allData, allAssociatedDist, allIngestions } = yield select(
        state => state.mmMetadata.searchResult
      );
      if (response && response.code === 200) {
        const searchResponse = response.data;
        const { iTotalRecords, aggsData, scrollId, elements } = searchResponse;
        let associatedDist = [];
        if (elements && elements.length > 0) {
          // 查询关联的资源
          const assetIds = elements.map(item => item.id);
          associatedDist = yield call(getDcatAssociatedDistListByAssetIds, assetIds);
          // 查询关联的资产采集任务
          const ingestionIds = elements.map(item => item.ingestionId);
          const ingestions = yield call(getIngestionInstancesByIds, ingestionIds);
          ingestions.forEach(item => {
            allIngestions[item.ingestionId] = item.ingestionName;
          });
          // 获取上级元素名称
          elements.map(item => {
            const returnItem = item;
            const { idPath, namePath } = returnItem;
            const nameArr = namePath.split('/');
            const idArr = idPath.split('/');
            returnItem.ownerElement = {
              id: idArr[idArr.length - 2],
              name: nameArr[nameArr.length - 2],
            };
            return returnItem;
          });
        }
        const newElements = elements || [];
        const searchResult = {
          iTotalRecords,
          aggsData: JSON.parse(aggsData),
          scrollId,
          elements: newElements,
          // 全量数据
          allData: currentPage === 0 ? newElements : allData.concat(newElements),
          allAssociatedDist: Object.assign(allAssociatedDist, associatedDist),
          allIngestions,
        };
        yield put({
          type: 'setState',
          payload: {
            searchResult,
          },
        });
        return searchResult;
      }
      return {};
    },

    /**
     * 查询模式
     */
    *metadataSearchSchema(action, { call, put }) {
      const searchSchema = yield call(metadataSearch, action.payload);
      yield put({
        type: 'setState',
        payload: {
          searchSchema,
        },
      });
      return searchSchema;
    },

    /**
     * 基本元数据查询
     * @param {*} action 
     * @param {*} param1 
     */
    *basicMetadataSearch(action,{call}){
      const {searchingParam}=action.payload
      return yield call(metadataSearch, searchingParam);
    },

    /**
     * 查询资产信息
     * @param {*} action
     * @param {*} param1
     */
    *metadataElement(action, { call, put }) {
      const { elementId } = action.payload;
      const response = yield call(metadataGetElement, elementId);
      yield put({
        type: 'setState',
        payload: {
          asset: response,
        },
      });
      return response;
    },

    *metadataGetOwnedElements(action, { call, put }) {
      const { elementId, ownedElementType } = action.payload;
      const response = yield call(metadataGetOwnedElements, elementId, ownedElementType);
      yield put({
        type: 'setState',
        payload: {
          columnAssets: response,
        },
      });
      return response;
    },

    /**
     * 查询资产指定的Element信息
     * @param {*} action
     * @param {*} param1
     */
    *metadataGetEsElements(action, { call, put }) {
      const { elementIds } = action.payload;
      const response = yield call(metadataGetEsElements, elementIds);
      yield put({
        type: 'setState',
        payload: {
          elements: response,
        },
      });
      return response;
    },

    /**
     * 批量删除MM资产
     * @param {*} action
     * @param {*} param1
     */
    *metadataDeleteElements(action, { call }) {
      const { elementIds } = action.payload;
      const response = yield call(metadataDeleteElements, elementIds);
      return response;
    },

    /**
     * 批量保存MM资产
     */
    *metadataSaveElements(action, { call }) {
      const { elements } = action.payload;
      const response = yield call(metadataSaveElements, elements);
      return response;
    },

    /**
     * 根据ID，批量获取资产
     *
     * @param {*} action
     * @param {*} {call}
     * @returns
     */
    *metadataGetElements(action, { call }) {
      const { elementIds } = action.payload;
      const elements = yield call(metadataGetElements, elementIds);
      return elements;
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
