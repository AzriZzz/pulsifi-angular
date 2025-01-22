import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule
  ],
  template: `
    <div class="roles-container">
      <div class="header">
        <h1>Roles</h1>
        <button nz-button nzType="primary">Add Role</button>
      </div>
      <nz-table #basicTable [nzData]="[]">
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
            <td colspan="4" class="text-center">
              No roles found
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
  `,
  styles: [`
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
  `]
})
export class RolesComponent {} 