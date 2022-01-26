import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getContractAppForVersionById(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/getServiceContractApplicationForVersionById?diToken=${diToken}`;
  return request(postUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function contractAppTabelSearch(params) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/contractApp/search?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function getContractAppInfoByIdAndVersion(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/getServiceContractApplicationListByIdAndVersion?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function deleteContract(params) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/serviceContractApi/deleteServiceContract?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: params,
    }
  );
}
