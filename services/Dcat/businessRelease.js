import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getBusinessReleaseListByIdAndVersion(body) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/businessReleaseApi/getBusinessReleaseListByIdAndVersion?diToken=${diToken}`;
  return request(postUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body,
  });
}
export async function getBusinessReleaseUnitAndServiceContract(body) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/businessReleaseApi/getBusinessReleaseUnitAndServiceContract?diToken=${diToken}`;
  return request(postUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body,
  });
}

export async function getBusinessReleaseForVersionById(id) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/businessReleaseApi/getBusinessReleaseForVersionById?diToken=${diToken}`;
  return request(postUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: id,
  });
}

export async function bizDist(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/businessReleaseApi/saveOrUpdateBusinessRelease?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function bizInfo(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/businessReleaseApi/getBusinessReleaseListByIdAndVersion?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function bizServices(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApi/getServiceContractListByName?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function businessSearch(params) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/BusinessRelease/search?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function businessQuote(params) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/businessQuote?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function businessTabelSearch(params) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/BusinessRelease/search?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function deleteBsns(params) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/businessReleaseApi/deleteBusinessRelease?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: params,
    }
  );
}
