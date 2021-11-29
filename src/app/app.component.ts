import {Component, OnInit, ViewChild} from '@angular/core';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import {  EditSettingsModel } from '@syncfusion/ej2-treegrid';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { DialogEditEventArgs } from '@syncfusion/ej2-angular-grids';
import { Dialog } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import { CheckBox, ChangeEventArgs } from '@syncfusion/ej2-buttons';

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
  // Cut
  private moveRow: any = null;

// Copy/Paste
  private clone: any = null;

  constructor() {}

  ngOnInit(): void {
    this.dataManager = new DataManager({
      url:
          'http://localhost:8080/file',
      // 'https://ej2services.syncfusion.com/production/web-services/api/SelfReferenceData',
      adaptor: new WebApiAdaptor(),
      crossDomain: true,
      dataType: 'json'
    });
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' }
    this.editing = { allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Dialog' };
    this.editparams = {params: { format: 'n' }};
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ColumnChooser'];
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
      { text: 'Freeze Column', target: '.e-headercontent', id: 'freezecol' },
      { text: 'Filter Bar', target: '.e-headercontent', id: 'filterbar' },
      { text: 'Multisort', target: '.e-headercontent', id: 'multisort' },
      { text: 'New Column', target: '.e-headercontent', id: 'insert' },
      { text: 'Delete Column', target: '.e-headercontent', id: 'delete' },
      { text: 'Edit Column', target: '.e-headercontent', id: 'rename' },
      { text: 'Multiselect', target: '.e-content', id: 'multiselectrow' },
      { text: 'Copy', target: '.e-content', id: 'customCopy' },
      { text: 'Cut', target: '.e-content', id: 'customCut' },
      { text: 'Paste', target: '.e-content', id: 'customPaste' }
    ]
    console.log(this.treegrid);
  }

  contextMenuOpen (args: { rowInfo: { rowIndex: number; cellIndex: number; }; }): void {
    this.rowIndex = args.rowInfo.rowIndex;
    this.cellIndex = args.rowInfo.cellIndex;
    console.log(this.treegrid);
  }

  showDialog (): void {
    let dialogObj: Dialog = new Dialog({
      width: '335px',
      header: 'Software Update',
      content: 'Your current software version is up to date.',
      target: document.getElementById('target'),
      isModal: true,
      animationSettings: { effect: 'None' },
      buttons: [{
        click: dlgButtonClick,
        buttonModel: { content: 'OK', isPrimary: true }
      }],
      open: dialogOpen,
      close: dialogClose
    });
    dialogObj.appendTo('#modalDialog');
    // document.getElementById('dialogBtn').focus();

    // let checkBoxObj: CheckBox = new CheckBox({ checked: false, change: onChange });
    // checkBoxObj.appendTo('#checkbox');
    dialogObj.show();
    // Button has been created to open the modal Dialog
    // let button: Button = new Button({
    // });
    // button.appendTo('#dialogBtn');
    // document.getElementById('dialogBtn').onclick = (): void => {
    //   dialogObj.show();
    // };

    function dlgButtonClick(): void {
      dialogObj.hide();
    }

    // 'Open' Button will be shown, if modal Dialog is closed
    function dialogClose(): void {
      // document.getElementById('dialogBtn').style.display = 'block';
    }

    // 'Open' Button will be hidden, if modal Dialog is opened
    function dialogOpen(): void {
      // document.getElementById('dialogBtn').style.display = 'none';
    }
    // Dialog will be closed, while clicking on overlay
    // function onChange(args: ChangeEventArgs): void {
    //   if (args.checked) {
    //     dialogObj.overlayClick = (): void => {
    //       dialogObj.hide();
    //     };
    //   } else {
    //     dialogObj.overlayClick = (): void => {
    //       dialogObj.show();
    //     };
    //   }
    // }
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
      case 'insert':
        // let columnName = { field: 'New Column', width: 100 };
        // this.treegrid.columns.push(columnName); // Insert Columns
        // this.treegrid.refreshColumns(); // Refresh Columns
          this.showDialog();
        break;
      case 'delete':
        // @ts-ignore
        this.treegrid.columns.splice(args['column'].index, 1); //Splice columns
        this.treegrid.refreshColumns(); //Refresh Columns
        break;
      case 'rename':
        this.treegrid.getColumnByField('taskName'); //Get the required column
        this.treegrid.getColumnByField('taskName').edit(); //Rename column name
        this.treegrid.refreshColumns(); //Refresh Columns
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
        this.moveRow = this.treegrid.grid.selectedRow;
        break;
      case 'customCopy':
        this.clone = this.treegrid.cloneRow(this.treegrid.grid.selectedRow);
        break;
      case 'customPaste':
        let pasteRow: any = null;

        // Get the row to be pasted
        // From CUT
        if (this.moveRow){
          pasteRow = this.moveRow;
          this.treegrid.removeRow(pasteRow);
        }
        // From COPY
        else if (this.clone)
          pasteRow = this.clone;

        // Paste the row at position below the selected row
        if (pasteRow){
          let parent: any = this.treegrid.getRowParent(this.treegrid.selectedRow);
          let list = parent && parent.rows ? parent.rows : this.rows;

          if (list){
            let index: number = list.indexOf(this.treegrid.selectedRow);
            if (index >= 0)
              this.treegrid.insertRowAt(pasteRow, index+1, parent);
          }
        }

        this.treegrid.clearSelection();
        this.treegrid.refresh();

        this.moveRow = null;
        this.clone = null;
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
