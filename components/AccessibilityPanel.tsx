import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { databases, dbId } from '../lib/appwrite';
import { ID } from 'appwrite';

interface AccessibilitySettings {
  high_contrast: boolean;
  large_font: boolean;
  screen_reader_optimized: boolean;
  reduced_motion: boolean;
  keyboard_navigation_only: boolean;
  color_blind_mode: string;
  font_size: string;
}

interface AccessibilityPanelProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const defaultSettings: AccessibilitySettings = {
  high_contrast: false,
  large_font: false,
  screen_reader_optimized: false,
  reduced_motion: false,
  keyboard_navigation_only: false,
  color_blind_mode: 'none',
  font_size: 'medium',
};

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ userId, isOpen, onClose }) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  useEffect(() => {
    applySettings();
  }, [settings]);

  const loadSettings = async () => {
    if (!userId) {
      const saved = localStorage.getItem('accessibility_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
      return;
    }

    try {
      const response = await databases.listDocuments(
        dbId,
        'accessibility_settings',
        [`equal("user_id", "${userId}")`]
      );
      if (response.documents.length > 0) {
        const doc = response.documents[0];
        setSettings({
          high_contrast: doc.high_contrast || false,
          large_font: doc.large_font || false,
          screen_reader_optimized: doc.screen_reader_optimized || false,
          reduced_motion: doc.reduced_motion || false,
          keyboard_navigation_only: doc.keyboard_navigation_only || false,
          color_blind_mode: doc.color_blind_mode || 'none',
          font_size: doc.font_size || 'medium',
        });
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!userId) {
      localStorage.setItem('accessibility_settings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }

    try {
      const response = await databases.listDocuments(
        dbId,
        'accessibility_settings',
        [`equal("user_id", "${userId}")`]
      );

      const data = {
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      };

      if (response.documents.length > 0) {
        await databases.updateDocument(dbId, 'accessibility_settings', response.documents[0].$id, data);
      } else {
        await databases.createDocument(dbId, 'accessibility_settings', ID.unique(), data);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  };

  const applySettings = () => {
    const root = document.documentElement;
    
    // High contrast
    if (settings.high_contrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large font
    if (settings.large_font || settings.font_size === 'large') {
      root.classList.add('large-font');
    } else {
      root.classList.remove('large-font');
    }

    // Reduced motion
    if (settings.reduced_motion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Color blind mode
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (settings.color_blind_mode !== 'none') {
      root.classList.add(settings.color_blind_mode);
    }

    // Screen reader optimizations
    if (settings.screen_reader_optimized) {
      root.setAttribute('role', 'application');
      root.setAttribute('aria-label', 'Ọnyịịgbọ application');
    }

    // Font size
    const fontSizes: Record<string, string> = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'x-large': '20px',
    };
    root.style.fontSize = fontSizes[settings.font_size] || '16px';
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 id="accessibility-title" className="text-xl font-bold text-primary-text font-unica-one">
              {t('accessibility.menu')}
            </h2>
            <button
              onClick={onClose}
              className="text-secondary-text hover:text-primary-text focus:outline-none focus:ring-2 focus:ring-olive-green rounded"
              aria-label={t('common.close')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <label htmlFor="high-contrast" className="text-secondary-text">
                {t('accessibility.highContrast')}
              </label>
              <button
                id="high-contrast"
                role="switch"
                aria-checked={settings.high_contrast}
                onClick={() => updateSetting('high_contrast', !settings.high_contrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-olive-green focus:ring-offset-2 ${
                  settings.high_contrast ? 'bg-olive-green' : 'bg-soft-gray'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.high_contrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Large Font */}
            <div className="flex items-center justify-between">
              <label htmlFor="large-font" className="text-secondary-text">
                {t('accessibility.fontSize')}
              </label>
              <select
                id="font-size"
                value={settings.font_size}
                onChange={(e) => updateSetting('font_size', e.target.value)}
                className="px-3 py-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="x-large">Extra Large</option>
              </select>
            </div>

            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <label htmlFor="screen-reader" className="text-secondary-text">
                {t('accessibility.screenReader')}
              </label>
              <button
                id="screen-reader"
                role="switch"
                aria-checked={settings.screen_reader_optimized}
                onClick={() => updateSetting('screen_reader_optimized', !settings.screen_reader_optimized)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-olive-green focus:ring-offset-2 ${
                  settings.screen_reader_optimized ? 'bg-olive-green' : 'bg-soft-gray'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.screen_reader_optimized ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <label htmlFor="reduced-motion" className="text-secondary-text">
                Reduced Motion
              </label>
              <button
                id="reduced-motion"
                role="switch"
                aria-checked={settings.reduced_motion}
                onClick={() => updateSetting('reduced_motion', !settings.reduced_motion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-olive-green focus:ring-offset-2 ${
                  settings.reduced_motion ? 'bg-olive-green' : 'bg-soft-gray'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.reduced_motion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Color Blind Mode */}
            <div className="flex items-center justify-between">
              <label htmlFor="color-blind" className="text-secondary-text">
                Color Blind Mode
              </label>
              <select
                id="color-blind"
                value={settings.color_blind_mode}
                onChange={(e) => updateSetting('color_blind_mode', e.target.value)}
                className="px-3 py-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-olive-green"
              >
                <option value="none">None</option>
                <option value="protanopia">Protanopia (Red-blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                <option value="tritanopia">Tritanopia (Blue-blind)</option>
              </select>
            </div>

            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <label htmlFor="keyboard-nav" className="text-secondary-text">
                {t('accessibility.keyboardNav')}
              </label>
              <button
                id="keyboard-nav"
                role="switch"
                aria-checked={settings.keyboard_navigation_only}
                onClick={() => updateSetting('keyboard_navigation_only', !settings.keyboard_navigation_only)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-olive-green focus:ring-offset-2 ${
                  settings.keyboard_navigation_only ? 'bg-olive-green' : 'bg-soft-gray'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.keyboard_navigation_only ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-soft-gray">
            <button
              onClick={saveSettings}
              className="w-full py-2 px-4 bg-olive-green text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-olive-green focus:ring-offset-2 transition-colors"
            >
              {saved ? t('common.success') : t('common.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;
