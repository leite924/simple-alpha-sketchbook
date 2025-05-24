
/**
 * Admin preferences service for storing and retrieving admin preferences
 */

type AdminPreferences = {
  defaultTab: string;
  financePreferences: {
    defaultView: string;
    dashboardPeriod: string;
  };
};

const DEFAULT_PREFERENCES: AdminPreferences = {
  defaultTab: 'dashboard',
  financePreferences: {
    defaultView: 'dashboard',
    dashboardPeriod: 'month'
  }
};

const PREFERENCES_KEY = 'admin_preferences';

export const adminPreferencesService = {
  /**
   * Get all admin preferences
   */
  getPreferences: (): AdminPreferences => {
    try {
      const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
      if (!savedPrefs) return DEFAULT_PREFERENCES;
      return JSON.parse(savedPrefs) as AdminPreferences;
    } catch (error) {
      console.error('Error getting admin preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  },

  /**
   * Save all admin preferences
   */
  savePreferences: (preferences: AdminPreferences): void => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving admin preferences:', error);
    }
  },

  /**
   * Update default tab preference
   */
  saveDefaultTab: (tab: string): void => {
    const currentPrefs = adminPreferencesService.getPreferences();
    adminPreferencesService.savePreferences({
      ...currentPrefs,
      defaultTab: tab
    });
  },

  /**
   * Update finance preferences
   */
  saveFinancePreferences: (financePrefs: AdminPreferences['financePreferences']): void => {
    const currentPrefs = adminPreferencesService.getPreferences();
    adminPreferencesService.savePreferences({
      ...currentPrefs,
      financePreferences: financePrefs
    });
  }
};
