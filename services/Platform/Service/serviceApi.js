import request from '@/utils/Platform/request';

/**
 * 查询产品配置
 * @param {*} code
 */
export async function getSystemConfigByCode(code) {
  return request(`/di/service/api/config/getSystemConfigByCode?code=${code}`);
}

/**
 * 查询机构
 */
export async function getAllOrganization() {
  return request(`/di/service/api/organization/getAllOrganization`);
}
