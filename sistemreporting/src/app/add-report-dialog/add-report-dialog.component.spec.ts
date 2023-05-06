import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportDialogComponent } from './add-report-dialog.component';

describe('AddReportDialogComponent', () => {
  let component: AddReportDialogComponent;
  let fixture: ComponentFixture<AddReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReportDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
