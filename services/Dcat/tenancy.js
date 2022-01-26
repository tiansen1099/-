import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 分页查询数据源
 * @param {*} searchParam
 */
export async function tenancySearch(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { currentPage, pageSize } = searchParam;
    const start = currentPage * pageSize;
    const searchingParam = searchParam;
    searchingParam.start = start;
    searchingParam.length = pageSize;
    return request(`/di/DataCatalog/dcat/datasourceTenancy/search?diToken=${diToken}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: searchingParam,
    });
  }
  return {};
}

/**
 * 注销
 * @param id
 * @returns {Promise<void>}
 */
export async function disable(disableBody) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancy/disable?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
    body: disableBody,
  });
}

/**
 * 重置密码
 * @param id
 * @returns {Promise<void>}
 */
export async function resetPassword(bodyParam) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancy/resetPassword?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
    body: bodyParam,
  });
}

/**
 * 根据Id获取
 * @param id
 * @returns {Promise<void>}
 */
export async function getTenancy(id) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancy/${id}?diToken=${diToken}`;
  return request(url, {
    method: 'GET',
  });
}

/**
 * 创建空间
 * @param tenancy
 * @returns {Promise<void>}
 */
export async function createTenancy(param) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancy/create?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
    body: param,
  });
}
/**
 * 空间变更
 * @param tenancy
 * @returns {Promise<void>}
 */
export async function changeTenancy(param) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancy/change?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
    body: param,
  });
}

/**
 * 查看空间连接信息
 * @param id
 * @returns {Promise<void>}
 */
export async function getConnection(datasourceId) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancy/connection?diToken=${diToken}&datasourceId=${datasourceId}`;
  return request(url, {
    method: 'GET',
  });
}
