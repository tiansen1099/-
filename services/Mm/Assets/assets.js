import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export function formatUrl(url) {
  let tempUrl = url;
  const productCode = getSessionCache('productCode');
  if (productCode === 'DataCatalog') {
    tempUrl = tempUrl.replace('/di/MM', '/di/' + productCode + '/mmService');
  }
  return tempUrl;
}

export async function searchElement(searchParam) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/search?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: searchParam,
  });
}

export function getElement(elementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/${elementId}/get_es_element?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url);
}

/**
 * 分页查询资产映射
 * @param searchParam
 * @returns {Promise<{}>}
 */
export async function getElmntMappingPageQuery(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { currentPage, pageSize, orderCol, orderDir, search } = searchParam;
    const start = currentPage * pageSize;
    const pageQuery = {
      displayStart: start,
      displayLength: pageSize,
      search,
    };
    let url = `/di/MM/metadata_mapping/get_element_mapping_table?diToken=${diToken}`;
    url = formatUrl(url);
    if (orderCol) {
      pageQuery.order = orderCol;
    }
    if (orderDir) {
      pageQuery.orderDir = orderDir;
    }
    return request(url, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Accept: 'application/json;charset=UTF-8',
      },
      method: 'POST',
      body: pageQuery,
    });
  }
  return {};
}

/**
 * 保存资产映射
 * @param id
 * @returns {Promise<void>}
 */
export async function saveElmntMapping(elmntMapping) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata_mapping/save_elmnt_mapping?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: elmntMapping,
  });
}

/**
 * 删除资产映射
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteElmntMapping(id) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata_mapping/${id}/delete_elmnt_mapping?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 获取第一层元数据
 * @returns {Promise<void>}
 */
export async function getFirstLevelElements() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/get_firstlevel_elements?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url);
}

/**
 * 获取指定元数据
 * @returns {Promise<void>}
 */
export async function getElementsByIds(elementIds) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/get_es_elements?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: elementIds,
  });
}

/**
 * 获取下级元数据
 * @returns {Promise<void>}
 */
export async function getElementsByOwner(ownerId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/get_elements_by_owner/${ownerId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 根据Id获取资产映射
 * @param assetMappingId
 * @returns {Promise<void>}
 */
export async function getElmntMappingById(assetMappingId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata_mapping/${assetMappingId}/get_element_mapping?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url);
}

/**
 * 快速配置映射关联
 * @param param
 * @returns {Promise<void>}
 */
export async function mappingQuickAddAssos(param) {
  const { assetMappingId, fromElmntId, toElmntId } = param;
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata_mapping/${assetMappingId}/${fromElmntId}/${toElmntId}/quick_add_asso?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 快速解除映射关联
 * @param param
 * @returns {Promise<void>}
 */
export async function mappingQuickRemoveAssos(param) {
  const { assetMappingId, fromElmntId, toElmntId } = param;
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata_mapping/${assetMappingId}/${fromElmntId}/${toElmntId}/quick_remove_asso?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 根据Id获取资产数据剖析
 * @param elementId
 * @returns {Promise<void>}
 */
export async function getElmntDiscById(elementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/${elementId}/get_element_discovery_by_element_id?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url);
}

/**
 * 获取指定元数据的指定类型的下级元数据信息
 * @param param
 * @returns {Promise<void>}
 */
export async function getOwnedElementsByType(param) {
  const { elementId, type } = param;
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/${elementId}/${type}/get_owned_elements?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url);
}

/**
 * 根据指定类型获取展现视图信息
 * @param types
 * @returns {Promise<void>}
 */
export async function getViewByTypes(types) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/view/get_view_by_types?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: types,
  });
}

/**
 * 根据指定视图下的内容
 * @param viewId
 * @returns {Promise<void>}
 */
export async function getViewContains(viewId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/view/get_view_contains/${viewId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 根据指定分组下的内容
 * @param groupId
 * @returns {Promise<void>}
 */
export async function getGroupContains(groupId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/view/get_group_contains/${groupId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 获取所有的元模型信息
 * 该方法为同步方法
 * @returns {Promise<void>}
 */
export async function getAllPackages() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metamodel/get_all_packages?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 保存或更新元数据内容
 * @param paramObject
 * @returns {Promise<void>}
 */
export async function saveOrUpdateElement(paramObject) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/view/save_or_update_element?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: paramObject,
  });
}

/**
 * 修改用户自定义描述
 * @param paramObject
 * @returns {Promise<void>}
 */
export async function updateElementCustomDescription(paramObject) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/update_element_custom_description?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: paramObject,
  });
}

