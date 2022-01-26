import request, { requestCustom } from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function tableSearch(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { currentPage, pageSize, orderCol, orderDir, conditions } = searchParam;
    const start = currentPage * pageSize;
    let searchUrl = `/di/DataCatalog/dcat/acap/distributionReDevelopApi/_search_government?diToken=${diToken}&start=${start}&length=${pageSize}`;
    if (orderCol) {
      searchUrl += `&order_col=${orderCol}`;
    }
    if (orderDir) {
      searchUrl += `&order_dir=${orderDir}`;
    }
    return request(searchUrl, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: conditions,
    });
  }
  return {};
}

export async function getFileAggs(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { currentPage, pageSize, orderCol, orderDir, conditions } = searchParam;
    const start = currentPage * pageSize;
    let searchUrl = `/di/DataCatalog/dcat/distributions/_file_aggs?diToken=${diToken}&start=${start}&length=${pageSize}`;
    if (orderCol) {
      searchUrl += `&order_col=${orderCol}`;
    }
    if (orderDir) {
      searchUrl += `&order_dir=${orderDir}`;
    }
    return request(searchUrl, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: conditions,
    });
  }
  return {};
}

export async function distSearch(start, length, conditions) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/distributions/_card_dist_search?diToken=${diToken}&start=${start}&length=${length}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: conditions,
    }
  );
}

export async function publishSearch(start, length, conditions) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/distributions/_card_publish_search?diToken=${diToken}&start=${start}&length=${length}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: conditions,
    }
  );
}

export async function getTotalInfo() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/distributions/_get_total_info?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

export async function getAPITotalInfo() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/distributions/_get_api_total_info?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

export async function getDBTotalInfo() {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/distributions/_get_db_total_info?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

export async function getFileDistTotalInfo() {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/distributions/_get_file_dist_total_info?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}

export async function subscribeSearch(start, length, conditions) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/distributions/_card_subscribe_search?diToken=${diToken}&start=${start}&length=${length}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: conditions,
    }
  );
}

export async function undoSubscription(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/subscribe/_undo?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

export async function getPopularRetrieve(count) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/distributions/_get_dist_by_accesscount/${count}?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}


export async function getFileDistributionDetail(code) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/homepage/_distribution?code=${code}&diToken=${diToken}`);
}

export async function getDistributionDetail(code) {
  const diToken = getSessionCache('diToken');
  return requestCustom(`/di/DataCatalog/dcat/distributions/_get?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: code,
  });
}

export async function saveDistribution(data) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/distributions/di_save?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: data,
  });
}

export async function deleteDistributions(codes) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/distributions/_delete?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: codes,
  });
}

export async function getDBDistributionDetail(code) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/homepage/_distribution?code=${code}&diToken=${diToken}`);
}

export async function getDBDistributionColumn(code, searchNameValue, searchRemarksValue) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/homepage/_distribution_db_column?code=${code}&searchNameValue=${searchNameValue}&searchRemarksValue=${searchRemarksValue}&diToken=${diToken}`
  );
}

export async function getDBDistributionSubscription(code) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/subscribe/status/` + code + `/_get?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

export async function saveDistributionMetadata(data) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/distributions/_save_distributionMetadata?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: data,
    }
  );
}

export async function updateDistributionstasAccessCount(code) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/distributions/_update_distributionstas_access_count?diToken=${diToken}&code=${code}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}

export async function updateDistributionstasDownloadCount(code) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/distributions/_update_distributionstas_download_count?diToken=${diToken}&code=${code}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
    }
  );
}

export async function getOrgDataRuleRefByOrgId(orgId) {
  const diToken = getSessionCache('diToken');
  return requestCustom(`/di/DataCatalog/dcat/orgDataRuleRef/_get?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: orgId,
  });
}

export async function changeToProcessing(code) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/acap/distributions/_changeToProcessing?code=${code}&diToken=${diToken}`
  );
}

export async function getDistSubRelations(code) {
  const diToken = getSessionCache('diToken');
  return requestCustom(
    `/di/DataCatalog/dcat/distributions/_get_dist_sub_relations?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: code,
    }
  );
}

export async function getRelationDistDetailDTO(code) {
  const diToken = getSessionCache('diToken');
  return requestCustom(
    `/di/DataCatalog/dcat/distributions/_get_relation_dist_detail?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: code,
    }
  );
}

export async function existPublishedOrReviewingDistByAccount(accounts) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/distributions/_exist_published_or_reviewing_dists_by_create_account?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: accounts,
    }
  );
}

export async function existPublishedOrReviewingDistByOrg(orgCode) {
  const diToken = getSessionCache('diToken');
  return requestCustom(
    `/di/DataCatalog/dcat/distributions/_exist_published_or_reviewing_dists_by_create_org?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: orgCode,
    }
  );
}



/**
 * 分页查询外部资源
 * @param searchParam
 * @returns {Promise<{}>}
 */
export async function getDistributionOuterPageQuery(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { currentPage, pageSize, orderCol, orderDir, conditions } = searchParam;
    const start = currentPage * pageSize;
    const pageQuery = {
      displayStart: start,
      displayLength: pageSize,
      conditions,
    };
    const url = `/di/DataCatalog/dcat/distributionOuter/_table_search?diToken=${diToken}`;
    if (orderCol) {
      pageQuery.order = orderCol;
    }
    if (orderDir) {
      pageQuery.orderDir = orderDir;
    }
    return request(url, {
      method: 'POST',
      body: pageQuery,
    });
  }
  return {};
}

/**
 * 保存外部资源
 * @param id
 * @returns {Promise<void>}
 */
export async function saveDistributionOuter(distributionOuter) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/distributionOuter?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
    body: distributionOuter,
  });
}

/**
 * 删除外部资源
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteDistributionOuter(id) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/distributionOuter/_delete/${id}?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
  });
}

/**
 * 根据Id获取外部资源
 * @param id
 * @returns {Promise<void>}
 */
export async function getDistributionOuter(id) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/dcat/distributionOuter/${id}?diToken=${diToken}`;
  return request(url);
}

