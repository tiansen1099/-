import React, { Component } from 'react';
import { Input } from 'antd';
import { getSessionCache } from '@/utils/Platform/platformUtil';
import styles from './asset.less';

const { Search } = Input;

class RepositoryHome extends Component {
  state = {};

  componentDidMount() {}

  loadSearchResult = search => {
    const { addTab } = this.props;
    let temp = '：';
    if (!search) {
      temp = '结果';
    } else if (search.length > 10) {
      // 防止输入超长内容，tab展现异常
      temp += search.substring(0, 8) + '...';
    } else {
      temp += search;
    }
    const title = '检索' + temp;
    const pane = { title, key: title, type: 'SearchResult', search };
    addTab(pane);
  };

  render() {
    const productCode = getSessionCache('productCode');
    if (productCode === 'MM' || productCode === 'DataAsset') {
      return (
        <div className={styles.repositoryHome}>
          <div className={styles.homeContent}>
            <div className={styles.homeSearch}>
              <div className={styles.homeSearchTitle}>资产检索</div>
              <Search
                placeholder="请输入关键词"
                enterButton
                maxLength={100}
                onSearch={value => this.loadSearchResult(value)}
              />
            </div>
          </div>
        </div>
      );
    }

    // 获取服务返回的数据
    return (
      <div className={styles.repositoryHome} style={{ height: '687px' }}>
        <div className={styles.homeContent}>
          <div className={styles.homeSearch}>
            <div className={styles.homeSearchTitle}>检索资产</div>
            <Search
              placeholder="请输入关键词"
              enterButton
              maxLength={100}
              onSearch={value => this.loadSearchResult(value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default RepositoryHome;
