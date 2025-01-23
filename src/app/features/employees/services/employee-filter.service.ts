import { Injectable } from '@angular/core';
import { NzTableSortOrder } from 'ng-zorro-antd/table';

export interface EmployeeFilterState {
  nameFilter: string;
  departmentFilter: string;
  roleFilter: string;
  statusFilter: string;
  dateRange: [Date | null, Date | null];
  pageSize: number;
  dateSortOrder: NzTableSortOrder;
}

const DEFAULT_FILTER_STATE: EmployeeFilterState = {
  nameFilter: '',
  departmentFilter: '',
  roleFilter: '',
  statusFilter: '',
  dateRange: [null, null],
  pageSize: 10,
  dateSortOrder: null
};

@Injectable({
  providedIn: 'root'
})
export class EmployeeFilterService {
  private readonly STORAGE_KEY = 'employee_filter_state';

  saveFilterState(state: EmployeeFilterState): void {
    const stateToSave = {
      ...state,
      dateRange: state.dateRange ? [
        state.dateRange[0]?.toISOString(),
        state.dateRange[1]?.toISOString()
      ] : [null, null]
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
  }

  loadFilterState(): EmployeeFilterState {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (!savedState) {
      return DEFAULT_FILTER_STATE;
    }

    try {
      const parsedState = JSON.parse(savedState);
      return {
        ...parsedState,
        dateRange: parsedState.dateRange ? [
          parsedState.dateRange[0] ? new Date(parsedState.dateRange[0]) : null,
          parsedState.dateRange[1] ? new Date(parsedState.dateRange[1]) : null
        ] : [null, null]
      };
    } catch {
      return DEFAULT_FILTER_STATE;
    }
  }

  clearFilterState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
} 