import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 查询前端地址配置
 */
export async function queryFontEndPath() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/config/getFontEndPath?diToken=${diToken}`);
}

/**
 * 查询产品种类
 */
export async function queryProductType() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/config/getProductTypeList?diToken=${diToken}`);
}

/**
 * 查询产品Code
 */
export async function queryProductCode() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/config/getProductCodeList?diToken=${diToken}`);
}

/**
 * 查询产品Code
 */
export async function queryFileLimit() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/config/getSystemConfigFileLimit?diToken=${diToken}`);
}

/**
 * 根据产品关键字查询服务地址
 */
export async function queryProductConfigByKey(productKey) {
  const diToken = getSessionCache('diToken');
  return request(`/di/config/getProductConfigByKey?diToken=${diToken}&key=${productKey}`);
}

/**
 * 系统配置-查询
 */
export async function getSystemConfigList() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/config/getSystemConfigList?diToken=${diToken}`);
}

/**
 * 系统配置-更新
 */
export async function saveOrUpdateSystemConfig(params) {
  const diToken = getSessionCache('diToken');
  const url = `/di/service/config/saveOrUpdateSystemConfig?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
    body: params,
  });
}
