import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BuildOutline } from '@ant-design/icons-angular/icons';
import { NzIconService } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzAlertModule,
    NzIconModule,
  ],
  template: `
    <div class="roles-container">
      <nz-alert
        nzType="info"
        *ngIf="isAlertVisible()"
        nzCloseable
        (nzOnClose)="afterClose()"
        nzMessage="Informational Notes"
        nzDescription="This pages is still under contruction and can only be accessed by admins and managers."
        nzShowIcon
      ></nz-alert>
      <div class="header pt-6">
        <h1 class="text-2xl font-semibold">Roles</h1>
      </div>

      <div class="construction-message">
        <span nz-icon nzType="build" nzTheme="outline" class="construction-icon"></span>
        <p>Page Under Development</p>
      </div>
    </div>
  `,
  styles: [
    `
      .roles-container {
        padding: 24px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      h1 {
        margin: 0;
      }
      .construction-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 100px;
      }
      .construction-icon {
        font-size: 64px;
        color: #1890ff;
        margin-bottom: 16px;
      }
      .construction-message p {
        font-size: 24px;
        color: #8c8c8c;
        margin: 0;
      }
    `,
  ],
})
export class RolesComponent {
  readonly isAlertVisible = signal<boolean>(true);

  constructor(private iconService: NzIconService) {
    const alertHidden = localStorage.getItem('roles-alert') === 'true';
    this.isAlertVisible.set(!alertHidden);
    this.iconService.addIcon(BuildOutline);
  }

  afterClose(): void {
    this.isAlertVisible.set(false);
    localStorage.setItem('roles-alert', 'true');
  }
}
