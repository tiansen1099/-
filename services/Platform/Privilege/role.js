import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getRole() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/role/getAll?diToken=${diToken}`);
}

export async function getOperatePrivilege() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/privilege/getOperatePrivilege?diToken=${diToken}`);
}

export async function getDataPrivilege() {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/privilege/getDataPrivilege?diToken=${diToken}`);
}

export async function getOperatePrivilegeIdsByRoleId(roleId) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/privilege/getOperatePrivilegeIdsByRoleId?roleId=${roleId}&diToken=${diToken}`
  );
}

export async function getDataPrivilegeIdsByRoleId(roleId) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/service/privilege/getDataPrivilegeIdsByRoleId?roleId=${roleId}&diToken=${diToken}`
  );
}

export async function saveOrUpdatePrivilege(roleId, privilegeList) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/privilege/saveOrUpdatePrivilege?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      roleId,
      privilegeList,
      method: 'post',
    },
  });
}

export async function deleteRoleById(keyValue) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/role/delRoleById?roleId=${keyValue}&diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      method: 'post',
    },
  });
}

export async function saveOrUpdateRole(role) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/role/saveOrUpdateRole?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      role,
      method: 'post',
    },
  });
}

export async function getRolesByAccount(account) {
  const diToken = getSessionCache('diToken');
  return request(`/di/service/api/role/getRolesByUserAccount?account=${account}&diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: {
      method: 'post',
    },
  });
}
