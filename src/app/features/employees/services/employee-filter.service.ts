import { Injectable } from '@angular/core';
import { NzTableSortOrder } from 'ng-zorro-antd/table';

export interface EmployeeFilterState {
  nameFilter: string;
  departmentFilter: string;
  roleFilter: string;
  statusFilter: string;
  pageSize: number;
  dateSortOrder: NzTableSortOrder;
}

const DEFAULT_FILTER_STATE: EmployeeFilterState = {
  nameFilter: '',
  departmentFilter: '',
  roleFilter: '',
  statusFilter: '',
  pageSize: 10,
  dateSortOrder: null
};

@Injectable({
  providedIn: 'root'
})
export class EmployeeFilterService {
  private readonly STORAGE_KEY = 'employee_filter_state';

  saveFilterState(state: EmployeeFilterState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  loadFilterState(): EmployeeFilterState {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (!savedState) {
      return DEFAULT_FILTER_STATE;
    }

    try {
      return JSON.parse(savedState);
    } catch {
      return DEFAULT_FILTER_STATE;
    }
  }

  clearFilterState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
} 