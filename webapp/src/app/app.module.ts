import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { MaterialModule } from './material';
import { SettingsService, PaintingService, NodeDraggingService } from './services';
import { ROOT_REDUCERS } from './store/reducers';
import { GridEffects } from './store/effects';
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
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    StoreModule.forRoot(ROOT_REDUCERS),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [SettingsService, PaintingService, NodeDraggingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
