import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AddReportDialogComponent } from './add-report-dialog/add-report-dialog.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
})
export class AppComponent {
      displayedColumns: string[] = [
            'ref_id',
            'section',
            'bug_description',
            'reported_date',
            'severity',
            'due_date',
            'dev_type',
            'eta',
            'actual',
            'status',
            'action'
      ];

      dataSource = new MatTableDataSource<any>([]);

      @ViewChild('paginator') paginator!: MatPaginator;
      @ViewChild(MatTable) table!: MatTable<any>;

      constructor(
            public dialog: MatDialog
      ) { }

      ngOnInit() {
            this.dataSource.data = [];
      }

      addReport() {
            const ref = this.dialog.open(AddReportDialogComponent, {
                  disableClose: true
            });

            ref.afterClosed().subscribe(data => {
                  if (!data) return;
                  this.dataSource.data.push(data.form);
                  this.table.renderRows();
                  this.paginator.length = this.dataSource.data.length;
                  this.dataSource.paginator = this.paginator;
            });
      }

      editReport(item: any, index: number) {
            const ref = this.dialog.open(AddReportDialogComponent, {
                  disableClose: true,
                  data: { form: item, index }
            });

            ref.afterClosed().subscribe(data => {
                  if (!data) return;
                  this.dataSource.data.splice(data.index, 1, data.form);
                  this.table.renderRows();
            });
      }

      deleteReport(index: number) {
            this.dataSource.data.splice(index, 1);
            this.table.renderRows();
            this.paginator.length = this.dataSource.data.length;
            this.dataSource.paginator = this.paginator;
      }

      importCSV() {
            const input: any = document.createElement('input');
            const reader: any = new FileReader();
        
            let isTSV = false;
        
            input.type = 'file';
            input.multiple = false;
            input.accept = '.csv, .tsv';
        
            reader.addEventListener('load', () => {
                  const text: string = reader.result;
                  const rows: string[] = text.split('\r\n');
                  const data: any[] = [];
        
                  const separator = isTSV ? '\t' : ',';
        
                  let keys: any = rows.shift()?.split(separator);
                      keys = keys.map((key: string) => key.toLowerCase().replace(/\s+/g, '_'));
        
                  rows.forEach((row: string) => {
                        const cols: string[] = row.split(separator);
                        const temp: any = {};
        
                        cols.forEach((col: string, index: number) => {
                              temp[keys[index]] = col;
                        });
        
                        data.push(temp);
                  });
        
                  this.paginator.length = data.length;
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.data = data;
            });
        
            input.addEventListener('input', function handler() {
                  const file = input.files[0];
                  isTSV = file.name.endsWith('.tsv');
                  reader.readAsText(file);
                  input.removeEventListener('input', handler);
            });
        
            document.body.appendChild(input);
            input.click(); input.remove();
      }

      // helper methods

      formatDate(date: Date) {
            let d: any = date.getDate();
            let m: any = date.getMonth() + 1;
            let y: any = date.getFullYear();

            d = d < 10 ? '0' + d : d;
            m = m < 10 ? '0' + m : m;

            return d + '/' + m + '/' + y;
      }
}
