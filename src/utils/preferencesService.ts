
/**
 * User preferences service for storing and retrieving user preferences
 */

type StudentPreferences = {
  defaultTab: string;
  quizPreferences: {
    difficulty: string;
    category: string;
    questionCount: number;
  };
};

const DEFAULT_PREFERENCES: StudentPreferences = {
  defaultTab: 'courses',
  quizPreferences: {
    difficulty: 'all',
    category: 'all',
    questionCount: 5
  }
};

const PREFERENCES_KEY = 'student_preferences';

export const preferencesService = {
  /**
   * Get all user preferences
   */
  getPreferences: (): StudentPreferences => {
    try {
      const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
      if (!savedPrefs) return DEFAULT_PREFERENCES;
      return JSON.parse(savedPrefs) as StudentPreferences;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  },

  /**
   * Save all user preferences
   */
  savePreferences: (preferences: StudentPreferences): void => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  },

  /**
   * Update default tab preference
   */
  saveDefaultTab: (tab: string): void => {
    const currentPrefs = preferencesService.getPreferences();
    preferencesService.savePreferences({
      ...currentPrefs,
      defaultTab: tab
    });
  },

  /**
   * Update quiz preferences
   */
  saveQuizPreferences: (quizPrefs: StudentPreferences['quizPreferences']): void => {
    const currentPrefs = preferencesService.getPreferences();
    preferencesService.savePreferences({
      ...currentPrefs,
      quizPreferences: quizPrefs
    });
  }
};
