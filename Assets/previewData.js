import React, { Component, Fragment } from 'react';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  Icon,
  Input,
  message,
  Row,
  Select,
  Spin,
  Switch,
  Table,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import { formatDate } from '@/utils/Mm/mmUtils';

import { getSessionCache } from '@/utils/Platform/platformUtil';
import styles from './previewData.less';

const { Option } = Select;
const COLUMN_CODE = 'Column';
const { Panel } = Collapse;
const { TextArea } = Input;

let id = 0;

@Form.create()
@connect(() => ({}))
class PreviewData extends Component {
  state = {
    columns: null,
    data: null,
    dataSize: 20,
    dataShowTag: false,
    showSize: 0,
    totalSize: 0,
    tableLoading: false,
    ownedElements: [],
    checkboxDataList: [],
    choiceCheckboxList: [],
    whereSqlList: [],
    defaultActiveKeys: ['1', '2'],
    separator: '',
    disabled: false,
    textSql: '',
  };

  componentDidMount() {
    const { element } = this.props;
    const elementType = element.type;
    this.getSqlSeparator();
    this.add();
    if (elementType === COLUMN_CODE) {
      this.setState({ defaultActiveKeys: ['2'] });
      const { idPath } = element;
      const ids = idPath.split('/');
      this.getElementsByOwner(ids[ids.length - 2]);
    } else {
      this.getElementsByOwner(element.id);
    }
  }

  getDescription = value => {
    if (value) {
      return <span>({value})</span>;
    }
    return '';
  };

  getTableColumnList = () => {
    const { choiceCheckboxList, ownedElements } = this.state;
    const elements = [];

    if (choiceCheckboxList && choiceCheckboxList.length > 0) {
      choiceCheckboxList.forEach(choiceCheckbox => {
        ownedElements.forEach(element => {
          if (choiceCheckbox === element.name) {
            elements.push(element);
          }
        });
      });
    } else {
      ownedElements.forEach(element => {
        elements.push(element);
      });
    }

    return elements;
  };

