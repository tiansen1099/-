import request, { requestCustom } from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getCatalogsStatistic() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/catalogs/_statistics?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 查询目录树
 */
export async function getCatalogTree(type) {
  const diToken = getSessionCache('diToken');
  return requestCustom(`/di/DataCatalog/dcat/catalogs/_getCatalogTree?&diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: type,
  });
}

/**
 * 保存/更新目录
 * @param {*} catalog
 */
export async function saveOrUpdateCatalog(catalog) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/catalogs/_save?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: catalog,
  });
}

/**
 * 删除目录
 * @param {*} catalog
 */
export async function deleteCatalogsByIds(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/catalogs/_delete?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

/**
 * 查询单条目录
 * @param {*} id
 */
export async function getCatalogDetailById(id) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/catalogs/_get?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: id,
  });
}
