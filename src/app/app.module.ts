import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ROOT_REDUCERS } from './store/reducers';
import { MaterialModule } from './material';
import { SettingsService, PaintingService, NodeDraggingService } from './services';
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
    StoreModule.forRoot(ROOT_REDUCERS, {
      runtimeChecks: {
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    MaterialModule,
  ],
  providers: [SettingsService, PaintingService, NodeDraggingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
