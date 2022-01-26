import React, { Component } from 'react';
import { DatePicker, Empty, Input, message, Pagination, Select, Spin, Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import emptyImg from '@/assets/mm/common/empty.png';
import ChangeTrackSelectTable from '@/pages/Mm/Assets/changeTrackSelectTable';
import styles from './asset.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ loading, mmAssets }) => ({
  searchLoading: loading.effects['mmAssets/getHistoryElementListByPageQuery'],
  searchResult: mmAssets.searchResult,
}))
class ChangeTrackSelect extends Component {
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
        displayStart: 0,
        displayLength: 10,
        order: 'startTime',
        orderDir: 'desc',
        showHighlight: true,
        showAggregrations: true,
        search,
      },
      typeNameAgg: [],
    };
  }

  componentDidMount() {
    this.getAllClassList();
    this.doSearch();
  }

  doSearch = () => {
    const { dispatch } = this.props;
    const { searchParam } = this.state;
    dispatch({
      type: 'mmAssets/getHistoryElementListByPageQuery',
      payload: {
        pageQuery: searchParam,
      },
    }).then(result => {
      this.initSearchData(result);
    });
  };

  getAllClassList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getAllClassList',
    }).then(res => {
      if (res) {
        this.setState({ typeNameAgg: res });
      }
    });
  };

  onShowSizeChange = (page, pageSize) => {
    const { searchParam } = this.state;
    searchParam.displayLength = pageSize;
    searchParam.displayStart = (page - 1) * pageSize;
    this.setState({ searchParam, current: page, assetList: [], pageSize });
    this.doSearch();
  };

  onPageChange = (page, pageSize) => {
    const { searchParam } = this.state;
    searchParam.displayLength = pageSize;
    searchParam.displayStart = (page - 1) * pageSize;
    this.setState({ searchParam, current: page, assetList: [] });
    this.doSearch();
  };

  initSearchData = res => {
    if (res) {
      this.setState({ totalCount: res.iTotalRecords });
      const { listData } = res;
      if (listData) {
        this.setState({ assetList: listData });
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
      return arr.map(item => {
        return <Option value={item.id}>{item.name}</Option>;
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
    let { filters } = searchParam;
    if (!filters) {
      filters = {};
    }

    if (value) {
      filters.classId = value;
    } else {
      delete filters.classId;
    }

    searchParam.filters = filters;
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

  openAssetPage = (id, elementDelete, name) => {
    if (elementDelete) {
      message.error('该历史记录：' + name + '已删除，无法进行查看！');
      return;
    }

    const title = '历史记录：' + name;
    const pane = { title, type: 'AssetMainPage', key: id };
    const { addTab } = this.props;
    addTab(pane);
  };

  assetContent = asset => {
    // 替换图标路径为一体化平台图标路径
    let { icon } = asset;
    let iconHtml = '';
    if (icon) {
      icon = icon.substring(icon.lastIndexOf('/') + 1);
      iconHtml = (
        <img
          key={'img' + asset.elementId + new Date(asset.startTime).getTime()}
          className={styles.assetIcon}
          alt=""
          /* eslint-disable-next-line global-require,import/no-dynamic-require */
          src={require('@/assets/mm/asset-icons/' + icon)}
        />
      );
    }

    let { name } = asset;
    if (asset.elementDelete) {
      name += '(已删除)';
    }

    const { type } = asset;

    if (type === 'add') {
      return (
        <div
          key={'asset' + asset.elementId + new Date(asset.startTime).getTime()}
          className={styles.changeTrackInfoArea}
        >
          <div className={styles.assetIconArea}>{iconHtml}</div>
          <div className={styles.assetAttrArea}>
            <div className={styles.assetTitleRow}>
              <Row>
                <Col span={1}>
                  <div className={styles.assetTitleType}>
                    <span>新增：</span>
                  </div>
                </Col>
                <Col span={23}>
                  <div className={styles.assetTitle}>
                    <div
                      dangerouslySetInnerHTML={{ __html: name }}
                      onClick={this.openAssetPage.bind(
                        this,
                        asset.elementId,
                        asset.elementDelete,
                        asset.name
                      )}
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <div className={styles.assetAttr}>
              生效时间：{moment(parseInt(asset.startTime, 10)).format('YYYY-MM-DD HH:mm:ss')}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资产路径：{asset.namePath}
            </div>
            <div className={styles.assetAttr}>变更人：{asset.createdBy}</div>
          </div>
        </div>
      );
    } else if (type === 'delete') {
      return (
        <div
          key={'asset' + asset.elementId + new Date(asset.startTime).getTime()}
          className={styles.changeTrackInfoArea}
        >
          <div className={styles.assetIconArea}>{iconHtml}</div>
          <div className={styles.assetAttrArea}>
            <div className={styles.assetTitleRow}>
              <Row>
                <Col span={1}>
                  <div className={styles.assetTitleType}>
                    <span>删除：</span>
                  </div>
                </Col>
                <Col span={23}>
                  <div className={styles.assetTitle}>
                    <div
                      dangerouslySetInnerHTML={{ __html: name }}
                      onClick={this.openAssetPage.bind(
                        this,
                        asset.elementId,
                        asset.elementDelete,
                        asset.name
                      )}
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <div className={styles.assetAttr}>
              生效时间：{moment(parseInt(asset.startTime, 10)).format('YYYY-MM-DD HH:mm:ss')}
              &nbsp;&nbsp;&nbsp;&nbsp;失效时间：
              {moment(parseInt(asset.endTime, 10)).format('YYYY-MM-DD HH:mm:ss')}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资产路径：{asset.namePath}
            </div>
            <div className={styles.assetAttr}>变更人：{asset.createdBy}</div>
          </div>
        </div>
      );
    }
    return (
      <div
        key={'asset' + asset.elementId + new Date(asset.startTime).getTime()}
        className={styles.changeTrackInfoArea}
      >
        <div className={styles.assetIconArea}>{iconHtml}</div>
        <div className={styles.assetAttrArea}>
          <div className={styles.assetTitleRow}>
            <Row>
              <Col span={1}>
                <div className={styles.assetTitleType}>
                  <span>修改：</span>
                </div>
              </Col>
              <Col span={23}>
                <div className={styles.assetTitle}>
                  <div
                    dangerouslySetInnerHTML={{ __html: name }}
                    onClick={this.openAssetPage.bind(
                      this,
                      asset.elementId,
                      asset.elementDelete,
                      asset.name
                    )}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.assetAttr}>
            生效时间：{moment(parseInt(asset.startTime, 10)).format('YYYY-MM-DD HH:mm:ss')}
            &nbsp;&nbsp;&nbsp;&nbsp;失效时间：
            {moment(parseInt(asset.endTime, 10)).format('YYYY-MM-DD HH:mm:ss')}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资产路径：{asset.namePath}
          </div>
          <div className={styles.assetAttr}>变更人：{asset.createdBy}</div>
          <div className={styles.assetAttr}>
            变更内容：&nbsp;&nbsp;&nbsp;<a onClick={() => this.getTableDialog(asset.attributeCompareResults)}>详细</a>
          </div>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line no-unused-vars
  onChange = (value, dateString) => {
    if (value && value.length === 0) {
      const { searchParam } = this.state;
      let { filters } = searchParam;
      if (!filters) {
        filters = {};
      }

      delete filters.startTime;
      delete filters.endTime;

      searchParam.filters = filters;
      searchParam.start = 0;
      searchParam.displayStart = 0;
      searchParam.displayLength = 10;
      this.setState({ searchParam, current: 1 });
      this.doSearch();
    }
  };

  onOk = value => {
    const { searchParam } = this.state;
    let { filters } = searchParam;
    if (!filters) {
      filters = {};
    }

    if (value) {
      filters.startTime = new Date(value[0]).getTime();
      filters.endTime = new Date(value[1]).getTime();
    }

    searchParam.filters = filters;
    searchParam.start = 0;
    searchParam.displayStart = 0;
    searchParam.displayLength = 10;
    this.setState({ searchParam, current: 1, assetList: [] });
    this.doSearch();
  };

  getTableDialog = (list) => {
    this.child.initPage(list);
  };

  onRef = ref => {
    this.child = ref;
  };

  render() {
    // 获取服务返回的数据
    const { assetList, totalCount } = this.state;
    const { searchLoading } = this.props;
    const { searchParam, typeNameAgg } = this.state;

    return (
      <Spin spinning={searchLoading}>
        <div className={styles.assetContent}>
          <div className={styles.changeTrackSelectDiv}>
            <span>变更时间：</span>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={['开始时间', '结束时间']}
              onChange={this.onChange}
              onOk={this.onOk}
            />
            <span className={styles.changeTrackSelectContentDiv}>类型：</span>
            <Select
              placeholder="请选择类型"
              style={{ width: '120px' }}
              allowClear
              onChange={this.onTypeNameSelect}
            >
              {this.filterSelectData(typeNameAgg)}
            </Select>
            <span className={styles.changeTrackSelectContentDiv}>内容：</span>
            <Search
              placeholder="请输入关键词"
              style={{ width: '40%' }}
              onSearch={value => this.searchAssets(value)}
              enterButton
              maxLength={100}
              allowClear
              defaultValue={searchParam.search}
            />
          </div>
          <div className={styles.sumInfoDiv}>搜索到 {totalCount} 个结果</div>
          {this.assetArea(assetList)}
        </div>
        <ChangeTrackSelectTable onRef={this.onRef} />
      </Spin>
    );
  }
}

export default ChangeTrackSelect;
