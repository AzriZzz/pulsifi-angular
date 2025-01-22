import { Injectable, signal } from '@angular/core';

interface UserPreferences {
  sidebarCollapsed: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  sidebarCollapsed: false
};

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private readonly preferences = signal<UserPreferences>(this.loadPreferences());

  constructor() {}

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem('user_preferences');
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  private savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem('user_preferences', JSON.stringify(prefs));
      this.preferences.set(prefs);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  getSidebarState(): boolean {
    return this.preferences().sidebarCollapsed;
  }

  setSidebarState(collapsed: boolean): void {
    this.savePreferences({ ...this.preferences(), sidebarCollapsed: collapsed });
  }
} 