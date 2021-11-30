import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TreeGridAllModule, TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { ToolbarModule, ToolbarAllModule } from '@syncfusion/ej2-angular-navigations';

import { ButtonAllModule , CheckBoxAllModule} from '@syncfusion/ej2-angular-buttons';

import { DatePickerModule, DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PageService, SortService, FilterService, EditService, FreezeService,
  ExcelExportService, PdfExportService, ContextMenuService, ToolbarService } from '@syncfusion/ej2-angular-treegrid';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TreeGridAllModule,
    NumericTextBoxAllModule,
    ToolbarModule,
    DropDownListAllModule,
    ButtonAllModule,
    DialogModule,
    MultiSelectAllModule,
    CheckBoxAllModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    HttpClientModule
  ],
  providers: [PageService, SortService, FilterService, EditService,
    ExcelExportService, PdfExportService, ContextMenuService, TreeGridComponent,
    ToolbarService, FreezeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
