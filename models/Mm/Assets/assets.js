import {
  addScheduleConfig,
  removeScheduleConfig,
  addSetAndTableAssociation,
  analyseElementAssociation,
  analyseElementLineage,
  analysePanoramaView,
  getPanoramaView,
  savePanorama,
  getPanoramaInstance,
  getDataMapInstance,
  analysisDataMap,
  getDataMapByNodeType,
  saveDataMapPanorama,
  getNodeRelationDataMap,
  getNodeConnection,
  getDataMapAttributeListByElementId,
  getDataMapTypeList,
  changeAssociations,
  changeElementAssociation,
  compareHistoryElements,
  getHistoryElementListByPageQuery,
  getAllClassList,
  compareElements,
  deleteBusinessAttribute,
  deleteIndex,
  deleteIndexCategory,
  deleteElement,
  deleteElementRef,
  deleteElmntBusinessAttr,
  deleteElmntMapping,
  deleteGroup,
  deleteSetAndTableAssociation,
  deleteValidateRule,
  deleteView,
  doValidate,
  getAllBusinessAttributes,
  getAllPackages,
  getAssetBusinessAttrsById,
  getAutoMatchTableElmnts,
  getBusinessAttribute,
  getBusinessAttributePageQuery,
  getIndexPageQuery,
  getIndexById,
  getIndexByCategory,
  getIndexCategoryList,
  getElement,
  getElementDiscoveries,
  getElementsByIds,
  getElementsByOwner,
  getElmntDiscById,
  getElmntMappingById,
  getElmntMappingPageQuery,
  getFirstLevelElements,
  getGroupContains,
  getHistoryElements,
  getIngestionById,
  getInitialElementsAndAssociations,
  getInstancePageUrl,
  getGatherIssueDqViewUrl,
  getOwnedElementsByType,
  getSchedulerPageUrl,
  getStandardAndColumnAssocs,
  getStandardSetAssocTableElmnts,
  getTableElmntsByRegExp,
  getTableValidateInstance,
  getTableValidateInstances,
  getValidateInstance,
  getValidateRulePageQuery,
  getViewByTypes,
  getViewContains,
  getViewPageQuery,
  mappingQuickAddAssos,
  mappingQuickRemoveAssos,
  moveView,
  panoramaViewDrillDown,
  saveOrUpdateIndex,
  saveOrUpdateIndexCategory,
  saveBusinessAndElmntAttr,
  saveBusinessAttribute,
  saveElementAssociation,
  saveElementRef,
  saveElmntBusinessAttr,
  saveElmntMapping,
  saveGroup,
  saveOrUpdateElement,
  updateElementCustomDescription,
  saveValidateRule,
  saveView,
  searchElement,
  stopTableValidate,
  tableValidate,
  testAssetExist,
  getIssueStatisticalResult,
  updateIndexUnPublished,
  updateIndexPublished,
  syncEvaluateModel,
  getAllDataOwnerUsers,
  getElmntBusinessAttr,
  getMappingOwnedElements,
  previewData,
  getSqlSeparator,
  getElementRepeatDegreeByElementId,
  getElementRepeatList,
  downloadElementRepeatDegreeByElementId,
} from '@/services/Mm/Assets/assets';
import { queryProductById } from '@/services/Platform/Service/product';
import { message } from 'antd';

