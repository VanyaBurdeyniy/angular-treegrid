import {Component, OnInit} from '@angular/core';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public data: Object[] = [];
  public dataManager: DataManager | undefined;

  ngOnInit(): void {
    this.dataManager = new DataManager({
      url:
        'https://ej2services.syncfusion.com/production/web-services/api/SelfReferenceData',
      adaptor: new WebApiAdaptor(),
      crossDomain: true
    });
  }
}
