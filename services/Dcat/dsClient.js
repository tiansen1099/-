import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 调用ds接口，创建ds资源
 * @param {*} serviceContainer
 */
export async function createDsResources(serviceContainer) {
  const diToken = getSessionCache('diToken');
  const productCode = getSessionCache('productCode');
  return request(`/di/DataCatalog/dcat/ds/resources_create?productCode=${productCode}&diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: serviceContainer,
  });
}

/**
 * 调用ds接口，删除Ds资源
 *
 * @param {*} ids
 */
export async function deleteDsResources(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/ds/resources_remove?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}
