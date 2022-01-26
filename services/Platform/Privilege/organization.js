import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getOrganization() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/organization/getAll?diToken=${diToken}`);
}

export async function getOrganizationDetail(keyValue) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/organization/getOne?organizationId=${keyValue}&diToken=${diToken}`);
}

export async function deleteOrganizationById(keyValue) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/organization/delOne?organizationId=${keyValue}&diToken=${diToken}`);
}

export async function saveOrUpdateOrganization(organization) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/organization/saveOrUpdateOrganization?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      organization,
      method: 'post',
    },
  });
}

export async function getAllOrganizationList() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/api/organization/getAllOrganization?diToken=${diToken}`);
}

export async function getOrganizationSystemList(organizationId) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/api/organization/getOrganizationSystemList?organizationId=${organizationId}&diToken=${diToken}`
  );
}

export async function getOrganizationRegionList(parentId) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/api/organization/getOrganizationRegionList?parentId=${parentId}&diToken=${diToken}`
  );
}

export async function getOrganizationRegionListById(id) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/organization/getOrganizationRegionListById?id=${id}&diToken=${diToken}`
  );
}

export async function getOrganizationByCode(code) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/api/organization/getOrganizationByCode?code=${code}&diToken=${diToken}`
  );
}
