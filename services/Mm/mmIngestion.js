import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 验证数据源连接
 * @param {*} dataSource
 */
export async function ingestionTestConnection(dataSource) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/ingestion/testConnection?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: dataSource,
  });
}

/**
 * 获取数据库schema
 * @param {*} dataSource
 */
export async function ingestionGetDatabaseSchemas(dataSource) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/ingestion/getDatabaseSchemas?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: dataSource,
  });
}

/**
 * 查询采集执行结果
 * @param {*} pageQuery
 */
export async function pagingIngestionInstances(pageQuery) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/ingestion/get_paging_ingestion_instances?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: pageQuery,
  });
}

/**
 * 根据id获取采集配置全部信息
 * @param {*} ingestionId
 */
export async function getIngestionConfig(ingestionId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/ingestion/get_ingestion_info/${ingestionId}?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
    ingestionId,
  });
}

/**
 * 根据采集id集合查询采集任务实例集合信息
 */
export async function getIngestionInstancesByIds(ingestionIds) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/ingestion/get_ingestioninstance_by_ids?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ingestionIds,
  });
}
