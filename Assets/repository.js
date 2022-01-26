import React, { Component, Fragment } from 'react';
import FrameBreadcrumb from '@/components/PageBreadcrumb/FrameBreadcrumb';
import RepositoryContent from '@/pages/Mm/Assets/repositoryContent';
import styles from './asset.less';

class Repository extends Component {
  componentDidMount() {}

  render() {
    const BreadcrumbList = [{ title: '资产库' }];

    return (
      <Fragment>
        <FrameBreadcrumb breadcrumbList={BreadcrumbList} />
        <div className={styles.repositoryPage}>
          <RepositoryContent />
        </div>
      </Fragment>
    );
  }
}

export default Repository;
