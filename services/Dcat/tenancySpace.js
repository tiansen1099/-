import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 分页查询数据源
 * @param {*} searchParam
 */
export async function tenancySpaceSearch(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { currentPage, pageSize } = searchParam;
    const start = currentPage * pageSize;
    const searchingParam = searchParam;
    searchingParam.start = start;
    searchingParam.length = pageSize;
    return request(`/di/DataCatalog/dcat/datasourceTenancySpace/search?diToken=${diToken}`, {
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
 * 根据dbType获取
 * @param id
 * @returns {Promise<void>}
 */
export async function getTenancySpaceByDBType(dbType) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancySpace/selectByDBType?type=${dbType}&diToken=${diToken}`;
  return request(url, {
    method: 'GET',
  });
}

/**
 * 注销
 * @param id
 * @returns {Promise<void>}
 */
export async function disableTenancySpace(id) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancySpace/disable/${id}?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
  });
}

/**
 * 根据Id获取
 * @param id
 * @returns {Promise<void>}
 */
export async function getTenancySpace(id) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancySpace/${id}?diToken=${diToken}`;
  return request(url, {
    method: 'GET',
  });
}

/**
 * 测试连接
 * @param tenancySpace
 * @returns {Promise<void>}
 */
export async function testConnection(tenancySpace) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancySpace/testConnection?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
    body: tenancySpace,
  });
}

/**
 * 保存空间
 * @param tenancySpace
 * @returns {Promise<void>}
 */
export async function saveTenancySpace(tenancySpace) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancySpace?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
    body: tenancySpace,
  });
}

/**
 * 申请空间详情
 * @param payload
 * @returns {Promise<void>}
 */
export async function application(payload) {
  const diToken = getSessionCache('diToken');
  const { id } = payload;
  const url = `/di/DataCatalog/dcat/datasourceTenancy/${id}?diToken=${diToken}`;
  return request(url);
}

/**
 * 申请空间
 * @param payload
 * @returns {Promise<void>}
 */
export async function applyTenancySpace(payload) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/datasourceTenancy/apply?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
    body: payload,
  });
}