  /**
   * 获取预览数据表格
   * @returns {string|*}
   */
  getPreviewDataTable = () => {
    const { columns, data } = this.state;
    if (columns) {
      const { element } = this.props;
      return (
        <div className={styles.tableContainer}>
          <Table
            tableLayout="fixed"
            size="small"
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ x: '100%' }}
            key={'table_' + element.id}
          />
        </div>
      );
    }
    return '';
  };

  /**
   * 展示数据量下拉选择框变化事件
   * @param value
   */
  onSelectChange = value => {
    // eslint-disable-next-line radix
    const dataSize = Number(value);
    this.setState({ dataSize });
    this.getPreviewData(dataSize);
  };

  getSqlSeparator = () => {
    const { dispatch, element } = this.props;
    dispatch({
      type: 'mmAssets/getSqlSeparator',
      payload: {
        dataSourceId: element.dataSourceElement.id,
      },
    }).then(result => {
      this.setState({ separator: result });
    });
  };

  getElementsByOwner = elementId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mmAssets/getElementsByOwner',
      payload: {
        ownerId: elementId,
      },
    }).then(elements => {
      if (elements) {
        const ownedElements = [];
        const checkboxDataList = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].type === 'Column') {
            checkboxDataList.push({ label: elements[i].name, value: elements[i].name });
            ownedElements.push(elements[i]);
          }
        }
        this.setState({ checkboxDataList, ownedElements });
      }
    });
  };

  getCheckboxDataList = () => {
    const { checkboxDataList } = this.state;
    if (!checkboxDataList) {
      return '';
    }

    const { element } = this.props;
    const elementType = element.type;
    if (elementType === COLUMN_CODE) {
      return '';
    }

    return (
      <Panel header="选择结果列" key="1" className={styles.lastInfoCollapsePanel}>
        <Checkbox.Group onChange={this.onChange} style={{ width: '100%' }}>
          <Row>
            {checkboxDataList
              ? checkboxDataList.map(item => {
                  return (
                    <Col span={4} key={'CheckboxCol_' + item.value}>
                      <Checkbox value={item.value}>{item.label}</Checkbox>
                    </Col>
                  );
                })
              : null}
          </Row>
        </Checkbox.Group>
      </Panel>
    );
  };

  setWhereText(k, e) {
    const { value } = e.target;
    if (value) {
      if (value.indexOf(';') !== -1) {
        message.error("SQL不能包含';'");
        return;
      }
    }
    this.setState({ textSql: value });
  }

  /**
   * 根据数据初始化表格的列和数据
   * @param data
   */
  initData = data => {
    const elements = this.getTableColumnList();
    if (elements && elements.length > 0) {
      const columns = [];
      // eslint-disable-next-line no-restricted-syntax,guard-for-in
      elements.forEach(element => {
        const { name } = element;
        let column;
        if (element.attributes && element.attributes.datatype) {
          if (element.attributes.datatype.indexOf('datetime') !== -1) {
            column = {
              title: (
                <div>
                  {name}
                  {this.getDescription(element.description)}
                </div>
              ),
              dataIndex: name,
              key: name,
              sorter: false,
              width: 150,
              onCell: () => {
                return {
                  style: {
                    maxWidth: 150,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                  },
                };
              },
              render: text => {
                if (text) {
                  return (
                    <Tooltip
                      placement="topLeft"
                      title={formatDate(new Date(text), 'yyyy-MM-dd HH:mm:ss')}
                    >
                      {formatDate(new Date(text), 'yyyy-MM-dd HH:mm:ss')}
                    </Tooltip>
                  );
                }
                return '-';
              },
            };
          } else if (element.attributes.datatype.indexOf('date') !== -1) {
            column = {
              title: (
                <div>
                  {name}
                  {this.getDescription(element.description)}
                </div>
              ),
              dataIndex: name,
              key: name,
              sorter: false,
              width: 150,
              onCell: () => {
                return {
                  style: {
                    maxWidth: 150,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                  },
                };
              },
              render: text => {
                if (text) {
                  return (
                    <Tooltip placement="topLeft" title={formatDate(new Date(text), 'yyyy-MM-dd')}>
                      {formatDate(new Date(text), 'yyyy-MM-dd')}
                    </Tooltip>
                  );
                }
                return '-';
              },
            };
          } else {
            column = {
              title: (
                <div>
                  {name}
                  {this.getDescription(element.description)}
                </div>
              ),
              dataIndex: name,
              key: name,
              sorter: false,
              width: 150,
              onCell: () => {
                return {
                  style: {
                    maxWidth: 150,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                  },
                };
              },
              render: text => {
                if (text) {
                  return (
                    <Tooltip placement="topLeft" title={text}>
                      {text}
                    </Tooltip>
                  );
                }
                return '-';
              },
            };
          }
        } else {
          column = {
            title: (
              <div>
                {name}
                {this.getDescription(element.description)}
              </div>
            ),
            dataIndex: name,
            key: name,
            sorter: false,
            width: 150,
            onCell: () => {
              return {
                style: {
                  maxWidth: 150,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  cursor: 'pointer',
                },
              };
            },
            render: text => {
              if (text) {
                return (
                  <Tooltip placement="topLeft" title={text}>
                    {text}
                  </Tooltip>
                );
              }
              return '-';
            },
          };
        }
        columns.push(column);
      });
      this.setState({ columns, data });
    }
  };

  /**
   * 获取预览数据
   * @param pageSize
   */
  getPreviewData = pageSize => {
    const { dispatch, element } = this.props;
    const { dataSize, choiceCheckboxList, ownedElements } = this.state;
    let size;
    if (pageSize) {
      size = pageSize;
    } else {
      size = dataSize;
    }
    const elementType = element.type;
    let tableName = '';
    if (elementType === COLUMN_CODE) {
      const { namePath } = element;
      const names = namePath.split('/');
      tableName = names[names.length - 2];
    } else {
      tableName = element.name;
    }

    let columnNames = [];
    if (choiceCheckboxList && choiceCheckboxList.length > 0) {
      columnNames = choiceCheckboxList;
    } else {
      ownedElements.forEach(item => {
        columnNames.push(item.name);
      });
    }

    const productId = getSessionCache('productId');
    const previewQueryParam = {
      elementId: element.id,
      dataSize: size,
      sql: this.getSql(),
      countSql: this.getCountSql(),
      productId,
      tableName,
      columnName: columnNames.join(','),
      dataSourceId: element.dataSourceElement.id,
    };
    this.setState({ tableLoading: true });
    dispatch({
      type: 'mmAssets/previewData',
      payload: {
        previewQueryParam,
      },
    }).then(result => {
      if (result) {
        const { total } = result;
        const { data } = result;
        const totalSize = total;
        let showSize = size;
        if (size > totalSize) {
          showSize = total;
        }
        this.initData(data);
        this.setState({
          dataShowTag: true,
          showSize,
          totalSize,
          tableLoading: false,
          defaultActiveKeys: [],
        });
      } else {
        this.setState({ tableLoading: false });
      }
    });
  };

  getSearchCondition = formItems => {
    const { disabled } = this.state;
    if (disabled) {
      return <Form>{formItems}</Form>;
    }
    return (
      <TextArea
        style={{ width: '80%' }}
        rows={4}
        key="input_-1"
        placeholder="请输入内容"
        onChange={value => this.setWhereText(-1, value)}
      />
    );
  };

  onChange = e => {
    this.setState({ choiceCheckboxList: e });
  };

  /**
   * 获取select语句
   * @returns {*}
   */
  getSelectSql = () => {
    return (
      <div id="selectContainer" className={styles.selectContainer}>
        {this.getSql()}
      </div>
    );
  };

  getSql = () => {
    let sql = 'select ';
    const { element } = this.props;
    const { choiceCheckboxList, whereSqlList, separator, textSql, disabled } = this.state;
    const elementType = element.type;
    if (elementType === COLUMN_CODE) {
      const { namePath } = element;
      const names = namePath.split('/');
      const tableName = names[names.length - 2];
      sql =
        'select ' +
        separator +
        element.name +
        separator +
        ' from ' +
        separator +
        tableName +
        separator;
    } else {
      if (choiceCheckboxList && choiceCheckboxList.length > 0) {
        sql = sql + separator + choiceCheckboxList.join(separator + ',' + separator) + separator;
      } else {
        sql += '* ';
      }

      const { namePath } = element;
      const names = namePath.split('/');
      const schemaName = names[names.length - 2];
      sql =
        sql +
        ' from ' +
        separator +
        schemaName +
        separator +
        '.' +
        separator +
        element.name +
        separator;
    }
    if (disabled) {
      if (whereSqlList && whereSqlList.length > 0) {
        let whereSql = ' where ';
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < whereSqlList.length; i++) {
          if (i === whereSqlList.length - 1) {
            whereSql =
              whereSql +
              separator +
              whereSqlList[i].columnValue +
              separator +
              ' ' +
              whereSqlList[i].whereContent +
              ' ';
          } else {
            whereSql =
              whereSql +
              separator +
              whereSqlList[i].columnValue +
              separator +
              ' ' +
              whereSqlList[i].whereContent +
              ' and ';
          }
        }
        sql += whereSql;
      }
    } else if (textSql && textSql.trim()) {
      sql += ' where ' + textSql;
    }
    return sql;
  };

  getCountSql = () => {
    let sql = 'select count(*) ';
    const { element } = this.props;
    const { whereSqlList, separator, textSql, disabled } = this.state;
    const elementType = element.type;
    if (elementType === COLUMN_CODE) {
      const { namePath } = element;
      const names = namePath.split('/');
      const tableName = names[names.length - 2];
      sql = sql + ' from ' + separator + tableName + separator;
    } else {
      const { namePath } = element;
      const names = namePath.split('/');
      const schemaName = names[names.length - 2];
      sql =
        sql +
        ' from ' +
        separator +
        schemaName +
        separator +
        '.' +
        separator +
        element.name +
        separator;
    }
    if (disabled) {
      if (whereSqlList && whereSqlList.length > 0) {
        let whereSql = ' where ';
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < whereSqlList.length; i++) {
          if (i === whereSqlList.length - 1) {
            whereSql =
              whereSql +
              separator +
              whereSqlList[i].columnValue +
              separator +
              ' ' +
              whereSqlList[i].whereContent +
              ' ';
          } else {
            whereSql =
              whereSql +
              separator +
              whereSqlList[i].columnValue +
              separator +
              ' ' +
              whereSqlList[i].whereContent +
              ' and ';
          }
        }
        sql += whereSql;
      }
    } else if (textSql) {
      sql += ' where ' + textSql;
    }
    return sql;
  };

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
    const { whereSqlList } = this.state;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < whereSqlList.length; i++) {
      if (whereSqlList[i].key === k) {
        whereSqlList.splice(i, 1);
        this.setState({ whereSqlList });
        return;
      }
    }
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    // eslint-disable-next-line no-plusplus
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  setWhereContent = (k, e) => {
    const { value } = e.target;
    const { whereSqlList } = this.state;
    if (value) {
      if (value.indexOf(';') !== -1) {
        message.error("SQL不能包含';'");
        return;
      }

      if (whereSqlList) {
        if (whereSqlList.length === 0) {
          whereSqlList.push({
            key: k,
            whereContent: value,
            columnValue: '',
          });
          this.setState({ whereSqlList });
          return;
        }

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < whereSqlList.length; i++) {
          if (whereSqlList[i].key === k) {
            whereSqlList[i].whereContent = value;
            this.setState({ whereSqlList });
            return;
          }
        }

        whereSqlList.push({
          key: k,
          whereContent: value,
          columnValue: '',
        });
        this.setState({ whereSqlList });
      }
    } else {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < whereSqlList.length; i++) {
        if (whereSqlList[i].key === k) {
          if (whereSqlList[i].columnValue === '') {
            whereSqlList.splice(i);
            this.setState({ whereSqlList });
            return;
          }
          whereSqlList[i].whereContent = '';
          this.setState({ whereSqlList });
          return;
        }
      }
    }
  };

  setWhereColumn = (k, value) => {
    const { whereSqlList } = this.state;
    if (value) {
      if (whereSqlList) {
        if (whereSqlList.length === 0) {
          whereSqlList.push({
            key: k,
            columnValue: value,
            whereContent: '',
          });
          this.setState({ whereSqlList });
          return;
        }

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < whereSqlList.length; i++) {
          if (whereSqlList[i].key === k) {
            whereSqlList[i].columnValue = value;
            this.setState({ whereSqlList });
            return;
          }
        }
        whereSqlList.push({
          key: k,
          columnValue: value,
          whereContent: '',
        });
        this.setState({ whereSqlList });
      }
    } else {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < whereSqlList.length; i++) {
        if (whereSqlList[i].key === k) {
          if (whereSqlList[i].whereContent === '') {
            whereSqlList.splice(i);
            this.setState({ whereSqlList });
            return;
          }
          whereSqlList[i].columnValue = '';
          this.setState({ whereSqlList });
          return;
        }
      }
    }
  };

  setPanelKeys = e => {
    this.setState({ defaultActiveKeys: e });
  };

  viewMinusIcon = (keys, k) => {
    if (keys.length > 1) {
      return (
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => this.remove(k)}
          style={{ 'margin-left': '10px' }}
        />
      );
    }
    return '';
  };

  handleDisabledChange = disabled => {
    this.setState({ disabled, textSql: '', whereSqlList: [] });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      element,
    } = this.props;
    const {
      dataShowTag,
      showSize,
      totalSize,
      tableLoading,
      ownedElements,
      defaultActiveKeys,
      disabled,
    } = this.state;
    if (element) {
      getFieldDecorator('keys', { initialValue: [] });
      const keys = getFieldValue('keys');
      const formItems = keys.map(k => (
        <Form.Item required={false} key={k}>
          <Row>
            <Col span={7}>
              <Select
                key={'selectColumn_' + k}
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择列名称"
                style={{ 'margin-right': '5px' }}
                onChange={value => this.setWhereColumn(k, value)}
              >
                {ownedElements
                  ? ownedElements.map(ownedElement => {
                      return (
                        <Option
                          key={'selectColumn_' + k + ownedElement.name}
                          value={ownedElement.name}
                        >
                          {ownedElement.name}
                        </Option>
                      );
                    })
                  : null}
              </Select>
            </Col>
            <Col span={15}>
              <Input
                key={'input_' + k}
                placeholder="请输入内容"
                style={{ 'margin-right': '5px' }}
                onChange={value => this.setWhereContent(k, value)}
              />
            </Col>
            <Col span={2}>
              <Icon
                type="plus-circle"
                theme="twoTone"
                onClick={() => this.add()}
                style={{ 'margin-left': '10px' }}
              />
              {this.viewMinusIcon(keys, k)}
            </Col>
          </Row>
        </Form.Item>
      ));

      return (
        <Fragment>
          <div className={styles.dataPreviewContent}>
            <div className={styles.tableInput}>
              <Collapse
                onChange={this.setPanelKeys}
                activeKey={defaultActiveKeys}
                defaultActiveKey={defaultActiveKeys}
                expandIconPosition="right"
              >
                {this.getCheckboxDataList()}
                <Panel header="判断条件" key="2" className={styles.lastInfoCollapsePanel}>
                  <div>
                    <Switch
                      style={{ 'margin-bottom': '10px' }}
                      size="small"
                      checked={disabled}
                      onChange={this.handleDisabledChange}
                      checkedChildren="选择"
                      unCheckedChildren="输入"
                    />
                  </div>
                  {this.getSearchCondition(formItems)}
                </Panel>
              </Collapse>

              {this.getSelectSql()}

              <div className={styles.previewButtonContainer}>
                <Button
                  style={{ float: 'right' }}
                  type="primary"
                  onClick={() => this.getPreviewData(null)}
                >
                  预览
                </Button>
              </div>
            </div>
            <div className={styles.dataContainer} hidden={!dataShowTag}>
              <Spin spinning={tableLoading}>
                <div className={styles.paginationContainer}>
                  <Row>
                    <Col span={6}>
                      <span>展示记录数：</span>
                      <Select defaultValue="20" onChange={this.onSelectChange}>
                        <Option value="10">10</Option>
                        <Option value="20">20</Option>
                        <Option value="50">50</Option>
                        <Option value="100">100</Option>
                        <Option value="200">200</Option>
                      </Select>
                    </Col>
                    <Col span={18}>
                      <div className={styles.totalShow}>
                        本次查询展示&nbsp;{showSize}&nbsp;条，共&nbsp;{totalSize}&nbsp;条
                      </div>
                    </Col>
                  </Row>
                </div>
                {this.getPreviewDataTable()}
              </Spin>
            </div>
          </div>
        </Fragment>
      );
    }
    return '';
  }
}

export default PreviewData;
