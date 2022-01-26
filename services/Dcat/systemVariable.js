import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 查询所有系统变量
 */
export async function systemVariablesSearch() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/dxp/getAllSystemVariables?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: '',
  });
}

/**
 * 按名称查询系统变量
 */
export async function variableSearchByName(name) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/dxp/getVariableByName?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: { variableName: name },
  });
}

/**
 * 保存系统变量
 */
export async function systemVariableSave(systemVariable) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/dxp/saveOrUpdateSysVar?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: systemVariable,
  });
}

/**
 * 删除系统变量
 */
export async function systemVariableDelete(name) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/dxp/deleteSystemVar?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: { variableName: name },
  });
}
