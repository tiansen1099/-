import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 查询所有的license信息
 */
export async function getAllLicense() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/license/getAllLicense?diToken=${diToken}`);
}

/**
 * 移除license
 * @param {*} licenseId
 */
export async function deleteLicense(licenseId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/license/deleteLicense?diToken=${diToken}&licenseId=${licenseId}`);
}
