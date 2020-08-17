import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { MaterialModule } from './material';
import { PaintingService } from './services';
import { ROOT_REDUCERS } from './store/reducers';
import { GridEffects } from './store/effects';
import { BoardComponent, BoardToolsComponent, GridComponent, NodeComponent, NavItemComponent } from './components';
import { AppComponent } from './app.component';
import { NodeDraggingService } from './services/node-dragging.service';

const COMPONENTS = [AppComponent, BoardComponent, BoardToolsComponent, GridComponent, NavItemComponent, NodeComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.forRoot(ROOT_REDUCERS),
    EffectsModule.forRoot([GridEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [PaintingService, NodeDraggingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
