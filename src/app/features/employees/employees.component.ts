import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule
  ],
  template: `
    <div class="employees-container">
      <div class="header">
        <h1>Employees</h1>
        <button nz-button nzType="primary">Add Employee</button>
      </div>
      <nz-table #basicTable [nzData]="[]">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="5" class="text-center">
              No employees found
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
  `,
  styles: [`
    .employees-container {
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
export class EmployeesComponent {} 