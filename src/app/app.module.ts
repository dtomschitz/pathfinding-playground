import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material';
import { PaintingService, NodeDraggingService } from './services';
import {
  BoardComponent,
  SettingsCardComponent,
  GridComponent,
  GridControlsComponent,
  NodeComponent,
  NavItemComponent,
} from './components';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SettingsCardComponent,
    GridComponent,
    GridControlsComponent,
    NavItemComponent,
    NodeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [PaintingService, NodeDraggingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
