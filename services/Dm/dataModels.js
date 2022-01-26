import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 分页查询数据模型
 * @param searchParam
 */
export async function getDataModelPageQuery(searchParam) {
  if (searchParam) {
    const diToken = getSessionCache('diToken');
    const { currentPage, pageSize, orderCol, orderDir, searchValue, searchColumn } = searchParam;
    const pagingParam = {
      currentPage,
      pageSize,
      orderCol,
      orderDir,
      searchValue,
      searchColumn,
    };
    const searchUrl = `/di/DataModel/data_model/models/pages?diToken=${diToken}`;
    return request(searchUrl, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Accept: 'application/json;charset=UTF-8',
      },
      method: 'POST',
      body: pagingParam,
    });
  }
  return {};
}

/**
 * 删除数据模型
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteDataModel(id) {
  const diToken = getSessionCache('diToken');
  const searchUrl = `/di/DataModel/data_model/model/delete?diToken=${diToken}&id=${id}`;
  return request(searchUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
  });
}

/**
 * 保存数据模型
 * @param dataModel
 * @returns {Promise<void>}
 */
export async function saveDataModel(dataModel) {
  const diToken = getSessionCache('diToken');
  const searchUrl = `/di/DataModel/data_model/model/save?diToken=${diToken}`;
  return request(searchUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: dataModel,
  });
}

/**
 * 更新数据模型
 * @param dataModel
 * @returns {Promise<void>}
 */
export async function updateDataModel(dataModelInfo) {
  const diToken = getSessionCache('diToken');
  const searchUrl = `/di/DataModel/data_model/model/update?diToken=${diToken}`;
  return request(searchUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: dataModelInfo,
  });
}

/**
 * 根据Id获取数据模型
 * @param id
 * @returns {Promise<void>}
 */
export async function getDataModel(dataModelId) {
  const diToken = getSessionCache('diToken');
  const searchUrl = `/di/DataModel/data_model/model/detail?diToken=${diToken}&id=${dataModelId}`;
  return request(searchUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}

/**
 * 根据Id获取数据模型
 * @param id
 * @returns {Promise<void>}
 */
export async function getStandardSets() {
  const diToken = getSessionCache('diToken');
  const searchUrl = `/di/DataModel/dsdService/dcat/dataentitys/get_all_standard_sets?diToken=${diToken}`;
  return request(searchUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json;charset=UTF-8',
    },
    method: 'GET',
  });
}
