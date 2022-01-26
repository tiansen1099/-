import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getContractForVersionById(params) {
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

export async function getContractListByIdAndVersion(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/getServiceContractApplicationListByIdAndVersion?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function contractSearch(params) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/contractApp/search?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function saveOrUpdateContract(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/saveOrUpdateServiceContractApplication?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function reflectRelation(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApi/reflectRelation?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: params,
  });
}

export async function queryContractTemplateList(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractTemplateApi/queryServiceContractTemplateListByQuery?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: params,
  });
}

export async function queryContractTemplateDetails(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractTemplateApi/queryServiceContractTemplateDetailsListByTemplateId?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: params,
  });
}

export async function getServiceList(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/getDistributionListByContractIdAndContractVersion?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: params,
  });
}

export async function saveAssociation(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/saveAssociation?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: params,
  });
}

export async function clearAssociation(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/clearAssociation?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: params,
  });
}

export async function getTaskAndRelease(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/getMyTaskOrMyReleaseList?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: params,
  });
}

export async function deleteTask(params) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/serviceContractApplicationApi/cancelTask?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: params,
    }
  );
}

export async function getReleaseUserList() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/serviceContractApplicationApi/getReleaseUserList?diToken=${diToken}`,
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
    `/di/DataCatalog/dcat/serviceContractApplicationApi/getOrgList?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'GET',
    }
  );
}

export async function getExecuteList() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/serviceContractApplicationApi/getExecuteUserList?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'GET',
    }
  );
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

export async function deleteContractApp(params) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/serviceContractApplicationApi/deleteServiceContractApplication?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: params,
    }
  );
}

export async function userNameSearch(params) {
  const diToken = getSessionCache('diToken');
  return request(`/di/business/commonApi/getUserName?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function checkCategory(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/checkCategory?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: params,
  });
}
