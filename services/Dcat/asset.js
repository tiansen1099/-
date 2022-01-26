import request, { requestCustom } from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getDcatTotalInfo() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/assets/_get?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      method: 'post',
    },
  });
}

export async function getDcatAssociatedDistListByAssetIds(assetIds) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/assets/status/getAssociatedDistListByAssetIds?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: assetIds,
    }
  );
}

export async function saveAssetStatuses(assetStatuses) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/assets/status/_save?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: assetStatuses,
  });
}

export async function getAssetStatusByDistCode(distCode) {
  const diToken = getSessionCache('diToken');
  return requestCustom(`/di/DataCatalog/dcat/assets/status/_get_by_distcode?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: distCode,
  });
}
