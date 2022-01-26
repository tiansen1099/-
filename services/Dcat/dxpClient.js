import request, { requestCustom } from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 调用dxp接口获取sql元数据信息
 * @param {*} dsId
 * @param {*} expression
 */
export async function getSQLMetadata(dsId, expression) {
  const diToken = getSessionCache('diToken');
  return requestCustom(`/di/DataCatalog/dcat/dxp/getSQLMetadata?diToken=${diToken}&dsId=${dsId}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: expression,
  });
}

/**
 * 调用dxp接口，保存数据源
 * @param {*} dataSource
 */
export async function saveOrUpdateDataSource(dataSource) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/dxp/saveOrUpdateDataSource?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: dataSource,
  });
}

/**
 * 调用dxp接口，获取系统变量
 */
export async function getAllSystemVariables() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/dxp/getAllSystemVariables?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {},
  });
}

/**
 * 调用dxp接口，测试前置条件
 */
export async function testSqlCondition(condtionTestDTO) {
  const diToken = getSessionCache('diToken');
  const productCode = getSessionCache('productCode');
  return request(`/di/DataCatalog/dcat/dxp/testSqlCondition?productCode=${productCode}&diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: condtionTestDTO,
  });
}

/**
 * 获取管理DXP任务
 * @param {*} searchParam
 */
export async function dxpTaskSearch(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { currentPage, pageSize, orderCol, orderDir, conditions } = searchParam;
    const start = currentPage * pageSize;
    let searchUrl = `/di/DataCatalog/dcat/dxp/getDxpTaskInstances?diToken=${diToken}&start=${start}&length=${pageSize}`;
    if (orderCol) {
      searchUrl += `&order_col=${orderCol}`;
    }
    if (orderDir) {
      searchUrl += `&order_dir=${orderDir}`;
    }
    return request(searchUrl, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: conditions,
    });
  }
  return {};
}

export async function disableTask(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/dxp/_disable?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

export async function getDataCount(sql, datasourceId) {
  const diToken = getSessionCache('diToken');
  const productCode = getSessionCache('productCode');
  return request(
    `/di/DataCatalog/dcat/dxp/getDataCount?datasourceId=${datasourceId}&productCode=${productCode}&diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: sql,
    }
  );
}

export async function enableTask(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/dxp/_enable?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

export async function startTask(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/dxp/_start?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}
