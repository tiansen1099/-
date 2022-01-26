import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import styles from './runningRecordTab.less';

@connect(() => ({}))
class RunningRecordTab extends Component {
  state = {
    instanceUrl: null,
  };

  componentDidMount() {
    this.setInstanceUrl();
  }

  setInstanceUrl = () => {
    const { dispatch, standardSetId, tableElementId, pane } = this.props;

    const { isSaCaDataQuality } = pane;
    if (isSaCaDataQuality) {
      dispatch({
        type: 'mmAssets/getGatherIssueDqViewUrl',
        payload: {
          dataSourceId: pane.dataSourceId,
          modelOId: pane.modelOId,
        },
      }).then(res => {
        if (res && res.code === 200) {
          const instanceUrl = res.data + '';
          this.setState({ instanceUrl });
        } else {
          message.error('未发现有效的数据质量服务！');
          this.setState({ instanceUrl: null });
        }
      });
    } else {
      dispatch({
        type: 'mmAssets/getInstancePageUrl',
        payload: {
          standardSetId,
          tableElementId,
        },
      }).then(res => {
        if (res && res.code === 200) {
          const instanceUrl = res.data + '';
          this.setState({ instanceUrl });
        } else {
          message.error('未发现有效的数据质量服务！');
          this.setState({ instanceUrl: null });
        }
      });
    }
  };

  openInstancePage = instanceUrl => {
    if (instanceUrl) {
      return (
        <iframe
          id="runnng_record_id"
          title="runnng_record_title"
          src={instanceUrl}
          name="viewFrame"
          frameBorder="0"
          height="100%"
          width="100%"
        />
      );
    }
    return <div />;
  };

  render() {
    const { instanceUrl } = this.state;
    return (
      <Fragment>
        <div className={styles.tableValidateContent}>
          <div className={styles.instanceBody}>{this.openInstancePage(instanceUrl)}</div>
        </div>
      </Fragment>
    );
  }
}

export default RunningRecordTab;
