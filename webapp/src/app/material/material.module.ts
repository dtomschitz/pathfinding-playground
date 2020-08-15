import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, MatDividerModule],
  exports: [MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, MatDividerModule],
})
export class MaterialModule {}
