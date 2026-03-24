import { useState, useEffect } from 'react';

interface AppSettings {
  maintenanceMode: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  maintenanceMode: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch settings from API on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/maintenance');
        if (response.ok) {
          const data = await response.json();
          setSettings({ maintenanceMode: data.maintenanceMode });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Keep default settings on error
      } finally {
        setIsLoaded(true);
      }
    };

    fetchSettings();
  }, []);

  // Update settings via API
  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const response = await fetch('/api/maintenance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({ maintenanceMode: data.maintenanceMode });
      } else {
        console.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return {
    settings,
    updateSettings,
    isLoaded,
  };
}
