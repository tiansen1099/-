import React, { Component } from 'react';
import { Layout, Tabs, Tooltip, Dropdown, Menu } from 'antd';
import { connect } from 'dva';
import AssetViewTree from '@/pages/Mm/Assets/assetViewTree';
import AssetList from '@/pages/Mm/Assets/assetList';
import ChangeTrackSelect from '@/pages/Mm/Assets/changeTrackSelect';
import RepositoryHome from '@/pages/Mm/Assets/repositoryHome';
import AssetMainPage from '@/pages/Mm/Assets/assetMainPage';
import RunningRecordTab from '@/pages/Mm/Assets/runningRecordTab';
import { getSessionCache } from '@/utils/Platform/platformUtil';
import { currentUserIsViewRole } from '@/utils/Mm/mmUtils';
import { viewRoleCodes } from '@/mmSettings';
import styles from './asset.less';

const { TabPane } = Tabs;
const { Content, Sider } = Layout;
const MAIN_PAGE_PANE = { title: '首页', type: 'MainPage', key: '-1' };

@connect(({ mmAssets }) => ({
  searchResult: mmAssets.searchResult,
}))
class RepositoryContent extends Component {
  constructor(props) {
    super(props);
    const panes = [MAIN_PAGE_PANE];
    this.state = {
      activeKey: panes[0].key,
      panes,
      operateConfig: {
        assocTermFlag: true,
        maintainAssocFlag: true,
        viewHistoryFlag: true,
        operateBusinessAttrFlag: true,
        operateElementFlag: true,
      },
      currentUser: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/getCurrentUser',
    }).then(user => {
      if (user !== null) {
        this.setState({ currentUser: user });
        const tag = currentUserIsViewRole(user, viewRoleCodes);
        if (tag) {
          this.setState({
            operateConfig: {
              assocTermFlag: false,
              maintainAssocFlag: false,
              viewHistoryFlag: true,
              operateBusinessAttrFlag: false,
              operateElementFlag: false,
            },
          });
        }
      }
    });
  }

  onTabChange = activeKey => {
    this.setState({ activeKey });
  };

  onTabEdit = (targetKey, action) => {
    this[action + 'Tab'](targetKey);
  };

  addTab = pane => {
    const temp = pane;
    const { panes } = this.state;
    let contains = false;
    const activeKey = pane.key;
    panes.forEach(value => {
      if (value.key === activeKey) {
        contains = true;
      }
    });

    if (!contains) {
      temp.key = activeKey;
      temp.activeKey = activeKey;
      panes.push(temp);
    }
    this.setState({ panes, activeKey });
  };

  getTabTitle = title => {
    let titleTemp = title;
    if (titleTemp.length > 10) {
      titleTemp = title.substring(0, 10) + '...';
    }
    return (
      <Tooltip placement="bottomLeft" title={title}>
        <span>{titleTemp}</span>
      </Tooltip>
    );
  };

  removeTab = targetKey => {
    let { activeKey } = this.state;
    let lastIndex;
    const { panes } = this.state;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const fPanes = panes.filter(pane => pane.key !== targetKey);
    if (fPanes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = fPanes[lastIndex].key;
      } else {
        activeKey = fPanes[0].key;
      }
    }
    this.setState({ panes: fPanes, activeKey });
  };

  renderTab = pane => {
    const { operateConfig, activeKey, currentUser } = this.state;
    const { type } = pane;
    const { key } = pane;
    const productCode = getSessionCache('productCode');
    if (productCode === 'MM' || productCode === 'DataAsset') {
      if (type === 'MainPage') {
        return (
          <TabPane tab={this.getTabTitle(pane.title)} key={key} closable={false}>
            <div className={styles.tabContent} style={{ height: 'calc(100% - 40px)' }}>
              <RepositoryHome addTab={this.addTab} currentUser={currentUser} />
            </div>
          </TabPane>
        );
      } else if (type === 'SearchResult') {
        return (
          <TabPane tab={pane.title} key={key}>
            <div className={styles.tabContent} style={{ height: 'calc(100% - 40px)' }}>
              <AssetList pane={pane} addTab={this.addTab} currentUser={currentUser} />
            </div>
          </TabPane>
        );
      } else if (type === 'AssetMainPage') {
        let { tab } = pane;
        if (!tab) {
          tab = '1';
        }
        const { refreshTree } = pane;
        return (
          <TabPane tab={pane.title} key={key}>
            {activeKey === key ? (
              <div className={styles.tabContent} style={{ height: 'calc(100% - 40px)' }}>
                <AssetMainPage
                  pane={pane}
                  elementId={key}
                  tab={tab}
                  operateConfig={operateConfig}
                  addTab={this.addTab}
                  refreshTree={refreshTree}
                  removeTab={this.removeTab}
                  currentUser={currentUser}
                />
              </div>
            ) : (
              <div />
            )}
          </TabPane>
        );
      } else if (type === 'RunningRecordTab') {
        let { tab } = pane;
        if (!tab) {
          tab = '1';
        }
        return (
          <TabPane tab={pane.title} key={key}>
            <div className={styles.tabContent}>
              <RunningRecordTab
                pane={pane}
                tab={tab}
                standardSetId={pane.standardSetId}
                tableElementId={pane.tableElementId}
                currentUser={currentUser}
              />
            </div>
          </TabPane>
        );
      }
    }
    if (type === 'MainPage') {
      return (
        <TabPane tab={pane.title} key={key} closable={false}>
          <div className={styles.tabContent}>
            <RepositoryHome addTab={this.addTab} currentUser={currentUser} />
          </div>
        </TabPane>
      );
    } else if (type === 'SearchResult') {
      return (
        <TabPane tab={pane.title} key={key}>
          <div className={styles.tabContent}>
            <AssetList pane={pane} addTab={this.addTab} currentUser={currentUser} />
          </div>
        </TabPane>
      );
    } else if (type === 'ChangeTrackSelect') {
      return (
        <TabPane tab={pane.title} key={key}>
          <div className={styles.tabContent} style={{ height: 'calc(100% - 40px)' }}>
            <ChangeTrackSelect pane={pane} addTab={this.addTab} currentUser={currentUser} />
          </div>
        </TabPane>
      );
    } else if (type === 'AssetMainPage') {
      let { tab } = pane;
      if (!tab) {
        tab = '1';
      }
      const { refreshTree } = pane;
      return (
        <TabPane tab={pane.title} key={key}>
          {activeKey === key ? (
            <div className={styles.tabContent}>
              <AssetMainPage
                pane={pane}
                elementId={key}
                tab={tab}
                operateConfig={operateConfig}
                addTab={this.addTab}
                refreshTree={refreshTree}
                removeTab={this.removeTab}
                currentUser={currentUser}
              />
            </div>
          ) : (
            <div />
          )}
        </TabPane>
      );
    } else if (type === 'RunningRecordTab') {
      let { tab } = pane;
      if (!tab) {
        tab = '1';
      }
      return (
        <TabPane tab={pane.title} key={key}>
          <div className={styles.tabContent}>
            <RunningRecordTab
              pane={pane}
              tab={tab}
              standardSetId={pane.standardSetId}
              tableElementId={pane.tableElementId}
              currentUser={currentUser}
            />
          </div>
        </TabPane>
      );
    }
    return (
      <TabPane tab={pane.title} key={key}>
        <AssetList currentUser={currentUser} />
      </TabPane>
    );
  };

  openSearchPage = () => {
    const { panes } = this.state;
    let contains = false;
    const activeKey = MAIN_PAGE_PANE.key;
    panes.forEach(value => {
      if (value.key === activeKey) {
        contains = true;
      }
    });

    if (!contains) {
      panes.push(MAIN_PAGE_PANE);
    }
    this.setState({ panes, activeKey });
  };

  /**
   * 关闭所有Tab页（非首页）
   */
  closeAllTabs = () => {
    const panes = [MAIN_PAGE_PANE];
    this.setState({ panes, activeKey: '-1' });
  };

  /**
   * 关闭其他Tab页（非Active和首页）
   */
  closeOtherTabs = () => {
    const { activeKey, panes } = this.state;
    const panesTemp = [];
    panes.forEach(pane => {
      if (pane.key === activeKey || pane.key === '-1') {
        panesTemp.push(pane);
      }
    });
    this.setState({ panes: panesTemp });
  };

  render() {
    const { activeKey, panes, currentUser } = this.state;
    if (currentUser === null) {
      return '';
    }
    const menu = (
      <Menu>
        <Menu.Item onClick={this.closeAllTabs} key="1">
          关闭所有标签页
        </Menu.Item>
        <Menu.Item onClick={this.closeOtherTabs} key="2">
          关闭其他标签页
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.repositoryContent}>
        <Layout style={{ background: '#fff', height: '100%' }}>
          <Sider className={styles.filterSider} style={{ height: '100%' }}>
            <AssetViewTree
              addTab={this.addTab}
              removeTab={this.removeTab}
              openSearchPage={this.openSearchPage}
              currentUser={currentUser}
            />
          </Sider>
          <Content className={styles.mainContent}>
            <Dropdown overlay={menu} trigger={['contextMenu']}>
              <div style={{ height: '100%' }}>
                <Tabs
                  hideAdd
                  onChange={this.onTabChange}
                  defaultActiveKey="-1"
                  activeKey={activeKey}
                  type="editable-card"
                  onEdit={this.onTabEdit}
                  tabBarStyle={{
                    marginLeft: '15px',
                    marginRight: '15px',
                    marginBottom: '0',
                  }}
                  style={{ height: '100%' }}
                >
                  {panes.map(pane => {
                    return this.renderTab(pane);
                  })}
                </Tabs>
              </div>
            </Dropdown>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default RepositoryContent;
