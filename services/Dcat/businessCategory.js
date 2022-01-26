import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getBusinessCategory(id) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/business_categories/_get?diToken=${diToken}&id=${id}`;
  return request(postUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

export async function isCategoryInUse(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/business_categories/_isCategoryInUse?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: params,
  });
}

/**
 * 保存/更新业务分类
 * @param {*} category
 */
export async function saveOrUpdateBusinessCategory(businessCategory) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/business_categories/_save?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: businessCategory,
  });
}

/**
 * 删除业务分类
 * @param {*} category
 */
export async function deleteBusinessCategoryByIds(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/business_categories/_delete?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

export async function getBusinessCategoriesByType(type) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/business_categories/_get_list/${type}?diToken=${diToken}`;
  return request(postUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}
