import XLSX from 'xlsx';
import FileSaver from 'file-saver';

export function renderXLSX (excelData, fileName) {
  const wb = {SheetNames: [], Sheets: {}};
  excelData.map((sheetData, index) => {
    const sheetName = 'Sheet' + (index + 1);
    wb.SheetNames.push(sheetName);
    const ws = {};
    ws['!ref'] = XLSX.utils.encode_range({s: {c: 0, r: 0},
      e: {c: sheetData.columnInfo.length - 1, r: sheetData.data.length}});
    sheetData.columnInfo.map((colItem, colNum) => {
      const cell = {v: colItem.name, t: 's'};
      const cellRef = XLSX.utils.encode_cell({c: colNum, r: 0});
      ws[cellRef] = cell;
    });
    sheetData.data.map((rowData, rowNum) => {
      sheetData.columnInfo.map((colItem, colNum) => {
        if (rowData[colItem.key]) {
          const cell = {v: rowData[colItem.key], t: 's'};
          const cellRef = XLSX.utils.encode_cell({c: colNum, r: rowNum + 1});
          ws[cellRef] = cell;
        }
      });
    });
    wb.Sheets[sheetName] = ws;
  });
  const wbOut = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'binary'});
  const buf = new ArrayBuffer(wbOut.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== wbOut.length; ++i) {
    view[i] = wbOut.charCodeAt(i) & 0xFF;
  }
  const blob = new Blob([buf], {type: 'application/octet-stream'});
  FileSaver.saveAs(blob, fileName);
}

export function easyExportXLSX (data, option) {
  option = option || {};
  option = {
    fileName: option.fileName || (new Date()).toISOString().split('T')[0],
    beforRow: option.beforRow || [],
    afterRow: option.afterRow || []
  };
  data = data || [];
  let exportData = data;
  let excelData = {
    columnInfo: [],
    data: []
  };

  let colHeadRow = {};
  for (var key in exportData[0]) {
    let colInfo = {};
    colInfo['name'] = '';
    colInfo['key'] = key;
    colHeadRow[key] = key;
    excelData.columnInfo.push(colInfo);
  };

  if (!excelData.columnInfo.length) {
    excelData.columnInfo.push({name: '', key: 'defaultColumn'});
  }

  exportData = [colHeadRow].concat(exportData);
  exportData = insertRow(excelData, 'beforRow').concat(exportData);
  exportData = exportData.concat(insertRow(excelData, 'afterRow'));

  exportData.map(function (row, index) {
    if (index === 0 && option.beforRow.length > 0) {
      excelData.columnInfo[0].name = option.beforRow[0];
    } else {
      let colDataItem = {};
      for (let key in row) {
        colDataItem[key] = row[key];
      }
      excelData.data.push(colDataItem);
    }
  });

  function insertRow (excelData, position) {
    let insertData = [];
    option[position].map(function (string, index) {
      let extraData = {};
      extraData[excelData.columnInfo[0].key] = string;
      insertData.push(extraData);
    });
    return insertData;
  }

  renderXLSX([excelData], option.fileName + '.xlsx');
}
