import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 获取分类列表
 */
export default async function hbaseDataCount(dataSetName) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/data/hbaseDataCount/${dataSetName}?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}
