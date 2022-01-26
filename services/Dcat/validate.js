import request, { requestCustom } from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getOrgValidateSystemMap(codes) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/validate_system/_get_org_system_map?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: codes,
  });
}

export async function saveOrUpdateValidateSystem(orgCode, url) {
  const diToken = getSessionCache('diToken');
  return requestCustom(`/di/DataCatalog/dcat/validate_system/_save?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: [url, orgCode],
  });
}

export async function testConnection(url) {
  const diToken = getSessionCache('diToken');
  return requestCustom(`/di/DataCatalog/dcat/validate_system/_test_connection?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: url,
  });
}

export async function getPagingValidateRecords(start, length, orderCol, orderDir, conditions) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/validate/_search?diToken=${diToken}&start=${start}&length=${length}&order_col=${orderCol}&order_dir=${orderDir}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: conditions,
    }
  );
}
export async function getValidateRecordDetail(id) {
  const diToken = getSessionCache('diToken');
  return requestCustom(`/di/DataCatalog/dcat/validate/_get?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: id,
  });
}
