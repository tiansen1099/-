import request, { requestCustom } from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function getDatasourcesByCategories(catagories) {
  const diToken = getSessionCache('diToken');
  const productCode = getSessionCache('productCode');
  return request(`/di/DataCatalog/dcat/datasources/_di_getAll_by_categorys?productCode=${productCode}&diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: catagories,
  });
}

export async function getTriggerTimeList(cronValue,count) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/subscribe/getTriggerTimeList?diToken=${diToken}&cronInputText=${cronValue}&count=${count}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  });
}

export async function getSchemasByDatasource(datasource) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/subscribe/schemas?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: datasource,
  });
}

export async function saveOrUpdateSubscription(subscription) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/subscribe/_save?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: subscription,
  });
}

export async function updateSubscription(subscription) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/subscribe/_update?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: subscription,
  });
}

export async function getTableSearchSubscribedResource(searchingParam) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/subscribe/_search_monitor?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: searchingParam,
  });
}

export async function disableSubscription(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/subscribe/_disable?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

export async function enableSubscription(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/subscribe/_enable?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

export async function doUnsubscribe(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/subscribe/_undo?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

export async function getSubscribeById(subscribeId) {
  const diToken = getSessionCache('diToken');
  return requestCustom(`/di/DataCatalog/dcat/subscribe/_get_by_id?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: subscribeId,
  });
}

export async function getRelationSubDetail(subscribeId) {
  const diToken = getSessionCache('diToken');
  return requestCustom(
    `/di/DataCatalog/dcat/subscribe/_get_relation_sub_detail?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: subscribeId,
    }
  );
}

export async function startSubscribeTask(ids) {
  const diToken = getSessionCache('diToken');
  return request(`/di/DataCatalog/dcat/subscribe/_start?diToken=${diToken}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: ids,
  });
}

export async function startSubscribeTaskWithConfig(taskConfig) {
  const diToken = getSessionCache('diToken');
  const { id, context, isForceStart } = taskConfig;
  return request(
    `/di/DataCatalog/dcat/subscribe/_start_with_config?diToken=${diToken}&id=${id}&isForceStart=${isForceStart}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: context,
    }
  );
}

export async function existReviewingAndSubscribedDistByAccount(accounts) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/DataCatalog/dcat/subscribe/_exist_reviewing_and_subscribed_dists_by_account?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: accounts,
    }
  );
}

export async function existReviewingAndSubscribedDistByOrg(account) {
  const diToken = getSessionCache('diToken');
  return requestCustom(
    `/di/DataCatalog/dcat/subscribe/_exist_reviewing_and_subscribed_dists_by_org?diToken=${diToken}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: account,
    }
  );
}

 export async function checkPassword(payload) {
  const diToken = getSessionCache('diToken');
  return request(
    `/di/business/commonApi/checkPassword?diToken=${diToken}`, 
    {
      method: 'POST',
      body: payload,
    }
  );
}
