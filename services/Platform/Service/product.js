import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 查询全部基础产品列表
 */
export async function queryAllBaseProduct() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/product/getAllBaseProduct?diToken=${diToken}`);
}

/**
 * 分页查询产品基础信息
 * @param {*} currentPage
 * @param {*} pageSize
 * @param {*} orderCol
 * @param {*} orderDir
 * @param {*} condition
 */
export async function queryPagingBaseProduct(currentPage, pageSize, orderCol, orderDir, condition) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/product/getPagingBaseProduct?diToken=${diToken}&currentPage=${currentPage}&pageSize=${pageSize}&orderCol=${orderCol}&orderDir=${orderDir}&condition=${condition}`
  );
}

/**
 * 根据code查询基础产品信息
 */
export async function queryBaseProductByCode(code) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/product/getBaseProductByCode?code=${code}&diToken=${diToken}`);
}

export async function saveMenuRecord(userMenuRecord) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/menu/saveUserMenuRecord?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: userMenuRecord,
  });
}

export async function getUserMenuRecordByUserId() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/menu/getUserMenuRecord?diToken=${diToken}`);
}

/**
 * 新增或更新baseProduct
 */
export async function saveOrUpdateBaseProduct(baseProduct) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/product/saveOrUpdateBaseProduct?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      baseProduct,
      method: 'post',
    },
  });
}

/**
 * 根据服务id删除基础服务信息
 * @param {*} baseProductId
 */
export async function deleteBaseProduct(baseProductId) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/product/deleteBaseProduct?baseProductId=${baseProductId}&diToken=${diToken}`
  );
}

/**
 * 通过code加载所有的产品信息
 */
export async function queryProductList() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/product/getProductList?diToken=${diToken}`);
}

/**
 * 新增或更新product
 */
export async function saveOrUpdateProduct(product) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/product/saveOrUpdateProduct?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      product,
      method: 'post',
    },
  });
}

/**
 * 根据服务id删除服务
 * @param {*} productId
 */
export async function deleteProduct(productId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/product/deleteProduct?productId=${productId}&diToken=${diToken}`);
}

/**
 * 查询开通的产品菜单信息
 */
export async function queryProductMenu() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/product/getProductMenu?diToken=${diToken}`);
}

/**
 * 根据ID查询产品信息
 * @param {*} productId
 */
export async function queryProductById(productId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/product/getProductById?diToken=${diToken}&productId=${productId}`);
}

/**
 * 根据域id获取属于本域的产品列表
 * @param {*} domainId
 */
export async function queryProductsByDomainId(domainId) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/product/getProductsByDomainId?diToken=${diToken}&domainId=${domainId}`
  );
}

/**
 * 根据域id和产品code获取属于本域的产品列表
 * @param {*} domainId
 * @param {*} code
 */
export async function queryProductsByDomainIdAndCode(domainId, code) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/product/getProductsByDomainIdAndCode?diToken=${diToken}&domainId=${domainId}&code=${code}`
  );
}
