import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 查询所有的域信息
 */
export async function queryAllDomainInfo() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/domain/getDomainInfoList?diToken=${diToken}`);
}

/**
 * 查询所有的域信息
 */
export async function queryDomainList() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/domain/getDomainList?diToken=${diToken}`);
}

/**
 * 新增或更新domain
 */
export async function saveOrUpdateDomain(domain) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/domain/saveOrUpdateDomain?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      domain,
      method: 'post',
    },
  });
}

/**
 * 根据domainId查询域信息
 * @param {*} domainId
 */
export async function queryDomain(domainId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/domain/getDomainById?domainId=${domainId}&diToken=${diToken}`);
}

/**
 * 根据domainId删除域信息
 * @param {*} domainId
 */
export async function deleteDomain(domainId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/domain/deleteDomain?domainId=${domainId}&diToken=${diToken}`);
}
