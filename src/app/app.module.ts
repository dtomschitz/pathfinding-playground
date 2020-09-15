import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material';
import { GridMouseService, NodeDraggingService, SettingsService } from './services';
import { SettingsCardComponent, GridComponent, GridControlsComponent, NavItemComponent } from './components';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, SettingsCardComponent, GridComponent, GridControlsComponent, NavItemComponent],
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MaterialModule],
  providers: [SettingsService, GridMouseService, NodeDraggingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
