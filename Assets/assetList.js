import React, { Component } from 'react';
import { Empty, Input, Pagination, Select, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import termIcon from '@/assets/mm/asset-icons/term.svg';
import emptyImg from '@/assets/mm/common/empty.png';
import styles from './asset.less';

const { Search } = Input;
const { Option } = Select;

@connect(({ loading, mmAssets }) => ({
  searchLoading: loading.effects['mmAssets/searchElement'],
  searchResult: mmAssets.searchResult,
}))
class AssetList extends Component {
  constructor(props) {
    super(props);
    const { pane } = this.props;
    const { search } = pane;
    this.state = {
      // 列表数据
      assetList: [],
      // 检索到的资产总数
      totalCount: 0,
      current: 1,
      pageSize: 10,
      searchParam: {
        start: 0,
        pageSize: 10,
        orderDir: 'desc',
        showHighlight: true,
        showAggregrations: true,
        search,
      },
      typeNameAgg: [],
    };
  }

  componentDidMount() {
    this.doSearch();
  }

  doSearch = () => {
    const { dispatch } = this.props;
    const { searchParam } = this.state;
    dispatch({
      type: 'mmAssets/searchElement',
      payload: {
        searchParam,
      },
    }).then(() => {
      const { searchResult } = this.props;
      this.initSearchData(searchResult);
    });
  };

  onShowSizeChange = (page, pageSize) => {
    const { searchParam } = this.state;
    searchParam.pageSize = pageSize;
    searchParam.start = (page - 1) * pageSize;
    this.setState({ searchParam, current: page, assetList: [], pageSize });
    this.doSearch();
  };


  onPageChange = (page, pageSize) => {
    const { searchParam } = this.state;
    searchParam.pageSize = pageSize;
    searchParam.start = (page - 1) * pageSize;
    this.setState({ searchParam, current: page, assetList: [] });
    this.doSearch();
  };

  initSearchData = res => {
    if (res) {
      this.setState({ totalCount: res.iTotalRecords });
      const { listData } = res;
      if (listData) {
        const temp = JSON.parse(listData);
        this.setState({ assetList: temp });
      }
      const { aggsData } = res;
      if (aggsData) {
        const temp = JSON.parse(aggsData);
        const typeNameAgg = temp.aggs_typeName.buckets;
        if (typeNameAgg) {
          this.setState({ typeNameAgg });
        }
      }
    }
  };

  /**
   * 过滤下拉框的数据
   * @param arr
   * @returns {null|*}
   */
  filterSelectData = arr => {
    if (arr && arr.length > 0) {
      return arr.map(temp => {
        const vKey = temp.key;
        const value = vKey + ' (' + temp.doc_count + ')';
        return <Option value={vKey}>{value}</Option>;
      });
    }
    return null;
  };

  /**
   * 进行类型过滤时候的触发事件
   * @param value
   */
  onTypeNameSelect = value => {
    const { searchParam } = this.state;
    let { searchConditions } = searchParam;
    if (!searchConditions) {
      searchConditions = [];
    }
    const temp = [];
    searchConditions.forEach(item => {
      if (item.colName !== 'typeName') {
        temp.push(item);
      }
    });
    if (value) {
      temp.push({
        colName: 'typeName',
        operator: 'eq',
        colValue: value,
      });
    }
    searchParam.searchConditions = temp;
    searchParam.start = 0;
    searchParam.displayStart = 0;
    searchParam.displayLength = 10;
    this.setState({ searchParam, current: 1, assetList: [] });
    this.doSearch();
  };

  searchAssets = searchInput => {
    const { searchParam } = this.state;
    searchParam.search = searchInput;
    searchParam.start = 0;
    searchParam.displayStart = 0;
    searchParam.displayLength = 10;
    this.setState({ searchParam, current: 1, assetList: [] });
    this.doSearch();
  };

  assetArea = assetList => {
    // 如果无数据，显示空白页面
    if (!assetList || assetList.length === 0) {
      return (
        <div className={styles.emptyContent}>
          <Empty
            image={emptyImg}
            imageStyle={{
              height: 180,
            }}
            description={<span className={styles.emptyText}>未检索到数据</span>}
          />
        </div>
      );
    }

    const { totalCount, current, pageSize } = this.state;
    return (
      <div className={styles.assetList}>
        {this.assetList(assetList)}
        <div className={styles.assetPagination}>
          <Pagination
            size="small"
            total={totalCount}
            current={current}
            pageSize={pageSize}
            pageSizeOptions={['10', '20', '30', '40']}
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.onPageChange}
          />
        </div>
      </div>
    );
  };

  assetList = assetList =>
    assetList.map(asset => {
      return this.assetContent(asset);
    });

  openAssetPage = (id, title) => {
    const pane = { title, type: 'AssetMainPage', key: id };
    const { addTab } = this.props;
    addTab(pane);
  };

  assetContent = asset => {
    // 替换图标路径为一体化平台图标路径
    let { icon } = asset;
    icon = icon.substring(icon.lastIndexOf('/') + 1);

    let termTitle = '';
    if (asset.termElements && asset.termElements.length > 0) {
      const termElement = asset.termElements[0];
      termTitle = (
        <div key={asset.id} className={styles.termArea}>
          <span>
            |&nbsp;&nbsp;
            <img className={styles.termIcon} src={termIcon} alt="" />
            &nbsp;
            <div
              className={styles.termTitle}
              dangerouslySetInnerHTML={{ __html: termElement.name }}
            />
          </span>
        </div>
      );
    }

    return (
      <div key={asset.id} className={styles.assetInfoArea}>
        <div className={styles.assetIconArea}>
          <img
            className={styles.assetIcon}
            alt=""
            /* eslint-disable-next-line global-require,import/no-dynamic-require */
            src={require('@/assets/mm/asset-icons/' + icon)}
          />
        </div>
        <div className={styles.assetAttrArea}>
          <div className={styles.assetTitleRow}>
            <div className={styles.assetTitle}>
              <div
                dangerouslySetInnerHTML={{ __html: asset.name }}
                onClick={this.openAssetPage.bind(this, asset.id, asset.title)}
              />
            </div>
            {termTitle}
          </div>
          <div className={styles.assetAttr}>
            类型：{asset.typeName} &nbsp;&nbsp;&nbsp;&nbsp; 更新时间：
            {moment(parseInt(asset.modifiedTime, 10)).format('YYYY-MM-DD HH:mm:ss')}
            &nbsp;&nbsp;&nbsp;&nbsp;位置：{asset.namePath}
          </div>
          <div className={styles.assetDescription}>
            <div
              dangerouslySetInnerHTML={{
                __html: asset.description ? asset.description : '暂无描述信息',
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    // 获取服务返回的数据
    const { assetList, totalCount } = this.state;
    const { searchLoading } = this.props;
    const { searchParam, typeNameAgg } = this.state;

    return (
      <Spin spinning={searchLoading}>
        <div className={styles.assetContent}>
          <div className={styles.assetSearchDiv}>
            <Search
              placeholder="请输入关键词"
              style={{ width: 'calc(100% - 10px)' }}
              onSearch={value => this.searchAssets(value)}
              enterButton
              maxLength={100}
              allowClear
              defaultValue={searchParam.search}
            />
          </div>
          <div className={styles.assetFilterDiv}>
            &nbsp;&nbsp;类型：&nbsp;
            <Select
              size="small"
              placeholder="请选择类型"
              style={{ width: '120px' }}
              allowClear
              onChange={this.onTypeNameSelect}
            >
              {this.filterSelectData(typeNameAgg)}
            </Select>
          </div>
          <div className={styles.sumInfoDiv}>搜索到 {totalCount} 个结果</div>
          {this.assetArea(assetList)}
        </div>
      </Spin>
    );
  }
}

export default AssetList;
