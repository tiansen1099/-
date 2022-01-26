import request, { requestCustom } from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';

export async function tableSearch(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { currentPage, pageSize, orderCol, orderDir, conditions } = searchParam;
    const searchUrl = `/di/Common/reviewService/reviews/_getReviewsForReviewer?diToken=${diToken}`;

    // 初始化请求体
    const body = {
      path: 'reviews',
      data: {
        query: {
          start: currentPage * pageSize,
          length: pageSize,
          conditions,
        },
      },
    };

    if (orderCol) {
      body.data.query.orderCol = orderCol;
    }

    if (orderDir) {
      body.data.query.orderDirection = orderDir;
    }

    return request(searchUrl, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body,
    });
  }
  return {};
}

export async function tableHistorySearch(searchParam) {
  const diToken = getSessionCache('diToken');
  if (searchParam) {
    const { currentPage, pageSize, orderCol, orderDir, conditions } = searchParam;
    const searchUrl = `/di/Common/reviewService/reviews/_getReviewHistoryForReviewer?diToken=${diToken}`;

    // 初始化请求体
    const body = {
      path: 'reviews',
      data: {
        query: {
          start: currentPage * pageSize,
          length: pageSize,
          conditions,
        },
      },
    };

    if (orderCol) {
      body.data.query.orderCol = orderCol;
    }

    if (orderDir) {
      body.data.query.orderDirection = orderDir;
    }

    return request(searchUrl, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body,
    });
  }
  return {};
}

export async function passReview(reviewParams) {
  const diToken = getSessionCache('diToken');
  const { reviewRequests, reviewInfo } = reviewParams;
  const productCode = getSessionCache('productCode');
  if (reviewInfo !== undefined && reviewInfo !== '') {
    const reqbody = { reviewRequestList: reviewRequests, reviewInfo };
    return request(`/di/DataCatalog/reviews/_passColumn?productCode=${productCode}&diToken=${diToken}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: reqbody,
    });
  }
  let url = `/di/DataCatalog/reviews/_pass?productCode=${productCode}&diToken=${diToken}`;
  // 元数据审批通过路径
  if (productCode === 'DataStandard') {
    url = `/di/DataStandard/reviews/_pass?diToken=${diToken}`;
  }
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: reviewRequests,
  });
}

export async function rejectReview(reviewParams) {
  const diToken = getSessionCache('diToken');
  const { reviewRequests, reviewInfo } = reviewParams;
  const productCode = getSessionCache('productCode');
  if (reviewInfo !== undefined && reviewInfo !== '') {
    const reqbody = { reviewRequestList: reviewRequests, reviewInfo };
    return request(`/di/DataCatalog/reviews/_passColumn?productCode=${productCode}&diToken=${diToken}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: reqbody,
    });
  }
  let url = `/di/DataCatalog/reviews/_reject?productCode=${productCode}&diToken=${diToken}`;
  // 元数据审批驳回路径
  if (productCode === 'DataStandard') {
    url = `/di/DataStandard/reviews/_pass?diToken=${diToken}`;
  }
  return request(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: reviewRequests,
  });
}

export async function getReviewDetail(reviewId) {
  const diToken = getSessionCache('diToken');
  const url = `/di/DataCatalog/reviews/_get_detail_by_review_id?diToken=${diToken}`;
  return requestCustom(url, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
    body: reviewId,
  });
}
	