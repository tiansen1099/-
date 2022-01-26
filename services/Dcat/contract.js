import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getContractForVersionById(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApi/getServiceContractForVersionById?diToken=${diToken}`;
  return request(postUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function getAppContractVersionsById(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/getServiceContractApplicationForVersionById?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function getAppContractRes(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/getDistributionListByContractIdAndContractVersion?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function getContractListByIdAndVersion(payload, app) {
  const diToken = getSessionCache('diToken');
  const service = app
    ? 'serviceContractApplicationApi/getServiceContractApplicationListByIdAndVersion'
    : 'serviceContractApi/getServiceContractListByIdAndVersion';
  const postUrl = `/di/DataCatalog/dcat/${service}?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function contractTabelSearch(params) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/Contract/search?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
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

/**
 * 下载文档
 * @param {*} params
 */
export async function downloadDocmount(params = {}, app) {
  const diToken = getSessionCache('diToken');
  const service = app
    ? 'serviceContractApplicationApi/wordExport'
    : 'serviceContractApi/wordExport';
  return request(`/di/DataCatalog/dcat/${service}?diToken=${diToken}`, {
    method: 'POST', // GET / POST 均可以
    body: params,
    responseType: 'blob', // 必须注明返回二进制流
  });
}

export async function assignTask(payload) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/serviceContractApplicationApi/releaseOrOpenExecutorContractRelation?diToken=${diToken}`,
    {
      method: 'POST',
      body: payload,
    }
  );
}

export async function getContractRelationInfor(payload, app) {
  const diToken = getSessionCache('diToken');
  const service = app
    ? 'serviceContractApplicationApi/getContractRelationApplicationInfor'
    : 'serviceContractApi/getContractRelationInfor';
  const postUrl = `/di/DataCatalog/dcat/${service}?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function templateManagerSearch(params) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/serviceContractTemplateApi/queryServiceContractTemplateList?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: params,
    }
  );
}

export async function contractSearch(params) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/Contract/search?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function saveOrUpdateContract(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApi/saveOrUpdateServiceContract?diToken=${diToken}`;
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

export async function deleteContractTemplate(params) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/serviceContractTemplateApi/deleteServiceContractTemplateAndDetails?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: params,
    }
  );
}

export async function saveTemplate(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractTemplateApi/saveOrUpdateServiceContractTemplateAndDetails?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}

export async function getContractTemplateById(params) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractTemplateApi/queryServiceContractTemplateAndDetailsListById?diToken=${diToken}`;
  return request(postUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}

export async function getDistributionListIdByExecute(payload) {
  const diToken = getSessionCache('diToken');
  const postUrl = `/di/DataCatalog/dcat/serviceContractApplicationApi/getDistributionListIdByExecute?diToken=${diToken}`;
  return request(postUrl, {
    method: 'POST',
    body: payload,
  });
}
