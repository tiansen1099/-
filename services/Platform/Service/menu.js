import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 查询产品menu
 * @param {*} productId
 */
export async function queryMenuDto(productId) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/menu/getMenuDtosByProductId?diToken=${diToken}&productId=${productId}`
  );
}

/**
 * 根据产品id和menuUri获取对应的menu信息
 * @param {*} productId
 * @param {*} menuUri
 */
export async function queryMenuByProductIdAndMenuUri(productId, menuUri) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/menu/getProductMenuByProductIdAndMenuUri?diToken=${diToken}&productId=${productId}&menuUri=${menuUri}`
  );
}

/**
 * 查询产品基础menu
 * @param {*} productId
 */
export async function queryBaseMenuDtosByProductCode(productCode) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/menu/getBaseMenuDtosByProductCode?diToken=${diToken}&productCode=${productCode}`
  );
}

/**
 * 根据主键查询基础菜单
 */
export async function queryBaseMenuById(baseMenuId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/menu/getBaseMenuById?diToken=${diToken}&baseMenuId=${baseMenuId}`);
}

/**
 * 保存菜单信息
 * @param {*} baseMenu
 */
export async function saveOrUpdateMenu(baseMenu) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/menu/saveOrUpdateMenu?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      baseMenu,
      method: 'post',
    },
  });
}