export default {
  namespace: 'mmAssets',
  state: {
    searchResult: null,
    elmntDiscovery: null,
    firstLevel: null,
    elmntMapping: null,
    elmntMappingTableResult: {
      total: 0,
      data: [],
    },
    displayViewData: null,
    viewContainData: null,
    groupContainData: null,
    businessAttributeTableResult: {
      total: 0,
      data: [],
    },
    indexCategoryList: [],
    indexTableResult: {
      total: 0,
      data: [],
    },
    businessAttribute: null,
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
    /**
     * 检索信息
     */ *searchElement({ payload }, { call, put }) {
      const { searchParam } = payload;
      const result = yield call(searchElement, searchParam);
      if (result && result.code === 200) {
        yield put({
          type: 'setState',
          payload: {
            searchResult: result.data,
          },
        });
      } else {
        message.warning('检索资产失败！错误信息：' + result.msg);
      }
    },

    /**
     * 获取资产的全部信息
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */ *getElement({ payload }, { call }) {
      const { elementId } = payload;
      const result = yield call(getElement, elementId);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取资产失败！错误信息：' + result.msg);
      return null;
    },

    /**
     * 分页查询资产映射
     * @param {*} action
     * @param {*} param1
     */ *getElmntMappingPageQuery(action, { call, put }) {
      const result = yield call(getElmntMappingPageQuery, action.payload);
      if (result && result.code === 200) {
        const elmntMappingTableResult = {
          total: result.data.iTotalRecords,
          data: result.data.data,
        };
        yield put({
          type: 'setState',
          payload: {
            elmntMappingTableResult,
          },
        });
      } else {
        message.warning('查询资产映射失败！错误信息：' + result.msg);
      }
    },

    /**
     * 保存资产映射
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveElmntMapping(action, { call }) {
      const { elmntMapping } = action.payload;
      const result = yield call(saveElmntMapping, elmntMapping);
      if (result && result.code === 200) {
        message.success('资产映射保存成功！');
      } else {
        message.warning('资产映射保存失败！错误信息：' + result.msg);
      }
    },

    /**
     * 删除资产映射
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *deleteElmntMapping(action, { call }) {
      const { id } = action.payload;
      const result = yield call(deleteElmntMapping, id);
      if (result && result.code === 200) {
        message.success('资产映射删除成功！');
      } else {
        message.warning('资产映射删除失败！错误信息：' + result.msg);
      }
    },

    /**
     * 获取第一层元数据
     * @param call
     * @returns {IterableIterator<*>}
     */ *getFirstLevelElements(action, { call, put }) {
      const firstLevel = yield call(getFirstLevelElements);
      yield put({
        type: 'setState',
        payload: {
          firstLevel,
        },
      });
    },

    /**
     * 获取下级资产
     * @param action
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */ *getElementsByIds(action, { call }) {
      const { payload } = action;
      const { elementIds } = payload;
      const result = yield call(getElementsByIds, elementIds);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取资产失败！错误信息：' + result.msg);
      return null;
    },

    /**
     * 根据映射ID获取资产映射
     * @param action
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */ *getElmntMappingById(action, { call, put }) {
      const { assetMappingId } = action.payload;
      const result = yield call(getElmntMappingById, assetMappingId);
      if (result && result.code === 200) {
        yield put({
          type: 'setState',
          payload: {
            elmntMapping: result.data,
          },
        });
      } else {
        message.warning('获取资产映射失败！错误信息：' + result.msg);
      }
    },

    /**
     * 快速配置映射关联
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *mappingQuickAddAssos(action, { call }) {
      const { param } = action.payload;
      const result = yield call(mappingQuickAddAssos, param);
      if (result && result.code === 200) {
        message.success('快速自动配置资产映射成功！');
      } else {
        message.warning('快速自动配置资产映射失败！错误信息：' + result.msg);
      }
    },

    /**
     * 快速解除映射关联
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *mappingQuickRemoveAssos(action, { call }) {
      const { param } = action.payload;
      const result = yield call(mappingQuickRemoveAssos, param);
      if (result && result.code === 200) {
        message.success('快速自动解除映射成功！');
      } else {
        message.warning('快速自动解除映射失败！错误信息：' + result.msg);
      }
    },

    /**
     * 根据Id获取资产数据剖析
     * @param action
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */ *getElmntDiscById(action, { call }) {
      const { elementId } = action.payload;
      const result = yield call(getElmntDiscById, elementId);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取资产数据剖析信息失败！错误信息：' + result.msg);
      return '';
    },

    /**
     * 获取指定元数据的指定类型的下级元数据信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *getOwnedElementsByType(action, { call }) {
      const { param } = action.payload;
      const result = yield call(getOwnedElementsByType, param);
      return result;
    },

    /**
     * 根据指定的类型获取展现视图的信息
     */ *getViewByTypes({ payload }, { call, put }) {
      const { types } = payload;
      const data = yield call(getViewByTypes, types);
      yield put({
        type: 'setState',
        payload: {
          displayViewData: data,
        },
      });
    },

    /**
     * 获取指定视图下的内容
     */ *getViewContains({ payload }, { call, put }) {
      const { viewId } = payload;
      const data = yield call(getViewContains, viewId);
      yield put({
        type: 'setState',
        payload: {
          viewContainData: data,
        },
      });
    },
    /**
     * 获取指定分组下的内容
     */ *getGroupContains({ payload }, { call, put }) {
      const { groupId } = payload;
      const data = yield call(getGroupContains, groupId);
      yield put({
        type: 'setState',
        payload: {
          groupContainData: data,
        },
      });
    },

    /**
     * 获取所有的元模型内容
     */ *getAllPackages(_, { call }) {
      const data = yield call(getAllPackages);
      return data;
    },

    /**
     * 获取采集实例
     */ *getIngestionById({ payload }, { call }) {
      const { ingestionId } = payload;
      const data = yield call(getIngestionById, ingestionId);
      if (data) {
        return data;
      }
      return null;
    },

    /**
     * 更改资产关联
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */ *changeElementAssociation({ payload }, { call }) {
      const { associationList } = payload;
      const data = yield call(changeElementAssociation, associationList);
      return data;
    },

    /**
     * 保存资产关联
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveElementAssociation({ payload }, { call }) {
      const { newAssociation } = payload;
      const data = yield call(saveElementAssociation, newAssociation);
      return data;
    },

    /**
     * 保存/更新元数据信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveOrUpdateElement(action, { call }) {
      const { paramObject } = action.payload;
      const result = yield call(saveOrUpdateElement, paramObject);
      return result;
    },

    /**
     * 修改用户自定义描述
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *updateElementCustomDescription(action, { call }) {
      const { paramObject } = action.payload;
      const result = yield call(updateElementCustomDescription, paramObject);
      return result;
    },

    /**
     * 删除元数据信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *deleteElement(action, { call }) {
      const { elementId } = action.payload;
      const result = yield call(deleteElement, elementId);
      if (result && result.code === 200) {
        message.success('删除资产成功');
        return true;
      }
      message.error('删除资产失败：' + result.msg);
      return false;
    },

    /**
     *分析资产的关联关系数据
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */ *analyseElementAssociation({ payload }, { call }) {
      const { elementId } = payload;
      const data = yield call(analyseElementAssociation, elementId);
      return data;
    },

    /**
     * 分析资产的血缘影响分析数据
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */ *analyseElementLineage({ payload }, { call }) {
      const { centerElementIds } = payload;
      const data = yield call(analyseElementLineage, centerElementIds);
      return data;
    },

    /**
     * 分页查询资产映射
     * @param {*} action
     * @param {*} param
     */ *getViewPageQuery({ payload }, { call, put }) {
      const { searchParam } = payload;
      const result = yield call(getViewPageQuery, searchParam);
      if (result && result.code === 200) {
        const viewTableResult = {
          total: result.data.iTotalRecords,
          data: result.data.data,
        };
        yield put({
          type: 'setState',
          payload: {
            viewTableResult,
          },
        });
      } else {
        message.warning('查询视图信息失败！错误信息：' + result.msg);
      }
    },

    /**
     * 分页查询校验规则
     * @param {*} action
     * @param {*} param1
     */ *getValidateRulePageQuery({ payload }, { call, put }) {
      const { searchParam } = payload;
      const pageQuery = {
        displayStart: searchParam.start,
        displayLength: searchParam.length,
        order: searchParam.orderBy,
        orderDir: searchParam.orderDir,
        search: searchParam.search,
      };
      const result = yield call(getValidateRulePageQuery, pageQuery);
      if (result && result.code === 200) {
        const resultData = result.data;
        const validateRuleResult = {
          total: resultData.iTotalRecords,
          data: resultData.data,
        };
        yield put({
          type: 'setState',
          payload: {
            validateRuleResult,
          },
        });
      } else {
        message.warning('查询校验规则信息失败！错误信息：' + result.msg);
      }
    },

    /**
     * 删除校验规则信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *deleteValidateRule(action, { call }) {
      const { ruleId } = action.payload;
      const result = yield call(deleteValidateRule, ruleId);
      if (result && result.code === 200) {
        message.success('删除校验规则成功');
      } else {
        message.error('删除校验规则失败：' + result.msg);
      }
      return result;
    },

    /**
     * 删除视图信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *deleteView(action, { call }) {
      const { id } = action.payload;
      const result = yield call(deleteView, id);
      if (result && result.code === 200) {
        message.success('删除视图成功');
      } else {
        message.error('删除视图失败：' + result.msg);
      }
      return result;
    },

    /**
     * 删除分组信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *deleteGroup(action, { call }) {
      const { id } = action.payload;
      const result = yield call(deleteGroup, id);
      if (result && result.code === 200) {
        message.success('删除分组成功');
      } else {
        message.error('删除分组失败：' + result.msg);
      }
      return result;
    },

    /**
     * 保存视图信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveView(action, { call }) {
      const { info } = action.payload;
      const result = yield call(saveView, info);
      if (result && result.code === 200) {
        message.success('保存视图成功！');
      } else {
        message.warning('保存视图失败！错误信息：' + result.msg);
      }
      return result;
    },

    /**
     * 保存分组信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveGroup(action, { call }) {
      const { info } = action.payload;
      const result = yield call(saveGroup, info);
      if (result && result.code === 200) {
        message.success('保存分组成功！');
      } else {
        message.warning('保存分组失败！错误信息：' + result.msg);
      }
      return result;
    },

    /**
     * 保存元数据同视图/分组之间的关联信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveElementRef(action, { call }) {
      const { param } = action.payload;
      const result = yield call(saveElementRef, param);
      if (result && result.code === 200) {
        message.success('关联成功！');
      } else {
        message.warning('关联失败！错误信息：' + result.msg);
        message.error(result.msg);
      }
      return result;
    },

    /**
     * 删除元数据同视图/分组之间的关联信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *deleteElementRef(action, { call }) {
      const { param } = action.payload;
      const result = yield call(deleteElementRef, param);
      if (result && result.code === 200) {
        message.success('解除关联成功！');
      } else {
        message.warning('解除关联失败！错误信息：' + result.msg);
      }
      return result;
    },

    /**
     * 全景图数据计算
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */ *analysePanoramaView(_, { call }) {
      const result = yield call(analysePanoramaView);
      if (result && result.code === 200) {
        message.success('全景图开始计算，请稍后刷新页面！');
        return result;
      }
      return null;
    },

    /**
     * 获取全景图数据
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */ *getPanoramaView(_, { call }) {
      const result = yield call(getPanoramaView);
      if (result && result.code === 200) {
        return result.data;
      }
      return null;
    },

    /**
     * 获取全景图下钻数据
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */ *panoramaViewDrillDown({ payload }, { call }) {
      const { drillData } = payload;
      const result = yield call(panoramaViewDrillDown, drillData);
      if (result && result.code === 200) {
        return result.data;
      }
      return null;
    },

    /**
     * 保存全景图位置信息
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */ *savePanorama({ payload }, { call }) {
      const { panorama } = payload;
      const result = yield call(savePanorama, panorama);
      if (result && result.code === 200) {
        message.success('全景图位置信息保存成功！');
      } else {
        message.warning('全景图位置信息保存失败！错误信息：' + result.msg);
      }
    },

    /**
     * 获取全景图计算缓存实例
     * @param _
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getPanoramaInstance(_, { call }) {
      const result = yield call(getPanoramaInstance);
      if (result && result.code === 200) {
        return result;
      }
      return null;
    },

    /**
     * 获取最新的数据地图计算结果
     * @param _
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getDataMapInstance(_, { call }) {
      const result = yield call(getDataMapInstance);
      if (result && result.code === 200) {
        return result;
      }
      return null;
    },

    /**
     * 数据地图计算
     * @param _
     * @param call
     * @returns {IterableIterator<*>}
     */
    *analysisDataMap(_, { call }) {
      const result = yield call(analysisDataMap);
      if (result && result.code === 200) {
        return result;
      }
      return null;
    },

    /**
     * 保存数据地图位置信息
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveDataMapPanorama({ payload }, { call }) {
      const { dataMap } = payload;
      const result = yield call(saveDataMapPanorama, dataMap);
      if (result && result.code === 200) {
        message.success('数据地图位置信息保存成功！');
      } else {
        message.warning('数据地图位置信息保存失败！错误信息：' + result.msg);
      }
    },

    /**
     * 根据层级获取数据地图
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *getDataMapByNodeType(action, { call }) {
      const { dataMapType } = action.payload;
      return yield call(getDataMapByNodeType, dataMapType);
    },

    /**
     * 获取某个被点击的数据地图节点的关联分析
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *getNodeRelationDataMap(action, { call }) {
      const { info } = action.payload;
      return yield call(getNodeRelationDataMap, info);
    },

    /**
     * 获取某个被点击的数据地图连线的关联分析
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *getNodeConnection(action, { call }) {
      const { info } = action.payload;
      return yield call(getNodeConnection, info);
    },

    /**
     * 获取数据地图节点类型
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *getDataMapTypeList(action, { call }) {
      return yield call(getDataMapTypeList);
    },

    /**
     * 获取某个被点击的数据地图节点的数据
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *getDataMapAttributeListByElementId(action, { call }) {
      const { elementId } = action.payload;
      return yield call(getDataMapAttributeListByElementId, elementId);
    },

    /**
     * 分页查询业务属性
     * @param {*} action
     * @param {*} param1
     */ *getBusinessAttributePageQuery(action, { call, put }) {
      const result = yield call(getBusinessAttributePageQuery, action.payload);
      if (result && result.code === 200) {
        const businessAttributeTableResult = {
          total: result.data.iTotalRecords,
          data: result.data.data,
        };
        yield put({
          type: 'setState',
          payload: {
            businessAttributeTableResult,
          },
        });
      } else {
        message.warning('查询业务属性失败！错误信息：' + result.msg);
      }
    },

    /**
     * 保存业务属性
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveBusinessAttribute(action, { call }) {
      const { businessAttribute } = action.payload;
      const result = yield call(saveBusinessAttribute, businessAttribute);
      if (result && result.code === 200) {
        message.success('业务属性保存成功！');
      } else {
        message.warning('业务属性保存失败！错误信息：' + result.msg);
      }
    },

    /**
     * 删除业务属性
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *deleteBusinessAttribute(action, { call }) {
      const { id } = action.payload;
      const result = yield call(deleteBusinessAttribute, id);
      if (result && result.code === 200) {
        message.success('业务属性删除成功！');
      } else {
        message.warning('业务属性删除失败！错误信息：' + result.msg);
      }
    },

    /**
     * 根据ID获取业务属性
     * @param action
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */ *getBusinessAttribute(action, { call }) {
      const { id } = action.payload;
      const result = yield call(getBusinessAttribute, id);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取业务属性失败！错误信息：' + result.msg);
      return '';
    },

    /**
     * 保存资产的业务属性
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveElmntBusinessAttr(action, { call }) {
      const { elmntBusinessAttr } = action.payload;
      const result = yield call(saveElmntBusinessAttr, elmntBusinessAttr);
      if (result && result.code === 200) {
        message.success('业务属性保存成功！');
      } else {
        message.warning('业务属性保存失败！错误信息：' + result.msg);
      }
    },

    /**
     * 删除资产的业务属性
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *deleteElmntBusinessAttr(action, { call }) {
      const { elementId, businessAttrId } = action.payload;
      const result = yield call(deleteElmntBusinessAttr, elementId, businessAttrId);
      if (result && result.code === 200) {
        message.success('业务属性删除成功！');
      } else {
        message.warning('业务属性删除失败！错误信息：' + result.msg);
      }
    },

    /**
     * 保存业务属性并配置资产的业务属性
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveBusinessAndElmntAttr(action, { call }) {
      const { param } = action.payload;
      const result = yield call(saveBusinessAndElmntAttr, param);
      if (result && result.code === 200) {
        message.success('业务属性保存成功！');
      } else {
        message.warning('业务属性保存失败！错误信息：' + result.msg);
      }
    },

    /**
     * 获取所有业务属性
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */ *getAllBusinessAttributes(_, { call }) {
      const result = yield call(getAllBusinessAttributes);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取业务属性失败！错误信息：' + result.msg);
      return [];
    },

    /**
     * 分页查询指标
     * @param {*} action
     * @param {*} param1
     */ *getIndexPageQuery(action, { call, put }) {
      const result = yield call(getIndexPageQuery, action.payload);
      if (result && result.code === 200) {
        const indexTableResult = {
          total: result.data.iTotalRecords,
          data: result.data.data,
        };
        yield put({
          type: 'setState',
          payload: {
            indexTableResult,
          },
        });
      } else {
        message.warning('查询指标失败！错误信息：' + result.msg);
      }
    },

    /**
     * 删除指标
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *deleteIndex(action, { call }) {
      const { id } = action.payload;
      const result = yield call(deleteIndex, id);
      if (result && result.code === 200) {
        message.success('指标删除成功！');
      } else {
        message.warning('指标删除失败！错误信息：' + result.msg);
      }
    },

    /**
     * 删除指标分类
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *deleteIndexCategory(action, { call }) {
      const { id } = action.payload;
      const result = yield call(deleteIndexCategory, id);
      if (result && result.code === 200) {
        message.success('指标分类删除成功！');
      } else {
        message.warning('指标分类删除失败！错误信息：' + result.msg);
      }
      return result;
    },

    /**
     * 获取指标详细信息
     */
    *getIndexById({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(getIndexById, id);
      if (response.code !== 200) {
        message.warning('获取指标信息失败！');
      } else {
        yield put({
          type: 'saveState',
          payload: {
            index: response.data,
          },
        });
        return response.data;
      }
      return null;
    },

    /**
     * 获取分类下的指标
     */
    *getIndexByCategory({ payload }, { call }) {
      const { id } = payload;
      const result = yield call(getIndexByCategory, id);
      if (result.code !== 200) {
        message.warning('根据指标分类获取指标信息失败！');
      } else {
        return result;
      }
      return null;
    },

    /**
     * 获取组织结构树
     */
    *getIndexCategoryList(_, { call, put }) {
      const result = yield call(getIndexCategoryList);
      if (result.code !== 200) {
        message.warning('读取指标分类信息失败！');
      } else {
        yield put({
          type: 'setState',
          payload: {
            indexCategoryList: result.data,
          },
        });
        return result.data;
      }
      return null;
    },

    /**
     * 保存指标信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveOrUpdateIndex(action, { call }) {
      const { index } = action.payload;
      const result = yield call(saveOrUpdateIndex, index);
      if (result && result.code === 200) {
        message.success('指标保存成功！');
        return result;
      }
      message.warning('指标保存失败！错误信息：' + result.msg);
      return '';
    },

    /**
     * 保存指标分类
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveOrUpdateIndexCategory(action, { call }) {
      const { category } = action.payload;
      const result = yield call(saveOrUpdateIndexCategory, category);
      if (result && result.code === 200) {
        message.success('指标分类保存成功！');
        return result;
      }
      message.warning('指标分类保存失败！错误信息：' + result.msg);
      return '';
    },

    /**
     * 保存校验规则信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *saveValidateRule(action, { call }) {
      const { ruleInfo } = action.payload;
      const result = yield call(saveValidateRule, ruleInfo);
      if (result && result.code === 200) {
        message.success('保存校验规则成功！');
      } else {
        message.warning('保存校验规则失败！错误信息：' + result.msg);
      }
      return result;
    },

    /**
     * 保存校验规则信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *testAssetExist(action, { call }) {
      const { assetId } = action.payload;
      const result = yield call(testAssetExist, assetId);
      if (result && result.code === 200) {
        if (result.data === true) {
          return true;
        }
      }
      return false;
    },

    /**
     * 执行校验
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *doValidate(action, { call }) {
      const { restart } = action.payload;
      const result = yield call(doValidate, restart);
      if (result && result.code === 200) {
        message.success('启动成功，后台执行扫描中...');
      } else {
        message.warning('启动失败！错误信息：' + result.msg);
      }
      return result;
    },

    /**
     * 获取质量校验运行实例
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *getValidateInstance(action, { call }) {
      const result = yield call(getValidateInstance);
      return result;
    },

    /**
     * 检索元数据信息
     */
    *searchElements({ payload }, { call }) {
      const { searchParam } = payload;
      const result = yield call(searchElement, searchParam);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('检索资产失败！错误信息：' + result.msg);
      return null;
    },

    /**
     * 获取资产的关联关系和关联资产
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getInitialElementsAndAssociations({ payload }, { call }) {
      const exceptAssociationList = [];
      exceptAssociationList.push('8843');
      const { elementId } = payload;
      const data = yield call(getInitialElementsAndAssociations, elementId, exceptAssociationList);
      return data;
    },

    /**
     * 保存改变的关联关系
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *changeAssociations({ payload }, { call }) {
      const { changedAssociations } = payload;
      yield call(changeAssociations, changedAssociations);
    },

    /**
     * 历史元数据变更记录分页查询
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getHistoryElementListByPageQuery({ payload }, { call }) {
      const { pageQuery } = payload;
      const result = yield call(getHistoryElementListByPageQuery, pageQuery);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('检索元数据历史变更记录失败！错误信息：' + result.msg);
      return null;
    },

    *getAllClassList(action, { call }) {
      return yield call(getAllClassList);
    },

    /**
     * 获取资产的历史数据
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getHistoryElements({ payload }, { call }) {
      const { elementId } = payload;
      const data = yield call(getHistoryElements, elementId);
      return data;
    },

    /**
     * 资产历史比对
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *compareHistoryElements({ payload }, { call }) {
      const { elementId, fromTime, toTime } = payload;
      const data = yield call(compareHistoryElements, elementId, fromTime, toTime);
      return data;
    },

    /**
     * 资产比对
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *compareElements({ payload }, { call }) {
      const { fromElementId, toElementId } = payload;
      const data = yield call(compareElements, fromElementId, toElementId);
      return data;
    },

    /**
     * 移动视图
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *moveView({ payload }, { call }) {
      const { sourceId, targetId } = payload;
      const result = yield call(moveView, sourceId, targetId);
      if (result && result.code === 200) {
        message.success('移动成功');
      } else {
        message.warning('移动失败！错误信息：' + result.msg);
      }
      return result;
    },

    /**
     * 根据Id获取资产的业务属性
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getAssetBusinessAttrsById({ payload }, { call }) {
      const { elementId } = payload;
      const result = yield call(getAssetBusinessAttrsById, elementId);
      return result;
    },

    /**
     * 根据elementIds获取数据剖析集合
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getElementDiscoveries({ payload }, { call }) {
      const { elementIds } = payload;
      const result = yield call(getElementDiscoveries, elementIds);
      return result;
    },

    /**
     * 获取调度服务页面路径
     * @param payload
     * @param call
     * @returns {Generator<*, *, ?>}
     */
    *getSchedulerPageUrl({ payload }, { call }) {
      const { realIp } = payload;
      const result = yield call(getSchedulerPageUrl, realIp);
      return result;
    },

    /**
     * 获取与标准集关联的表资产集合
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getStandardSetAssocTableElmnts({ payload }, { call }) {
      const { standardSetId } = payload;
      const result = yield call(getStandardSetAssocTableElmnts, standardSetId);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('查询关联表信息失败！错误信息：' + result.msg);
      return '';
    },

    /**
     * 删除关联关系
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *deleteSetAndTableAssociation({ payload }, { call }) {
      const { association } = payload;
      const result = yield call(deleteSetAndTableAssociation, association);
      if (result && result.code === 200) {
        message.success('移除关联关系成功');
      } else {
        message.warning('移除关联关系失败！错误信息：' + result.msg);
      }
    },

    /**
     * 获取标准集关联表的校验细节
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getTableValidateInstances({ payload }, { call }) {
      const { standardSetId } = payload;
      const result = yield call(getTableValidateInstances, standardSetId);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('查询检验实例失败！错误信息：' + result.msg);
      return null;
    },

    /**
     * 获取自动匹配表
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getAutoMatchTableElmnts({ payload }, { call }) {
      const { standardSetId } = payload;
      const result = yield call(getAutoMatchTableElmnts, standardSetId);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('查询匹配表失败！错误信息：' + result.msg);
      return '';
    },

    /**
     * 获取符合通配符的表
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getTableElmntsByRegExp({ payload }, { call }) {
      const { standardSetId, tableNameRegExps } = payload;
      const result = yield call(getTableElmntsByRegExp, standardSetId, tableNameRegExps);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('添加匹配表失败！错误信息：' + result.msg);
      return '';
    },

    /**
     * 添加标准集-表的关联关系
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *addSetAndTableAssociation({ payload }, { call }) {
      const { standardSetId, selectedRowKeys } = payload;
      const result = yield call(addSetAndTableAssociation, standardSetId, selectedRowKeys);
      if (result && result.code === 200) {
        message.success('添加关联关系成功');
      } else {
        message.warning('添加关联关系失败！错误信息：' + result.msg);
      }
    },

    /**
     * 获取数据标准和列的关联关系
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getStandardAndColumnAssocs({ payload }, { call }) {
      const { association } = payload;
      const result = yield call(getStandardAndColumnAssocs, association);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取数据标准和列的关联关系失败！错误信息：' + result.msg);
      return '';
    },

    /**
     * 执行表数据校验
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *tableValidate({ payload }, { call }) {
      const { standardSetId, tableElementId } = payload;
      const result = yield call(tableValidate, standardSetId, tableElementId);
      return result;
    },

    /**
     * 停止执行表数据校验
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *stopTableValidate({ payload }, { call }) {
      const { standardSetId, tableElementId } = payload;
      const result = yield call(stopTableValidate, standardSetId, tableElementId);
      return result;
    },

    /**
     * 获取数据质量监控页面路径
     * @param payload
     * @param call
     * @returns {Generator<*, *, ?>}
     */
    *getInstancePageUrl({ payload }, { call }) {
      const { standardSetId, tableElementId } = payload;
      const result = yield call(getInstancePageUrl, standardSetId, tableElementId);
      return result;
    },

    /**
     * 获取数据质量监控页面路径
     * @param payload
     * @param call
     * @returns {Generator<*, *, ?>}
     */
    *getGatherIssueDqViewUrl({ payload }, { call }) {
      const { modelOId, dataSourceId } = payload;
      const result = yield call(getGatherIssueDqViewUrl, modelOId, dataSourceId);
      return result;
    },

    /**
     * 获取指定的表数据校验实例
     * @param payload
     * @param call
     * @returns {Generator<*, *, ?>}
     */
    *getTableValidateInstance({ payload }, { call }) {
      const { standardSetId, tableElementId } = payload;
      const result = yield call(getTableValidateInstance, standardSetId, tableElementId);
      return result;
    },

    /**
     * 保存表数据校验执行计划
     * @param payload
     * @param call
     * @returns {Generator<*, *, ?>}
     */
    *addScheduleConfig({ payload }, { call }) {
      const { standardSetId, tableElementId, cronInfo } = payload;
      const result = yield call(addScheduleConfig, standardSetId, tableElementId, cronInfo);
      return result;
    },

    /**
     * 移除表数据校验执行计划
     * @param payload
     * @param call
     * @returns {Generator<*, *, ?>}
     */
    *removeScheduleConfig({ payload }, { call }) {
      const { standardSetId, tableElementId } = payload;
      const result = yield call(removeScheduleConfig, standardSetId, tableElementId);
      return result;
    },

    /**
     * 获取问题统计信息
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getIssueStatisticalResult(action, { call }) {
      const result = yield call(getIssueStatisticalResult);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取问题统计信息失败！错误信息：' + result.msg);
      return '';
    },

    /**
     * 获取product
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getProductById({ payload }, { call }) {
      const { productId } = payload;
      const currentProduct = yield call(queryProductById, productId);
      if (!currentProduct) {
        message.warning('加载当前服务信息失败，请检查参数是否正确！');
        return '';
      }
      return currentProduct;
    },

    /**
     * 取消发布数据指标
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *updateIndexUnPublished(action, { call }) {
      const { indexIds } = action.payload;
      const result = yield call(updateIndexUnPublished, indexIds);
      return result;
    },

    /**
     * 取消发布数据指标
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *updateIndexPublished(action, { call }) {
      const { indexIds } = action.payload;
      const result = yield call(updateIndexPublished, indexIds);
      return result;
    },

    /**
     * 取消发布数据指标
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */ *syncEvaluateModel(action, { call }) {
      const { standardSetId, tableId } = action.payload;
      const result = yield call(syncEvaluateModel, standardSetId, tableId);
      if (result && result.code === 200) {
        message.success('同步更新到数据质量服务成功');
      } else {
        message.warning('同步更新到数据质量服务失败！错误信息：' + result.msg);
      }
    },

    /**
     * 获取所有数据责任人用户
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getAllDataOwnerUsers(action, { call }) {
      const result = yield call(getAllDataOwnerUsers);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取数据责任人用户失败！错误信息：' + result.msg);
      return '';
    },

    /**
     * 获取所有数据责任人用户
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getElmntBusinessAttr(action, { call }) {
      const { elementId, businessAttrId } = action.payload;
      const result = yield call(getElmntBusinessAttr, elementId, businessAttrId);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取业务属性出错！错误信息：' + result.msg);
      return '';
    },

    /**
     * 获取指定元数据的所有下级元数据
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */ *getElementsByOwner({ payload }, { call }) {
      const { ownerId } = payload;
      const result = yield call(getElementsByOwner, ownerId);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取下级失败！错误信息：' + result.msg);
      return null;
    },

    /**
     * 获取映射的下级资产
     * @param payload
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getMappingOwnedElements({ payload }, { call }) {
      const { ownerId, direction, searchValue } = payload;
      const result = yield call(getMappingOwnedElements, ownerId, direction, searchValue);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取下级失败！错误信息：' + result.msg);
      return null;
    },

    *previewData({ payload }, { call }) {
      const { previewQueryParam } = payload;
      const result = yield call(previewData, previewQueryParam);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('数据预览失败！错误信息：' + result.msg);
      return null;
    },

    /**
     * 根据公共数据源ID获取数据库特殊分隔符
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getSqlSeparator(action, { call }) {
      const { dataSourceId } = action.payload;
      const result = yield call(getSqlSeparator, dataSourceId);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取数据库分隔符出错！错误信息：' + result.msg);
      return '';
    },

    /**
     * 获取重复度分析集合
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getElementRepeatDegreeByElementId(action, { call }) {
      const { elementId } = action.payload;
      const result = yield call(getElementRepeatDegreeByElementId, elementId);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取重复度分析出错！错误信息：' + result.msg);
      return '';
    },

    /**
     * 获取重复度分析明细
     * @param action
     * @param call
     * @returns {IterableIterator<*>}
     */
    *getElementRepeatList(action, { call }) {
      const { fromElementId, toElementId } = action.payload;
      const result = yield call(getElementRepeatList, fromElementId, toElementId);
      if (result && result.code === 200) {
        return result.data;
      }
      message.warning('获取重复度分析明细出错！错误信息：' + result.msg);
      return '';
    },

    /**
     * 下载重复度分析
     * @param {*} action
     * @param {*} param1
     */
    *downloadElementRepeatDegreeByElementId({ payload, callback }, { call }) {
      const { elementId } = payload;
      const response = yield call(downloadElementRepeatDegreeByElementId, elementId);

      if (!response.data) {
        message.warning('暂无数据!');
      } else {
        if (response instanceof Blob) {
          if (callback && typeof callback === 'function') {
            callback(response);
          }
        } else {
          message.warning('下载失败');
        }
      }
    },
  },
};
