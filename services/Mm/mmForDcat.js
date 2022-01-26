import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 保存Dcat推送的数据源信息
 * @param {*} datasourceJson
 */
export async function saveDiDatasource(datasourceJson) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/for_dcat/save_di_datasource?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: datasourceJson,
  });
}

/**
 * 保存DCAT平台创建的采集配置
 * @param {*} ingestionConfigJson
 */
export async function saveDcatIngestionConfig(ingestionConfigJson) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/mmService/for_dcat/save_dcat_ingestion_config?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: ingestionConfigJson,
    }
  );
}

/**
 * 获取指定数据库数据源下的模式信息
 * @param {*} dataSourceJson
 */
export async function getSchemaByDbsource(dataSourceJson) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/for_dcat/get_schema_by_dbsource?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: dataSourceJson,
  });
}

/**
 * 启动采集任务
 * @param {*} ingestionId
 */
export async function ingestionSelectRun(ingestionId) {
  const diToken = getSessionCache('diToken');
  const productId = getSessionCache('productId');
  return request(`/di/DataCatalog/mmService/for_dcat/${ingestionId}/run?productId=${productId}&diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: '',
  });
}

/**
 * 更新sql资产
 * @param {*} elements
 */
export async function updateSqlElement(elements) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/mmService/for_dcat/update_sql_element?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: elements,
  });
}

/**
 * 删除sql资产
 * @param {*} elementId
 */
export async function deleteSqlElement(elementId) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/mmService/for_dcat/${elementId}/delete_sql_element?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: '',
    }
  );
}
