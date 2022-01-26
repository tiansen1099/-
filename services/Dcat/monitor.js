import request, { requestCustom } from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

/**
 * 获取数据监控全局统计信息
 */
 export async function getDbAnalyzeStatisticInfo() {
  const diToken = getSessionCache('diToken');
  const apiUrl = `/di/DataCatalog/dcat/DataMonitor/_get_db_analyze_statistic_info?diToken=${diToken}`;
  return request(apiUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 统计总量
 */
export async function getTotalInfo(modules) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/monitors/_get_total_info?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: modules,
  });
}

/**
 * 资源分类占比
 */
export async function getDistributionCategoryRate() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/monitors/_get_distribution_category_rate?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}

/**
 * 数据资源-业务分类分析
 */
export async function getDbDistBusinessCategoryAnalysis() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/monitors/_get_db_dist_business_category_analysis?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}

/**
 * 服务资源-业务分类分析
 */
export async function getApiDistBusinessCategoryAnalysis() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/monitors/_get_api_dist_business_category_analysis?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}

/**
 * 去年某种资源总量
 */
export async function getLastYearDistributionTotalAnalysis(distType) {
  const diToken = getSessionCache('diToken');
  return requestCustom(
    `/di/DataCatalog/dcat/monitors/_get_last_year_distribution_total_analysis?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: distType,
    }
  );
}

/**
 * 服务资源总量
 */
export async function getApiDistributionTotalAnalysis() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/monitors/_get_api_distribution_total_analysis?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}

/**
 * 数据资源总量
 */
export async function getDbDistributionTotalAnalysis() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/monitors/_get_db_distribution_total_analysis?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}

/**
 * 文件资源总量
 */
export async function getFileDistributionTotalAnalysis() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/monitors/_get_file_distribution_total_analysis?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}

/**
 * 资源占比
 */
export async function getPublishDistributionRate() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/monitors/_get_publish_distribution_rate?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}

/**
 * 资源发布订阅分析
 */
export async function getDistPublishSubscribeAnalysis() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/monitors/_get_dist_publish_subscribe_analysis?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}

/**
 * 资产占比
 */
export async function getAssetRate() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/monitors/_get_asset_rate?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 资产类型分析
 */
export async function getAssetTypeAnalysis() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/monitors/_get_asset_type_analysis?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

// 调阅分析暂时未提供
/**
 * 获取资源调阅统计信息
 */
export async function getDistributionInvokeInfo(modules) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/monitors/_get_distribution_invoke_info?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: modules,
  });
}

/**
 * 获取资源调阅总量分析
 */
export async function getDistInvokeTotalAnalysis(modules) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/monitors/_get_dist_invoke_total_analysis?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: modules,
    }
  );
}

// 运维监控和资产采集监控接口暂未提供
/**
 * 获取资产采集监控信息
 */
export async function getAssetCollectInfo() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/monitors/_get_asset_collect_info?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 获取数据订阅监控信息
 */
export async function getDBSubscribeInfo() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/monitors/_get_db_subscribe_info?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 控制台首页，获取登录用户拥有的数据、服务类型的资源的被订阅数（仅包含订阅成功的个数）
 */
export async function getSubscribedCount() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/monitors/_get_dist_subcribed_count?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

/**
 * 获取机构、用户、API资源与订阅数量信息 chaizq
 */
export async function getApiAnalyzeStatisticInfo() {
  const diToken = getSessionCache('diToken');
  const apiUrl = `/di/DataCatalog/dcat/acap/monitors/_get_api_analyze_statistic_info?diToken=${diToken}`;
  return request(apiUrl, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 统计总量
 */
export async function getServiceMap() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/monitor/map/new?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'GET',
  });
}

/**
 * 服务调用统计
 */
 export async function getCallStatistics(data) {
  const diToken = getSessionCache('diToken');
  if (typeof data !== 'undefined' && data !== null) {
    const {
      query: { pageNumber, pageSize },
      body,
    } = data;

    const restUrl = `/di/DataCatalog/apimConsoleService/ws/gateway/service/getCallRecordByCondition/${pageNumber}/${pageSize}?diToken=${diToken}`;
    return request(restUrl, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body,
    });
  }
  return {};
}
