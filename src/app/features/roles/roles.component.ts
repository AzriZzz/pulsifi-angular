import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzAlertModule,
  ],
  template: `
    <div class="roles-container">
      <nz-alert
        nzType="info"
        nzMessage="Informational Notes"
        nzDescription="This pages is still under contruction and can only be accessed by admins."
        nzShowIcon
      ></nz-alert>
      <div class="header pt-6">
        <!-- <h1 class="text-2xl font-semibold">Roles</h1> -->
        <!-- <button nz-button nzType="primary">Add Role</button> -->
      </div>
      <!-- <nz-table #basicTable [nzData]="[]">
        <thead>
          <tr>
            <th>Name</th>
            <th>Permissions</th>
            <th>Users</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="4" class="text-center">No roles found</td>
          </tr>
        </tbody>
      </nz-table> -->
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
    `,
  ],
})
export class RolesComponent {}
