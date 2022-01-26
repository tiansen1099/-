import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 检索metadata数据
 */
export async function metadataSearch(searchingParam) {
  const diToken = getSessionCache('diToken');
  if (searchingParam) {
    const {
      currentPage,
      pageSize,
      orderCol,
      orderDir,
      search,
      conditions,
      showAggregrations,
      showHighlight,
      deserializeToElement,
      showAssociations,
    } = searchingParam;
    const start = currentPage * pageSize;
    const searchParam = {};
    searchParam.start = start;
    searchParam.pageSize = pageSize;
    searchParam.orderBy = orderCol;
    searchParam.orderDir = orderDir;

    searchParam.search = search;
    searchParam.searchConditions = conditions;
    searchParam.showAggregrations = showAggregrations;
    searchParam.showHighlight = showHighlight;
    searchParam.deserializeToElement = deserializeToElement;
    searchParam.showMount = true;
    searchParam.showAssociations = showAssociations;

    return request(`/di/DataCatalog/mmService/metadata/search?diToken=${diToken}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: searchParam,
    });
  }
  return {};
}

/**
 * 获取指定的Element信息
 * @param {*} elementIds
 */
export async function metadataGetEsElements(elementIds) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/metadata/get_es_elements?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: elementIds,
  });
}

/**
 * 获取指定的Element
 * @param {} elementId
 */
export async function metadataGetElement(elementId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/metadata/${elementId}/get_element?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
    elementId,
  });
}

/**
 * 获取指定的Element(批量)
 * @param {} elementId
 */
export async function metadataGetElements(elementIds) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/metadata/get_elements?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: elementIds,
  });
}

export async function metadataGetOwnedElements(elementId, ownedElementType) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/mmService/metadata/${elementId}/${ownedElementType}/get_owned_elements?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'GET',
      elementId,
      ownedElementType,
    }
  );
}

/**
 * 批量删除MM资产
 */
export async function metadataDeleteElements(elementIds) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/metadata/delete_elements?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: elementIds,
  });
}

/**
 * 批量保存MM资产
 * @param {*} elements
 */
export async function metadataSaveElements(elements) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/metadata/save_elements?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: elements,
  });
}

/**
 * 批量保存MM资产
 * @param {*} elements
 */
export async function metadataGetOwnedElementsByIDsAndTypes(elementIdAndType) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/mmService/metadata/get_owned_elements_of_elements?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: elementIdAndType,
    }
  );
}

/**
 * 获取指定的Element(批量)
 * @param {} elementId
 */
export async function getOwnedElementsOfElemnts(classId) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/mmService/metadata/${classId}/get_element_by_class_id?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: classId,
    }
  );
}