/**
 * 删除元数据
 * @param elementId
 * @returns {Promise<void>}
 */
export async function deleteElement(elementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/${elementId}/delete_element?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 更改资产关联
 * @param associationList
 * @returns {Promise<unknown>}
 */
export async function changeElementAssociation(associationList) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/change_element_association?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: associationList,
  });
}

/**
 * 保存资产关联
 * @param newAssociation
 * @returns {Promise<unknown>}
 */
export async function saveElementAssociation(newAssociation) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/save_association?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: newAssociation,
  });
}

/**
 * 根据ingestionIds获取采集实例
 * @param ingestionId
 * @returns {Promise<unknown>}
 */
export async function getIngestionById(ingestionId) {
  const diToken = getSessionCache('diToken');
  const productId = getSessionCache('productId');
  let url = `/di/MM/ingestion/get_ingestion_info/${ingestionId}?diToken=${diToken}&productId=${productId}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 分页查询展示视图
 * @param searchParam
 * @returns {Promise<{}>}
 */
export async function getViewPageQuery(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { type, search, start, pageSize, orderCol, orderDir } = searchParam;
    let url = `/di/MM/view/get_view_table?diToken=${diToken}&type=${type}&start=${start}&length=${pageSize}`;
    if (search) {
      url += `&search=${search}`;
    }
    if (orderCol) {
      url += `&order_col=${orderCol}`;
    }
    if (orderDir) {
      url += `&order_dir=${orderDir}`;
    }
    url = formatUrl(url);
    return request(url, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Accept: 'application/json;charset=UTF-8',
      },
      method: 'GET',
    });
  }
  return {};
}

/**
 * 获取关联关系数据
 * @param elementId
 * @returns {Promise<unknown>}
 */
export async function analyseElementAssociation(elementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/analyse_element_association/${elementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 获取血缘/影响分析数据
 * @param centerElementIds
 * @returns {Promise<unknown>}
 */
export async function analyseElementLineage(centerElementIds) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/analyse_element_lineage?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: centerElementIds,
  });
}

/**
 * 分页查询校验规则
 * @param searchParam
 * @returns {Promise<{}>}
 */
export async function getValidateRulePageQuery(pageQuery) {
  const diToken = getSessionCache('diToken');
  if (pageQuery) {
    let url = `/di/MM/validate/get_rule_table?diToken=${diToken}`;
    url = formatUrl(url);
    return request(url, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Accept: 'application/json;charset=UTF-8',
      },
      method: 'POST',
      body: pageQuery,
    });
  }
  return {};
}

/**
 * 删除校验规则
 * @param ruleId
 * @returns {Promise<void>}
 */
export async function deleteValidateRule(ruleId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/validate/delete_validate_rule/${ruleId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 删除视图
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteView(id) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/view/delete_view/${id}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 删除分组
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteGroup(id) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/view/delete_group/${id}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 保存或更新展现视图
 * @param paramObject
 * @returns {Promise<void>}
 */
export async function saveView(info) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/view/save_view?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: info,
  });
}

/**
 * 保存或更新分组
 * @param paramObject
 * @returns {Promise<void>}
 */
export async function saveGroup(info) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/view/save_group?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: info,
  });
}

/**
 * 配置元数据同视图、分组之间的关联关系
 * @param param
 * @returns {Promise<{}>}
 */
export async function saveElementRef(param) {
  const diToken = getSessionCache('diToken');
  if (param) {
    const { elementId, parentId, parentType } = param;
    if (elementId && parentId && parentType) {
      let url = `/di/MM/view/save_element_ref?element_id=${elementId}&parent_id=${parentId}&parent_type=${parentType}&diToken=${diToken}`;
      url = formatUrl(url);
      return request(url, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Accept: 'application/json;charset=UTF-8',
        },
        method: 'POST',
      });
    }
  }
  return {};
}

/**
 * 全景图计算
 * @returns {Promise<unknown>}
 */
export async function analysePanoramaView() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/panorama/analysis_panorama?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 获取全景图
 * @returns {Promise<unknown>}
 */
export async function getPanoramaView() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/panorama/get_panorama?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 获取全景图下钻数据
 * @param drillData
 * @returns {Promise<unknown>}
 */
export async function panoramaViewDrillDown(drillData) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/panorama/${drillData.fromElementId}/${drillData.toElementId}/panorama_drill?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 保存全景图和位置信息
 * @param panorama
 * @returns {Promise<unknown>}
 */
export async function savePanorama(panorama) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/panorama/save_panorama?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: panorama,
  });
}

/**
 * 获取全景图计算缓存实例
 * @returns {Promise<Promise<*|{}|undefined>|Promise<unknown>>}
 */
export async function getPanoramaInstance() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/panorama/get_panorama_instance?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 获取最新的数据地图计算结果
 * @returns {Promise<any|{}|undefined|commander.ParseOptionsResult.unknown>}
 */
export async function getDataMapInstance() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/dataMap/getDataMapInstance?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 数据地图计算
 * @returns {Promise<any|{}|undefined|commander.ParseOptionsResult.unknown>}
 */
export async function analysisDataMap() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/dataMap/analysisDataMap?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 保存数据地图位置信息
 * @param panorama
 * @returns {Promise<unknown>}
 */
export async function saveDataMapPanorama(dataMap) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/dataMap/savePosition?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: dataMap,
  });
}

/**
 * 根据层级获取数据地图
 * @param nodeType 层级
 * @returns {Promise<any|{}|undefined|commander.ParseOptionsResult.unknown>}
 */
export async function getDataMapByNodeType(nodeType) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/dataMap/getDataMapByNodeType/${nodeType}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 获取某个被点击的数据地图节点的关联分析
 * @param info {
 *  nodeId:被点击的数据地图节点ID,
 *  classId:元模型ID
 *  parenNodeId:父节点ID
 * }
 * @returns {Promise<any|{}|undefined|commander.ParseOptionsResult.unknown>}
 */
export async function getNodeRelationDataMap(info) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/dataMap/getNodeRelationDataMap/${info.nodeId}/${info.elementType}/${info.parenNodeId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 获取某个被点击的数据地图连线的关联分析
 * @param info {
 *   fromElementId:出节点ID,
 *   toElementId:入节点ID,
 *   nodeType:层级
 * }
 * @returns {Promise<any|{}|undefined|commander.ParseOptionsResult.unknown>}
 */
export async function getNodeConnection(info) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/dataMap/getNodeConnection/${info.fromElementId}/${info.toElementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 获取数据地图节点类型
 * @returns {Promise<any|{}|undefined|commander.ParseOptionsResult.unknown>}
 */
export async function getDataMapTypeList() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/dataMap/getDataMapTypeList?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 获取某个被点击的数据地图节点的数据
 * @param elementId 被点击的数据地图节点ID
 * @returns {Promise<any|{}|undefined|commander.ParseOptionsResult.unknown>}
 */
export async function getDataMapAttributeListByElementId(elementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/dataMap/getDataMapAttributeListByElementId/${elementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 分页查询业务属性
 * @param searchParam
 * @returns {Promise<{}>}
 */
export async function getBusinessAttributePageQuery(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { currentPage, pageSize, orderCol, orderDir, search } = searchParam;
    const start = currentPage * pageSize;
    const pageQuery = {
      displayStart: start,
      displayLength: pageSize,
      search,
    };
    let url = `/di/MM/business_attribute/get_business_attribute_table?diToken=${diToken}`;
    if (orderCol) {
      pageQuery.order = orderCol;
    }
    if (orderDir) {
      pageQuery.orderDir = orderDir;
    }
    url = formatUrl(url);
    return request(url, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Accept: 'application/json;charset=UTF-8',
      },
      method: 'POST',
      body: pageQuery,
    });
  }
  return {};
}

/**
 * 保存业务属性
 * @param id
 * @returns {Promise<void>}
 */
export async function saveBusinessAttribute(businessAttribute) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/business_attribute/save_business_attribute?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: businessAttribute,
  });
}

/**
 * 删除业务属性
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteBusinessAttribute(id) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/business_attribute/${id}/delete_business_attribute?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 根据Id获取业务属性
 * @param assetMappingId
 * @returns {Promise<void>}
 */
export async function getBusinessAttribute(id) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/business_attribute/${id}/get_business_attribute?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url);
}

/**
 * 保存资产的业务属性
 * @param id
 * @returns {Promise<void>}
 */
export async function saveElmntBusinessAttr(elmntBusinessAttr) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/business_attribute/save_elmnt_business_attr?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: elmntBusinessAttr,
  });
}

/**
 * 删除资产的业务属性
 * @param elementId
 * @param businessAttrId
 * @returns {Promise<unknown>}
 */
export async function deleteElmntBusinessAttr(elementId, businessAttrId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/business_attribute/${elementId}/${businessAttrId}/delete_elmnt_business_attr?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 保存业务属性并配置资产的业务属性
 * @param param
 * @returns {Promise<void>}
 */
export async function saveBusinessAndElmntAttr(param) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/business_attribute/save_business_and_elmnt_attr?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: param,
  });
}

/**
 * 获取所有的业务属性
 * @returns {Promise<unknown>}
 */
export async function getAllBusinessAttributes() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/business_attribute/get_all_business_attributes?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url);
}

/**
 * 分页查询指标列表
 * @param searchParam
 * @returns {Promise<{}>}
 */
export async function getIndexPageQuery(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { currentPage, pageSize, orderCol, orderDir, search, category } = searchParam;
    const start = currentPage * pageSize;
    const pageQuery = {
      displayStart: start,
      displayLength: pageSize,
      search,
    };

    if (orderCol) {
      pageQuery.order = orderCol;
    }
    if (orderDir) {
      pageQuery.orderDir = orderDir;
    }

    let url = `/di/MM/index/indexes/paging_query?diToken=${diToken}&category=${category}`;
    url = formatUrl(url);
    return request(url, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Accept: 'application/json;charset=UTF-8',
      },
      method: 'POST',
      body: pageQuery,
    });
  }
  return {};
}

/**
 * 删除指标
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteIndex(id) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/index/${id}/delete?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 删除指标分类
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteIndexCategory(id) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/index/category/${id}/delete?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 根据Id获取指标
 * @param id
 * @returns {Promise<void>}
 */
export async function getIndexById(id) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/index/${id}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url);
}

/**
 * 根据分类获取值指标列表
 * @param id
 * @returns {Promise<void>}
 */
export async function getIndexByCategory(id) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/index/category/${id}/indexes?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url);
}

export async function getIndexCategoryList() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/index/getAllIndexCategoryList?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url);
}

/**
 * 保存指标
 * @param id
 * @returns {Promise<void>}
 */
export async function saveOrUpdateIndex(index) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/index/save?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: index,
  });
}

/**
 * 保存指标分类
 * @param id
 * @returns {Promise<void>}
 */
export async function saveOrUpdateIndexCategory(category) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/index/category/save?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: category,
  });
}

/**
 * 删除元数据同视图、分组之间的关联关系
 * @param param
 * @returns {Promise<{}>}
 */
export async function deleteElementRef(param) {
  const diToken = getSessionCache('diToken');
  if (param) {
    const { elementId, parentId, parentType } = param;
    if (elementId && parentId && parentType) {
      let url = `/di/MM/view/delete_element_ref?element_id=${elementId}&parent_id=${parentId}&parent_type=${parentType}&diToken=${diToken}`;
      url = formatUrl(url);
      return request(url, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Accept: 'application/json;charset=UTF-8',
        },
        method: 'POST',
      });
    }
  }
  return {};
}

/**
 * 保存校验规则信息
 * @param ruleInfo
 * @returns {Promise<void>}
 */
export async function saveValidateRule(ruleInfo) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/validate/save_validate_rule?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: ruleInfo,
  });
}

/**
 * 校验资产是否存在
 * @param assetId
 * @returns {Promise<void>}
 */
export async function testAssetExist(assetId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/test_element_exist?element_id=${assetId}&diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 执行校验
 * @param assetId
 * @returns {Promise<void>}
 */
export async function doValidate(restart) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/validate/start/${restart}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 获取质量校验实例
 * @returns {Promise<void>}
 */
export async function getValidateInstance() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/validate/get_validate_instance?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 获取资产的关联关系和关联资产
 * @param elementId
 * @param exceptAssociationList
 * @returns {Promise<unknown>}
 */
export async function getInitialElementsAndAssociations(elementId, exceptAssociationList) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/get_associate_elements/${elementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: exceptAssociationList,
  });
}

/**
 * 保存改变的关联关系
 * @param changedAssociations
 * @returns {Promise<unknown>}
 */
export async function changeAssociations(changedAssociations) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/multi_save_associations?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: changedAssociations,
  });
}

/**
 * 获取资产的历史数据
 * @param elementId
 * @returns {Promise<unknown>}
 */
export async function getHistoryElements(elementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/history/${elementId}/get_history_elements?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 资产历史比对
 * @param elementId
 * @param fromTime
 * @param toTime
 * @returns {Promise<unknown>}
 */
export async function compareHistoryElements(elementId, fromTime, toTime) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/history/${elementId}/${fromTime}/${toTime}/compare_history_elements?&diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 资产比对
 * @param fromElementId
 * @param toElementId
 * @returns {Promise<unknown>}
 */
export async function compareElements(fromElementId, toElementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/history/${fromElementId}/${toElementId}/compare_elements?&diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 历史元数据变更记录分页查询
 * @param pageQuery
 * @returns {Promise<unknown>}
 */
export async function getHistoryElementListByPageQuery(pageQuery) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/history/elements_select?&diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: pageQuery,
  });
}

export async function getAllClassList() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metamodel/get_all_class_list?&diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 移动视图
 * @param sourceId
 * @param targetId
 * @returns {Promise<*>}
 */
export async function moveView(sourceId, targetId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/view/move_view?source_id=${sourceId}&target_id=${targetId}&diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 根据Id获取资产的业务属性
 * @param elementId
 * @param fromTime
 * @param toTime
 * @returns {Promise<unknown>}
 */
export async function getAssetBusinessAttrsById(elementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/business_attribute/${elementId}/get_elmnt_business_attrs_by_id?&diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 根据Id获取资产的业务属性
 * @param elementId
 * @param fromTime
 * @param toTime
 * @returns {Promise<unknown>}
 */
export async function getElementDiscoveries(elementIds) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/get_element_discoverys_by_element_ids?&diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: elementIds,
  });
}

/**
 * 获取SchedulerUrl
 * @returns {Promise<unknown>}
 */
export async function getSchedulerPageUrl(realIp) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/get_scheduler_page_url?realIp=${realIp}&diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 获取与标准集关联的表资产集合
 * @param standardSetId
 * @returns {Promise<void>}
 */
export async function getStandardSetAssocTableElmnts(standardSetId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/${standardSetId}/get_assoc_tables?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 删除关联关系
 * @param association
 * @returns {Promise<void>}
 */
export async function deleteSetAndTableAssociation(association) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/delete_set_table_assoc?&diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: association,
  });
}

/**
 * 获取与标准集关联的表校验实例
 * @param standardSetId
 * @returns {Promise<void>}
 */
export async function getTableValidateInstances(standardSetId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/get_table_validate_instances?standardSetId=${standardSetId}&diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 获取与标准集匹配的表集合
 * @param standardSetId
 * @returns {Promise<void>}
 */
export async function getAutoMatchTableElmnts(standardSetId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/${standardSetId}/auto_get_match_tables?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 获取符合通配符的表
 * @param standardSetId
 * @param tableNameRegExps
 * @returns {Promise<void>}
 */
export async function getTableElmntsByRegExp(standardSetId, tableNameRegExps) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/${standardSetId}/get_tables_by_reg?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: tableNameRegExps,
  });
}

/**
 * 添加标准集-表的关联关系
 * @param standardSetId
 * @param selectedRowKeys
 * @returns {Promise<void>}
 */
export async function addSetAndTableAssociation(standardSetId, selectedRowKeys) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/${standardSetId}/add_set_table_assocs?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: selectedRowKeys,
  });
}

/**
 * 开启表数据校验
 * @param standardSetId
 * @param tableElementId
 * @returns {Promise<void>}
 */
export async function tableValidate(standardSetId, tableElementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/validate/${standardSetId}/${tableElementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 停止表数据校验
 * @param standardSetId
 * @param tableElementId
 * @returns {Promise<void>}
 */
export async function stopTableValidate(standardSetId, tableElementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/stop_validate/${standardSetId}/${tableElementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 获取数据标准和列的关联关系
 * @param association
 * @returns {Promise<void>}
 */
export async function getStandardAndColumnAssocs(association) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/get_standard_column_assocs?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: association,
  });
}

/**
 * 获取数据质量运行监控页面Url
 * @param standardSetId
 * @param tableElementId
 * @returns {Promise<*>}
 */
export async function getInstancePageUrl(standardSetId, tableElementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/get_instance_page_url/${standardSetId}/${tableElementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 获取数据质量运行监控页面Url
 * @param modelOId
 * @param dataSourceId
 * @returns {Promise<*>}
 */
export async function getGatherIssueDqViewUrl(modelOId, dataSourceId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/getGatherIssueDqViewUrl/${modelOId}/${dataSourceId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 获取指定的表数据校验实例
 * @param standardSetId
 * @param tableElementId
 * @returns {Promise<*>}
 */
export async function getTableValidateInstance(standardSetId, tableElementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/get_table_validate_instance/${standardSetId}/${tableElementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 添加表校验的执行计划
 * @param standardSetId
 * @param tableElementId
 * @param cronInfo
 * @returns {Promise<void>}
 */
export async function addScheduleConfig(standardSetId, tableElementId, cronInfo) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/add_schedule_config/${standardSetId}/${tableElementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: cronInfo,
  });
}

/**
 * 移除表校验的执行计划
 * @param standardSetId
 * @param tableElementId
 * @returns {Promise<void>}
 */
export async function removeScheduleConfig(standardSetId, tableElementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/remove_schedule_config/${standardSetId}/${tableElementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 获取问题统计信息
 * @returns {Promise<void>}
 */
export async function getIssueStatisticalResult() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/validate/get_issue_statistical_result?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 取消发布数据指标
 * @returns {Promise<void>}
 */
export async function updateIndexUnPublished(indexIds) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/index/_update_unpublished?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: indexIds,
  });
}

/**
 * 发布数据指标
 * @returns {Promise<void>}
 */
export async function updateIndexPublished(indexIds) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/index/_update_published?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: indexIds,
  });
}

/**
 * 发布数据指标
 * @returns {Promise<void>}
 */
export async function syncEvaluateModel(standardSetId, tableId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/standard_validate/sync_model/${standardSetId}/${tableId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 获取问题统计信息
 * @returns {Promise<void>}
 */
export async function getAllDataOwnerUsers() {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/business_attribute/get_all_data_owner_users?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 获取问题统计信息
 * @returns {Promise<void>}
 */
export async function getElmntBusinessAttr(elementId, businessAttrId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/business_attribute/${elementId}/${businessAttrId}/get_elmnt_business_attr?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 获取映射的下级资产
 * @param ownedElementId
 * @param direction
 * @param searchValue
 * @returns {Promise<Promise<*|{}|undefined>|Promise<unknown>>}
 */
export async function getMappingOwnedElements(ownerId, direction, searchValue) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata_mapping/${ownerId}/${direction}/get_owned_elements?diToken=${diToken}`;
  url = formatUrl(url);
  const searchParam = {
    search: searchValue,
    type: null,
    category: null,
    params: null,
    start: 0,
    end: 0,
  };
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: searchParam,
  });
}

/**
 * 数据预览
 * @param previewQueryParam
 * @returns {Promise<Promise<*|{}|undefined>|Promise<unknown>>}
 */
export async function previewData(previewQueryParam) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/preview_data?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: previewQueryParam,
  });
}

export async function getSqlSeparator(dataSourceId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/getSqlSeparator/${dataSourceId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

export async function getElementRepeatDegreeByElementId(elementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/getElementRepeatDegreeByElementId/${elementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

export async function getElementRepeatList(fromElementId, toElementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/getElementRepeatList/${fromElementId}/${toElementId}?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 下载重复度分析
 * @param {*} ids
 */
export async function downloadElementRepeatDegreeByElementId(elementId = {}) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/downloadElementRepeatDegreeByElementId?diToken=${diToken}`;
  url = formatUrl(url);
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      elementId,
    },
    responseType: 'blob', // 必须注明返回二进制流
  });
}
