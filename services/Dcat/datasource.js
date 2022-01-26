import request, { requestCustom } from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 分页查询数据源
 * @param {*} searchParam
 */
export async function dataSourcesSearch(searchParam) {
  const diToken = getSessionCache('diToken');
  const productCode = getSessionCache('productCode');
  if (searchParam) {
    const { currentPage, pageSize } = searchParam;
    const searchingParam = searchParam;
    searchingParam.start = currentPage;
    searchingParam.length = pageSize;
    return request(`/di/DataCatalog/dcat/datasources/_di_ds_search?productCode=${productCode}&diToken=${diToken}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: searchingParam,
    });
  }
  return {};
}

/**
 * 获取分类列表
 */
export async function dataSourcesGetAll() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/datasources/_getAll?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: '',
  });
}

/**
 * 测试数据源连接情况
 * @param {*} datasource
 */
export async function dataSourcesTestConnection(datasource) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/datasources/_diTestConnection?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: datasource,
  });
}

/**
 * 保存数据源
 */
export async function dataSourcesSave(datasource) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/datasources/_diSave?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: datasource,
  });
}

/**
 * 保存数据源配置
 */
export async function dataSourcesConfigSave(datasourceConfig) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/datasources/_di_ds_save?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: datasourceConfig,
  });
}

/**
 * 根据id查询数据源
 * @param {*} id
 */
export async function dataSourcesGet(id) {
  const diToken = getSessionCache('diToken');
  const productCode = getSessionCache('productCode');
  return requestCustom(`/di/DataCatalog/dcat/datasources/_di_ds_get?productCode=${productCode}&diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: id,
  });
}

/**
 * 删除数据源
 * @param {*} ids
 */
export async function dataSourcesDelete(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/datasources/_delete?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

/**
 * 按类型获取全部数据源连接
 * @param {*} types
 */
export async function getAllDatasourcesByTypes(types) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/datasources/_getAll_by_types?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: types,
  });
}

/**
 * 按类别获取全部数据源连接
 * @param {*} categorys
 */
export async function getAllDatasourcesByCategorys(categorys) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/datasources/_getAll_by_categorys?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: categorys,
  });
}
