import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material';
import { SettingsService, PaintingService, NodeDraggingService } from './services';
import { BoardComponent, SettingsCardComponent, GridComponent, NodeComponent, NavItemComponent } from './components';
import { AppComponent } from './app.component';

const COMPONENTS = [
  AppComponent,
  BoardComponent,
  SettingsCardComponent,
  GridComponent,
  NavItemComponent,
  NodeComponent,
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MaterialModule],
  providers: [SettingsService, PaintingService, NodeDraggingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
