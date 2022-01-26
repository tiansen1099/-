import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 查询未读消息个数
 */
export async function queryUnReadMessageCount() {
  const diToken = getSessionCache('diToken');
  return request(`/di/api/getUnReadMessageCount?diToken=${diToken}`);
}

/**
 * 重新加载未读消息缓存
 */
export async function reloadUnReadMessageCount() {
  const diToken = getSessionCache('diToken');
  return request(`/di/api/reloadUnReadMessageCount?diToken=${diToken}`);
}

/**
 * 查询消息个数
 */
export async function queryMessageCount() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/message/getMessageCount?diToken=${diToken}`);
}

/**
 * 将消息标记为已读
 */
export async function markMessageToRead(messageId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/message/markMessageToRead?diToken=${diToken}&messageId=${messageId}`);
}

/**
 * 批量设置消息为已读
 * @param {*} messageIds
 */
export async function batchMarkMessageToRead(messageIds) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/message/batchMarkMessageToRead?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      messageIds,
      method: 'post',
    },
  });
}

/**
 * 删除消息
 */
export async function delMessage(messageId) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/message/delMessage?diToken=${diToken}&messageId=${messageId}`);
}

/**
 * 批量删除消息
 * @param {*} messageIds
 */
export async function batchDelMessage(messageIds) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/message/batchDelMessage?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      messageIds,
      method: 'post',
    },
  });
}

/**
 * 标记所有未读消息至已读
 */
export async function markAllMessageToRead() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/message/markAllMessageToRead?diToken=${diToken}`);
}

/**
 * 清空所有已读消息
 */
export async function deleteAllMessageByReceivedBy() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/message/deleteAllMessageByReceivedBy?diToken=${diToken}`);
}

/**
 * 获取分页消息数据
 * @param {*} status
 * @param {*} currentPage
 * @param {*} pageSize
 * @param {*} orderCol
 * @param {*} orderDir
 */
export async function getPagingMessageByStatus(
  status,
  currentPage,
  pageSize,
  orderCol,
  orderDir,
  searchColumn,
  searchValue
) {
  const diToken = getSessionCache('diToken');
  let url = `/di/service/message/getPagingMessageByStatus?diToken=${diToken}&status=${status}&currentPage=${currentPage}&pageSize=${pageSize}&orderCol=${orderCol}&orderDir=${orderDir}`;
  if (searchColumn) {
    url = `${url}&searchColumn=${searchColumn}`;
  }
  if (searchValue) {
    url = `${url}&searchValue=${searchValue}`;
  }
  return request(url);
}
