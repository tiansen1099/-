import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getPagingUsers(
  currentPage,
  pageSize,
  orderCol,
  orderDir,
  searchValue,
  searchColumn
) {
  const diToken = getSessionCache('diToken');
  let url = `/di/service/user/getPagingUsers?diToken=${diToken}&currentPage=${currentPage}&pageSize=${pageSize}&orderCol=${orderCol}&orderDir=${orderDir}&searchValue=${searchValue}`;
  if (searchColumn !== undefined && searchColumn != null && searchColumn !== '') {
    url = `/di/service/user/getPagingUsers?diToken=${diToken}&currentPage=${currentPage}&pageSize=${pageSize}&orderCol=${orderCol}&orderDir=${orderDir}&searchValue=${searchValue}&searchColumn=${searchColumn}`;
  }
  return request(url);
}

export async function saveOrUpdateUser(userToSave) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/user/saveOrUpdateUser?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      userToSave,
      method: 'post',
    },
  });
}

export async function changeUserPassword(passwordInfo) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/user/changeUserPassword?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      passwordInfo,
      method: 'post',
    },
  });
}

export async function changeUserLocked(account, unLocked) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/user/changeUserLocked?diToken=${diToken}&account=${account}&unLocked=${unLocked}`
  );
}

export async function getUserByAccount(account) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/user/getUserByAccount?diToken=${diToken}&account=${account}`);
}

export async function deleteUsers(accounts) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/user/deleteUsers?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      accounts,
      method: 'post',
    },
  });
}

export async function resetPwd(account) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/user/resetPwd?diToken=${diToken}&account=${account}`);
}

export async function getUserTreeData() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/user/getUserTreeData?diToken=${diToken}`);
}

export async function getUserAccountNameList(accounts) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/user/getUserAccountNameList?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      accounts,
      method: 'post',
    },
  });
}
