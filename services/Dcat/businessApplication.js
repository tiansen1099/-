import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function bizDist(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/businessReleaseApplicationApi/saveOrUpdateBusinessReleaseApplication?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function bizInfo(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/businessReleaseApplicationApi/getBusinessReleaseApplicationListByIdAndVersion?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function bizServices(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/getServiceContractApplicationListByName?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function businessSearch(params) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/businessApp/search?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function isCategoryInUse(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/businessReleaseApplicationApi/_isCategoryInUse?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: params,
  });
}

export async function getBusinessAppAssociation(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/businessReleaseApplicationApi/getBusinessReleaseApplicationUnitAndServiceContractApplication?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: params,
  });
}

export async function getBusinessAppVersions(id) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/businessReleaseApplicationApi/getBusinessReleaseApplicationForVersionById?diToken=${diToken}`;
  return request(postUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: id,
  });
}

export async function getReleaseUserList() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/businessReleaseApplicationApi/getCreatedByList?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'GET',
    }
  );
}

export async function getOrgList() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/businessReleaseApplicationApi/getOrgList?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'GET',
    }
  );
}

export async function businessAppTabelSearch(params) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/businessApp/search?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function deleteBusinessApp(params) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/businessReleaseApplicationApi/deleteBusinessReleaseApplication?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: params,
    }
  );
}

export async function getBusinessInfo(params) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/businessReleaseApplicationApi/getBusinessReleaseApplicationListByIdAndVersion?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: params,
    }
  );
}

export async function getBusinessReleaseUnitAndServiceContract(params) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/businessReleaseApplicationApi/getBusinessReleaseApplicationUnitAndServiceContractApplication?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: params,
    }
  );
}

export async function saveOpener(params) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/businessReleaseApplicationApi/saveOpener?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: params,
    }
  );
}
