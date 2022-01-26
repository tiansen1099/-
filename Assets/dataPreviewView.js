import React, { Component, Fragment } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import PreviewData from '@/pages/Mm/Assets/previewData';

const { TabPane } = Tabs;

@connect(() => ({}))
class DatamapTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: null,
    };
  }

  componentDidMount() {
    this.getElementsByIds();
  }

  getElementsByIds = () => {
    const { dispatch, tableList } = this.props;

    const idList = [];
    tableList.forEach(item => {
      idList.push(item.id);
    });

    dispatch({
      type: 'mmAssets/getElementsByIds',
      payload: {
        elementIds: idList,
      },
    }).then(elements => {
      this.setState({ elements });
    });
  };

  getTableList = () => {
    const { elements } = this.state;
    if (!elements || elements.length <= 0) {
      return '';
    }

    return (
      <Tabs tabPosition="top">
        {elements.map(item => (
          <TabPane tab={`表：${item.name}`} key={item.id}>
            <PreviewData element={item} />
          </TabPane>
        ))}
      </Tabs>
    );
  };

  render() {
    return <Fragment>{this.getTableList()}</Fragment>;
  }
}

export default DatamapTab;
