import React from 'react';
import ReactDOM from 'react-dom';
import isNil from 'lodash/isNil';
import Table from 'antd/lib/table';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import {easyExportXLSX} from './xlsxUtil';
import CopyToClipboard from 'react-copy-to-clipboard';

const BROKER_TYPES = {
  'ALL': '全部',
  'TP': '第一部分',
  'ICAP': '第二部分',
  'PATR': '第三部分',
  'BGC': '第四部分',
  'TJXT': '第五部分'
};
const {Component, PropTypes} = React;
class BestBid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      activeBroker: 'ALL',
      copy: '',
      style: 'copy-button',
      getstyle: 'copy-data-button'
    }
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    activeBroker: PropTypes.string,
    copy: PropTypes.string,
    style: PropTypes.string,
    getstyle: PropTypes.string
  };

  static defaultProps = {
    data: [
      {key: '1', broker: 'TP', shortName: '170210.IB', bidVol: '2000', bid: '4.25', ofr: '4.22', ofrVol: '1000'},
      {key: '2', broker: 'TP', shortName: '160213.IB', bidVol: '5000', ofr: '4.07', ofrVol: '2000'},
      {key: '3', broker: 'TP', shortName: '130814.SH', bidVol: '3000', bid: '3.87', ofr: '3.86', ofrVol: '3000'},
      {key: '4', broker: 'TP', shortName: '160310.IB', bidVol: '1000', ofrVol: '1000'},
      {key: '5', broker: 'TP', shortName: '13青国投MTN002', bidVol: '5000', bid: '3.98', ofr: '3.90', ofrVol: '2000'},
      {key: '6', broker: 'TP', shortName: '160307.IB', bid: '4.25', ofr: '4.20', ofrVol: '3000'},
      {key: '7', broker: 'TP', shortName: '135557.SH', bidVol: '5000', bid: '4.01', ofrVol: '5000'},
      {key: '8', broker: 'TP', shortName: '170210.IB', bidVol: '2000', bid: '4.25', ofr: '4.22', ofrVol: '1000'},
      {key: '9', broker: 'ICAP', shortName: '14青国投MTN002', bidVol: '3000', bid: '4.25', ofr: '4.22', ofrVol: '1000'},
      {key: '10', broker: 'ICAP', shortName: '160213.BJ', bidVol: '5000', ofr: '4.07', ofrVol: '4000'},
      {key: '11', broker: 'ICAP', shortName: '130814.SH', bidVol: '3000', bid: '3.87', ofr: '3.86', ofrVol: '3000'},
      {key: '12', broker: 'ICAP', shortName: '160310.IB', bidVol: '1000', ofrVol: '1000'},
      {key: '13', broker: 'ICAP', shortName: '13青国投MTN002', bidVol: '5000', bid: '3.98', ofr: '3.90', ofrVol: '2000'},
      {key: '14', broker: 'ICAP', shortName: '160307.IB', bid: '4.25', ofr: '4.20', ofrVol: '3000'},
      {key: '15', broker: 'ICAP', shortName: '135557.SH', bidVol: '5000', bid: '4.01', ofrVol: '5000'},
      {key: '16', broker: 'ICAP', shortName: '170210.IB', bidVol: '2000', bid: '4.25', ofr: '4.22', ofrVol: '1000'},
      {key: '17', broker: 'PATR', shortName: '170210.IB', bidVol: '2000', bid: '4.25', ofr: '4.22', ofrVol: '1000'},
      {key: '18', broker: 'PATR', shortName: '13中建MTN002', bidVol: '5000', ofr: '4.07', ofrVol: '2000'},
      {key: '19', broker: 'PATR', shortName: '130814.SH', bidVol: '3000', bid: '3.87', ofr: '3.86', ofrVol: '3000'},
      {key: '20', broker: 'PATR', shortName: '160310.IB', bidVol: '1000', ofrVol: '1000'},
      {key: '21', broker: 'PATR', shortName: '13青国投MTN002', bidVol: '5000', bid: '3.98', ofrVol: '2000'},
      {key: '22', broker: 'PATR', shortName: '160307.IB', bid: '4.25', ofr: '4.20', ofrVol: '3000'},
      {key: '23', broker: 'PATR', shortName: '135557.SH', bidVol: '5000', bid: '4.01', ofrVol: '5000'},
      {key: '24', broker: 'PATR', shortName: '170210.IB', bidVol: '2000', bid: '4.25', ofr: '4.22', ofrVol: '1000'},
      {key: '25', broker: 'BGC', shortName: '170210.BJ', bidVol: '2000', bid: '4.25', ofr: '4.22', ofrVol: '1000'},
      {key: '26', broker: 'BGC', shortName: '160213.IB', bidVol: '5000', ofr: '4.07', ofrVol: '2000'},
      {key: '27', broker: 'BGC', shortName: '130814.SH', bidVol: '3000', bid: '3.87', ofr: '3.86', ofrVol: '3000'},
      {key: '28', broker: 'BGC', shortName: '160310.IB', bidVol: '1000', ofrVol: '1000'},
      {key: '29', broker: 'BGC', shortName: '13青国投MTN002', bidVol: '5000', bid: '3.98', ofr: '3.90', ofrVol: '2000'},
      {key: '30', broker: 'BGC', shortName: '160307.IB', bid: '4.25', ofr: '4.20', ofrVol: '3000'},
      {key: '31', broker: 'BGC', shortName: '135557.SH', bidVol: '5000', bid: '4.01', ofrVol: '5000'},
      {key: '32', broker: 'BGC', shortName: '170210.IB', bidVol: '2000', bid: '4.25', ofr: '4.22', ofrVol: '1000'},
      {key: '33', broker: 'TJXT', shortName: '13中建MTN002', bidVol: '2000', bid: '3.92', ofr: '3.90', ofrVol: '3000'},
      {key: '34', broker: 'TJXT', shortName: '160213.IB', bidVol: '5000', ofr: '4.07', ofrVol: '2000'},
      {key: '35', broker: 'TJXT', shortName: '130814.SH', bidVol: '3000', bid: '3.87', ofr: '3.86', ofrVol: '3000'},
      {key: '36', broker: 'TJXT', shortName: '160310.IB', bidVol: '1000', ofrVol: '1000'},
      {key: '37', broker: 'TJXT', shortName: '13青国投MTN002', bidVol: '5000', bid: '3.98', ofr: '3.90', ofrVol: '2000'},
      {key: '38', broker: 'TJXT', shortName: '160307.IB', bid: '4.25', ofr: '4.20', ofrVol: '3000'},
      {key: '39', broker: 'TJXT', shortName: '135557.SH', bidVol: '5000', bid: '4.01', ofrVol: '5000'},
      {key: '40', broker: 'TJXT', shortName: '170210.IB', bidVol: '2000', bid: '4.25', ofr: '4.22', ofrVol: '1000'}
    ]
  };

  changeTab(activeBroker) {
    this.setState({activeBroker});
  }

  renderTab() {
    const {activeBroker} = this.state;
    const tabs = [];
    Object.keys(BROKER_TYPES).forEach((k) => {
      const props = {
        key: k,
        className: 'bid-tab-item ' + k
      };
      if (k === activeBroker) {
        props.className += ' active';
      } else {
        props.onClick = this.changeTab.bind(this, k);
      }
      tabs.push(<span {...props}>{BROKER_TYPES[k]}</span>);
    });
    return <div className='bid-tab'>{tabs}</div>;
  }

  setData() {
    const {data, activeBroker} = this.state;
    if (activeBroker === 'ALL') return data;
    return data.filter(d => d.broker === activeBroker);
  }

  setColumns() {
    return [
      {title: '', dataIndex: 'isMarked', width: 40, className: 'marked', render: this.renderMark, onCellClick: this.onMark},
      {title: '债券', dataIndex: 'shortName', className: 'bond', render: this.renderCopy, onCellClick: this.ToCopy},
      {title: 'Vol.Bid', dataIndex: 'bidVol', width: 70, className: 'vbid', render: this.renderNumber},
      {title: 'Bid', dataIndex: 'bid', width: 65, className: 'bid', render: this.renderNumber},
      {title: 'Ofr', dataIndex: 'ofr', width: 65, className: 'ofr', render: this.renderNumber},
      {title: 'Vol.Ofr', dataIndex: 'ofrVol', width: 70, className: 'vofr', render: this.renderNumber}
    ];
  }

  //将复制功能绑定在债券这一项上
  renderCopy = (text) => {
    return <div className='copy-border'>{text}<Button type="primary" className={this.state.getstyle} onClick={this.getData}>获取该行数据</Button><CopyToClipboard text={this.state.copy} onCopy={this.handleClick}>
    <Button type="primary" className={this.state.style}>复制所获取数据行内容</Button></CopyToClipboard></div>;
  }

  //通过这个点击事件先触发单元格事件调用ToCopy()
  getData = () => {
    this.setState({getstyle: 'copy-data-button-none', style: 'copy-button-show'});
  }

  ToCopy = (record) => {
    let clipboardString = '';
    clipboardString = '债券:' + record.shortName;
    clipboardString = clipboardString + ' Vol.Bid:' + (record.bidVol || '--');
    clipboardString = clipboardString + ' Bid:' + (record.bid || '--');
    clipboardString = clipboardString + ' Ofr:' + (record.ofr || '--');
    clipboardString = clipboardString + ' Vol.Ofr:' + (record.ofrVol || '--');
    this.setState({copy: clipboardString})
  }

  //复制成功与否提示
  handleClick = () => {
    if (this.state.copy) {
      message.success('改行内容已经成功复制到剪贴板！');
    } else {
      message.info('没有可复制的发行结果！');
    }
    this.setState({getstyle: 'copy-data-button', style: 'copy-button'});
  };

  //将星星图标渲染上去
  renderMark = (text) => {
    const style = {
      fontSize: 16,
      color: isNil(text) || !text ? '#5e5f63' : '#f5b45f'
    };
    return <span style={style}><Icon type='star' /></span>;
  };

  //单元格回调事件
  onMark = (record) => {
    const {isMarked, key} = record;
    record.isMarked = !isMarked;

    let {data} = this.state;
    data = data.map((d) => {
      if (d.key === key) {
        return record;
      } else {
        return d;
      }
    });
    this.setState({data});
  };

  renderNumber = (text) => {
    return isNil(text) ? '--' : text;
  };

  renderTable() {
    return (
      <Table
        dataSource={this.setData()}
        columns={this.setColumns()}
        pagination={false}
        scroll={{y: 360}} />
    );
  }

  //excel表格导出
  exportClick() {
    let excelResult = this.state.data;
    let excelData = [];
    excelResult.map(function(e, i) {
      excelData[i] = {};
      excelData[i]['债券'] = e.shortName || '--';
      excelData[i]['Vol.Bid'] = e.bidVol || '--';
      excelData[i]['Bid'] = e.bid || '--';
      excelData[i]['Ofr'] = e.ofr || '--';
      excelData[i]['Vol.Ofr'] = e.ofrVol || '--';
    })
    let xlsxExportOption = {
      fileName: '金融数据 - 列表'
    };
    easyExportXLSX(excelData, xlsxExportOption);
  }

  render() {
    return (
      <div className='best-bid'>
        <h4 className='bid-title'>金融数据</h4>
        <Button type="primary" className='export-button' onClick={::this.exportClick}>导出excel</Button>
        {this.renderTab()}
        {this.renderTable()}
      </div>
    );
  }
}

ReactDOM.render(<BestBid />,document.getElementById('main-container')
);
