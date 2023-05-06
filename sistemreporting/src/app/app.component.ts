import {Component} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable, ReplaySubject} from 'rxjs';
import { AddReportDialogComponent } from './add-report-dialog/add-report-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  // {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  // {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  // {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  // {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  // {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  // {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  // {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  // {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  // {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  // {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

/**
 * @title Adding and removing data when using an observable-based datasource.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  displayedColumns: string[] = ['ref_id', 'section', 'bug_description', 'symbol', 'jira', 'reprted_date', 'severity', 'due_date', 'dev_type', 'eta', 'actual', 'developer'];
  dataToDisplay = [...ELEMENT_DATA];

  dataSource = new ExampleDataSource(this.dataToDisplay);

  constructor(public dialog: MatDialog) {}
  removeData() {
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddReportDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  importCSV() {
    const input: any = document.createElement('input');
    const reader: any = new FileReader();

    input.type = 'file';
    input.multiple = false;
    input.accept = '.csv';

    reader.addEventListener('load', () => {
          const text: string = reader.result;
          const rows: string[] = text.split('\r\n');
          const data: any[] = [];

          let keys: any = rows.shift()?.split('\t');
              keys = keys.map((key: string) => key.toLowerCase().replace(/\s+/g, '_'));

          rows.forEach((row: string) => {
                const cols: string[] = row.split('\t');
                const temp: any = {};

                cols.forEach((col: string, index: number) => {
                      temp[keys[index]] = col;
                });

                data.push(temp);
          });

          console.log(data);
          this.dataSource.setData(data);
    });

    input.addEventListener('input', function handler() {
          const file = input.files[0];
          reader.readAsText(file);
          input.removeEventListener('input', handler);
    });

    document.body.appendChild(input);
    input.click(); input.remove();
}
}

class ExampleDataSource extends DataSource<PeriodicElement> {
  private _dataStream = new ReplaySubject<PeriodicElement[]>();

  constructor(initialData: PeriodicElement[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<PeriodicElement[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: PeriodicElement[]) {
    this._dataStream.next(data);
  }
}

