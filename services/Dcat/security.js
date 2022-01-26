import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 明文与密文转换
 * @param {*} payload
 */
export async function fetchTransformResult(payload) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/apimConsoleService/ws/gateway/service/security/fetchTransformResult?diToken=${diToken}`,
    {
      method: 'POST',
      body: payload,
    }
  );
}

/**
 * FPE加解密明文与密文转换
 * @param {*} payload
 */
export async function fpeAlgorithm(payload) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/fpeToolsApi/fpeAlgorithm?diToken=${diToken}`, 
    {
      method: 'POST',
      body: payload,
    }
  );
}

/**
 * FPE密钥生成
 */
export async function createFpeSecretKey() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/fpeToolsApi/createFpeSecretKey?diToken=${diToken}`,
    {
      method: 'GET',
    }
  );
}

/**
 * 防篡改助手
 * @param {*} payload
 */
export async function tamperProofAssistant(payload) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/business/assistantApi/tamperProofAssistant?diToken=${diToken}`, 
    {
      method: 'POST',
      body: payload,
    }
  );
}

/**
 * 获取密钥列表
 * @param {*} orgCode
 * @param {*} sysCode
 */
export async function fetchKeyList() {
  const diToken = getSessionCache('diToken');
  return request(`/di/business/secretApi/getPublicAndPrivateSecretList?diToken=${diToken}`);
}

/**
 * 生成或修改密钥
 * @param {*} payload
 */
export async function generateKeypairs(payload) {
  const diToken = getSessionCache('diToken');
  return request(`/di/business/secretApi/createPublicAndPrivateSecret?diToken=${diToken}`, {
    method: 'POST',
    body: payload,
  });
}

/**
 * 同步密钥信息
 * @param {*} payload
 */
export async function updateSecret(payload) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/apimConsoleService/ws/gateway/service/security/updateSecret?diToken=${diToken}`,
    {
      method: 'POST',
      body: payload,
    }
  );
}

/**
 * 下载密钥
 * @param {*} params
 */
export async function downloadKeypairs(params = {}) {
  const diToken = getSessionCache('diToken');
  return request(`/di/business/secretApi/downLoadSecretFile?diToken=${diToken}`, {
    method: 'POST', // GET / POST 均可以
    body: params,
    responseType: 'blob', // 必须注明返回二进制流
  });
}

/**
 * 下载SDK
 * @param {*} params
 */
export async function downloadSDK(params = {}) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/downLoadFiles/downLoadSecretSDK?diToken=${diToken}`, {
    method: 'POST', // GET / POST 均可以
    body: params,
    responseType: 'blob', // 必须注明返回二进制流
  });
}

/**
 * 下载FPE-SDK
 * @param {*} params
 */
export async function downloadFpeSDK(params = {}) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/downLoadFiles/downLoadFpeSecretSDK?diToken=${diToken}`, {
    method: 'POST', // GET / POST 均可以
    body: params,
    responseType: 'blob', // 必须注明返回二进制流
  });
}

/**
 * 防重放助手
 * @param {*} payload
 */
export async function antiReplayAssistant(payload) {
  const diToken = getSessionCache('diToken');
  return request(`/di/business/assistantApi/antiReplayAssistant?diToken=${diToken}`, {
    method: 'POST',
    body: payload,
  });
}

/**
 * 加密助手
 * @param {*} payload
 */
export async function encryptionAssistant(payload) {
  const diToken = getSessionCache('diToken');
  return request(`/di/business/assistantApi/encryptionAssistant?diToken=${diToken}`, {
    method: 'POST',
    body: payload,
  });
}
/**
 * 加密助手-encode
 * @param {*} payload
 */
export async function encodeRequestParams(payload) {
  const diToken = getSessionCache('diToken');
  return request(`/di/business/assistantApi/encodeRequestParams?diToken=${diToken}`, {
    method: 'POST',
    body: payload,
  });
}

/**
 * 获取license列表
 * @param {*} params
 */
export async function fetchLicenseList(params = {}) {
  const diToken = getSessionCache('diToken');
  if (typeof params !== 'undefined' && params !== null) {
    const { conditions, currentPage, pageSize } = params;

    let restUrl = `/di/DataCatalog/dcat/acap/developer/getDeveloperByPage/${currentPage}/${pageSize}?diToken=${diToken}`;
    if (conditions) {
      restUrl += `&account=${conditions}`;
    }
    return request(restUrl, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'GET',
    });
  }
  return {};
}

/**
 * 保存
 * @param {*} params
 */
export async function saveLicense(params) {
  const diToken = getSessionCache('diToken');
  return request(`/console/ws/gateway/service/hz/updateLicense?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
  // const result = {
  //   param: params,
  //   code: 200,
  //   msg: '保存成功！'
  // }
  // return result;
}
/**
 * 获取公钥
 * @param {*} params
 */
export async function lookPubKey(params) {
  const diToken = getSessionCache('diToken');
  return request(`/di/business/publicKey/look?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: params,
  });
}
