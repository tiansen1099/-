import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function queryLoginUrl() {
  return request('/di/api/getLoginUrl');
}

export async function queryLogoutUrl() {
  const diToken = getSessionCache('diToken');
  return request(`/di/api/getLogoutUrl?diToken=${diToken}`);
}

export async function queryCurrentUser() {
  const diToken = getSessionCache('diToken');
  return request(`/di/api/currentUser?diToken=${diToken}`);
}

export async function queryAccessToken() {
  const diToken = getSessionCache('diToken');
  return request(`/di/api/getCurrentAccessToken?diToken=${diToken}`);
}

export async function doDiLogout() {
  const diToken = getSessionCache('diToken');
  return request(`/di/api/diLogout?diToken=${diToken}`);
}

export async function doOauthLoginPassword(username, password) {
  return request(`/di/oauth/oauthPasswordLogin`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      username,
      password,
      method: 'post',
    },
  });
}

/**
 * 获取用户权限
 * @param id
 * @returns {Promise<void>}
 */
export async function getUserAuthorization() {
  const diToken = getSessionCache('diToken');
  const url = `/di/business/commonApi/getRole?diToken=${diToken}`;
  return request(url);
}

/**
 * 通过diToken进行菜单集成认证
 */
export async function menuEntryAuthorization() {
  const diToken = getSessionCache('diToken');
  return request(`/di/api/menuEntryAuthorization?diToken=${diToken}`);
}
