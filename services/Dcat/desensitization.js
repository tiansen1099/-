import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 调用脱敏、加密规则接口,获取全部脱敏或加密规则
 */
// eslint-disable-next-line import/prefer-default-export
export async function getTranRuleList(payload) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/acap/distributionReDevelopApi/queryTransRuleList?diToken=${diToken}`, {
    method: 'POST',
    body: payload,
  });
}