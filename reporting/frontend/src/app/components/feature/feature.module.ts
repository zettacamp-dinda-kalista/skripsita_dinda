import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureRoutingModule } from './feature-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeatureComponent } from './feature.component';
import { FeatureDialogComponent } from './feature-dialog/feature-dialog.component';

@NgModule({
    declarations: [
        FeatureComponent,
        FeatureDialogComponent
    ],
    imports: [
        CommonModule,
        FeatureRoutingModule,
        SharedModule
    ]
})
export class FeatureModule { }
