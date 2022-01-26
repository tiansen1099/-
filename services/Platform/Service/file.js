// import router from 'umi/router';
import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';
import { urlPreContext } from '@/defaultSettings';

/**
 * 删除文件
 * @param {*} fileId
 */
export async function deleteFile(fileId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/file/remove?diToken=${diToken}&fileId=${fileId}`);
}

/**
 * 批量删除文件
 * @param {*} fileIds
 */
export async function batchDeleteFile(fileIds) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/file/batchRemove?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      fileIds,
      method: 'post',
    },
  });
}

/**
 * 下载文件
 * @param {*} fileId
 */
export function download(fileId) {
  const diToken = getSessionCache('diToken');
  const downloadUrl = `${urlPreContext}/di/service/file/download?diToken=${diToken}&fileId=${fileId}`;
  return fetch(downloadUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
    responseType: 'blob',
  });
}

/**
 * 查询是否是pdf
 * @param {*} fileId
 */
export async function querypdf(fileId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/file/queryPdf?diToken=${diToken}&fileId=${fileId}`);
}
/**
 *
 * @param {文件ID} fileId
 * @param {文件格式} formate
 */
export async function convertPdf(fileId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/file/convertPdf?diToken=${diToken}&fileId=${fileId}`);
}
