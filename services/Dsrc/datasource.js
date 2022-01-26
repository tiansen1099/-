import request, { requestCustom } from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 分页查询数据源
 * @param {*} searchParam
 */
export async function dataSourcesSearch(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const {
      currentPage,
      pageSize,
      orderCol,
      orderDir,
      searchValue,
      searchColumn,
      conditions,
    } = searchParam;
    const pagingParam = {
      currentPage,
      pageSize,
      orderCol,
      orderDir,
      searchValue,
      searchColumn,
      conditions,
    };
    return request(`/di/DataSource/datasource/pages?diToken=${diToken}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: pagingParam,
    });
  }
  return {};
}

/**
 * 获取分类列表
 */
export async function dataSourcesGetAll() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataSource/datasource/get_all?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 保存数据源
 */
export async function dataSourcesSave(datasource) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataSource/datasource/save?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: datasource,
  });
}

/**
 * 根据id查询数据源
 * @param {*} id
 */
export async function dataSourcesGet(id) {
  const diToken = getSessionCache('diToken');
  return requestCustom(`/di/DataSource/datasource/detail?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: id,
  });
}

/**
 * 测试数据源连接情况
 * @param {*} datasource
 */
export async function dataSourcesTestConnection(datasource) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataSource/datasource/test_connection?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: datasource,
  });
}

/**
 * 删除数据源
 * @param {*} ids
 */
export async function dataSourcesDelete(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataSource/datasource/delete?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

/**
 * 下载数据源
 * @param {*} ids
 */
export async function dataSourcesDownload(params = {}) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataSource/datasource/download?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
    responseType: 'blob', // 必须注明返回二进制流
  });
}

/**
 * 按类型获取全部数据源连接
 * @param {*} types
 */
export async function getAllDataSourcesByTypes(types) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataSource/datasource/get_by_types?diToken=${diToken}`, {
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
export async function getAllDataSourcesByCategorys(categorys) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataSource/datasource/get_by_categories?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: categorys,
  });
}

/**
 * 保存数据源分组
 */
export async function dataSourceGroupSave(datasourceGroup) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataSource/datasource/save_group?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: datasourceGroup,
  });
}

/**
 * 删除数据源分组
 * @param {*} ids
 */
export async function dataSourceGroupsDelete(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataSource/datasource/delete_groups?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

/**
 * 获取数据源分组列表
 */
export async function getDataSourceGroups() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataSource/datasource/get_all_groups?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 保存数据源配置
 */
export async function dataSourcesConfigSave(datasourceConfig) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataSource/datasource/save_config?diToken=${diToken}`, {
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
export async function dataSourcesConfigGet(dataSourceId) {
  const diToken = getSessionCache('diToken');
  const productCode = getSessionCache('productCode');
  return request(
    `/di/DataSource/datasource/get_info_and_config?dataSourceId=${dataSourceId}&productCode=${productCode}&diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'GET',
    }
  );
}
