import XLSX from 'xlsx';
import FileSaver from 'file-saver';

export function exportExcel (data, fileName) {
  var ws = XLSX.utils.aoa_to_sheet(data);
  var ws_name = "Sheet1";

  function Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
  }

  var wb = new Workbook();

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  FileSaver.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fileName + ".xlsx");
}
