import {Component, OnInit, ViewChild} from '@angular/core';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import {  EditSettingsModel } from '@syncfusion/ej2-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { DialogEditEventArgs } from '@syncfusion/ej2-angular-grids';
import { Dialog } from '@syncfusion/ej2-popups';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public data: Object[] = [];
  @ViewChild(TreeGridComponent)
  public treegrid: TreeGridComponent | any;
  public dataManager: DataManager | any;
  public pageSettings: Object | any;
  public contextMenuItems: Object | any;
  public editing: EditSettingsModel | any;
  public toolbar: string[] | any;
  public editparams: Object = {};
  public rowIndex: number;
  public cellIndex: number;
  public filterSettings: any;
  public sortSettings: Object;
  public selectionSettings: any = {};
  public rows: Object[] = [];
  public columns: any = [];
  public selectedColumn: any;
  public selectedRow: any;
  // Cut
  private moveRow: any = null;

// Copy/Paste
  private clone: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    let me = this;
    this.http.get('http://localhost:9000/columns').subscribe(data => {
      me.columns = data;
    });
    this.dataManager = new DataManager({
      url:
          'http://localhost:9000/file',
      // 'https://ej2services.syncfusion.com/production/web-services/api/SelfReferenceData',
      adaptor: new WebApiAdaptor(),
      crossDomain: true,
      dataType: 'json'
    });
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' }
    this.editing = { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Dialog' };
    this.editparams = {params: { format: 'n' }};
    // this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ColumnChooser'];
    this.selectionSettings = { type: 'Single' };
    this.contextMenuItems= [
      'AddRow',
      'Edit',
      'Delete',
      'Save',
      'Cancel',
      'FirstPage',
      'PrevPage',
      'LastPage',
      'NextPage',
      'Copy',
      'Paste',
      { text: 'Freeze Column', target: '.e-headercontent', id: 'freezecol' },
      { text: 'Filter Bar', target: '.e-headercontent', id: 'filterbar' },
      { text: 'Multisort', target: '.e-headercontent', id: 'multisort' },
      { text: 'New Column', target: '.e-headercontent', id: 'addColumn' },
      { text: 'Edit Column', target: '.e-headercontent', id: 'editColumn' },
      { text: 'Delete Column', target: '.e-headercontent', id: 'deleteColumn' },
      { text: 'Multiselect', target: '.e-content', id: 'multiselectrow' },
      { text: 'Copy', target: '.e-content', id: 'customCopy' },
      { text: 'Cut', target: '.e-content', id: 'customCut' },
      { text: 'Paste', target: '.e-content', id: 'customPaste' }
    ]
  }

  contextMenuOpen (args: {
    column: any;
    rowInfo: {
      rowData: any;
      row: any;
      rowIndex: number; cellIndex: number; }; }): void {
    if (args.rowInfo.row) this.selectedRow = args.rowInfo;
    this.rowIndex = args.rowInfo.rowIndex;
    this.cellIndex = args.rowInfo.cellIndex;
    if (args.column) this.selectedColumn = args.column;
  }

  showDialog (headerName: string, placeholder: string, isEdit: boolean): void {
    let me = this;
    let inputValue = isEdit ? me.selectedColumn.headerText : '';
    let dialogObj: Dialog = new Dialog({
      width: '335px',
      header: headerName,
      content: '<input type="text" class="e-input" id="columnName" ' +
          'value="'+inputValue+'" placeholder="'+placeholder+'" name="columnName">',
      target: document.getElementById('target'),
      animationSettings: { effect: 'None' },
      buttons: [{
        click: dlgButtonClick,
        buttonModel: { content: 'OK', isPrimary: true }
      },
        {
          click: dialogClose,
          buttonModel: { content: 'CANCEL', isPrimary: true }
        }],
      open: dialogOpen,
      close: dialogClose
    });
    dialogObj.appendTo('#modalDialog');
    dialogObj.show();

    function dlgButtonClick(): void {
      // @ts-ignore
      let val = document.querySelector('input[name="columnName"]')['value'];
      document.getElementById('modalDialog').innerHTML = '';
      me.columns = [];
      me.http.post('http://localhost:9000/columns',
          {headerText: val, field: isEdit ? me.selectedColumn.field : val.replace(/\s/g, ""), isEdit: isEdit, format: 'null'}).subscribe(data => {
        me.columns = data;
        dialogObj.destroy();
      });
    }

    // 'Open' Button will be shown, if modal Dialog is closed
    function dialogClose(): void {
      document.getElementById('modalDialog').innerHTML = '';
      dialogObj.destroy();
    }

    // 'Open' Button will be hidden, if modal Dialog is opened
    function dialogOpen(): void {}
  }

  contextMenuClick (args?: MenuEventArgs): void {
    switch (args.item.id) {
      case 'filterbar':
        this.treegrid.grid.allowFiltering = !this.treegrid.grid.allowFiltering;
        this.treegrid.grid.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
        this.treegrid.refresh();
        break;
      case 'multisort':
        this.treegrid.grid.allowSorting = !this.treegrid.grid.allowSorting;
        this.treegrid.refresh();
        break;
      case 'addColumn':
          this.showDialog('Create column', 'Column name', false);
        break;
      case 'deleteColumn':
        // @ts-ignore
        this.http.post('http://localhost:9000/deleteColumn', {field: this.selectedColumn.field}).subscribe(data => {
          this.columns = data;
        });
        this.treegrid.refreshColumns(); //Refresh Columns
        break;
      case 'editColumn':
        this.showDialog('Edit column', 'Column name', true);
        break;
      case 'multiselectrow':
        this.treegrid.grid.selectionSettings.type = (this.treegrid.grid.selectionSettings.type === 'Single') ? 'Multiple' : 'Single';
        this.treegrid.refresh();
        break;
      case 'freezecol':
        // @ts-ignore
        this.treegrid.grid.getColumnByField(args['column'].field).freeze = 'left';
        this.treegrid.refresh();
        console.log(this.treegrid);
        break;
      case 'customCut':
        this.selectedRow.row.classList.add('selectedRow');
        this.moveRow = this.selectedRow;
        break;
      case 'customCopy':
        this.clone = this.treegrid.copy(this.selectedRow);
        break;
      case 'customPaste':
        var rowIndex = this.selectedRow.rowIndex;
        var cellIndex = this.cellIndex;
        var copyContent = this.treegrid.clipboardModule.copyContent;
        this.treegrid.paste(copyContent, rowIndex, cellIndex);
        this.treegrid.clearSelection();
        this.treegrid.refresh();
        break;
    }
  }

  actionComplete(args: DialogEditEventArgs) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog as Dialog;
      const TaskName = 'TaskName';
      dialog.height = 400;
      // change the header of the dialog
      // @ts-ignore
      dialog.header = args.requestType === 'beginEdit' ? 'Record of ' + args.rowData[TaskName] : 'New Task';
    }
  }
}
