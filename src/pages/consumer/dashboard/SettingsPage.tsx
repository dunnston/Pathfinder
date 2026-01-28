/**
 * Settings Page
 * Dashboard configuration settings
 */

import { DashboardLayout, DashboardPage } from '@/components/layout';
import { LoadingSpinner, Button } from '@/components/common';
import { useDashboardStore } from '@/stores';
import type { AlertFrequency } from '@/types/dashboard';
import { ALERT_FREQUENCY_LABELS } from '@/types/dashboard';

const FREQUENCY_OPTIONS: AlertFrequency[] = ['monthly', 'quarterly', 'semi_annually', 'annually'];

interface FrequencySelectorProps {
  label: string;
  description: string;
  value: AlertFrequency;
  onChange: (value: AlertFrequency) => void;
}

function FrequencySelector({
  label,
  description,
  value,
  onChange,
}: FrequencySelectorProps): JSX.Element {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AlertFrequency)}
        className="ml-4 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
      >
        {FREQUENCY_OPTIONS.map((freq) => (
          <option key={freq} value={freq}>
            {ALERT_FREQUENCY_LABELS[freq]}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: ToggleSettingProps): JSX.Element {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          checked ? 'bg-primary' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

interface NumberSettingProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}

function NumberSetting({
  label,
  description,
  value,
  onChange,
  min = 1,
  max = 30,
  suffix = 'days',
}: NumberSettingProps): JSX.Element {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= min && val <= max) {
              onChange(val);
            }
          }}
          min={min}
          max={max}
          className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-center"
        />
        <span className="text-sm text-gray-500">{suffix}</span>
      </div>
    </div>
  );
}

export function SettingsPage(): JSX.Element {
  const { settings, updateSettings, clearDashboard, _hasHydrated } = useDashboardStore();

  // Loading state
  if (!_hasHydrated) {
    return (
      <DashboardLayout title="Dashboard Settings">
        <DashboardPage>
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading settings...</p>
            </div>
          </div>
        </DashboardPage>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard Settings"
      subtitle="Configure notifications and display preferences"
    >
      <DashboardPage>
        <div className="max-w-2xl space-y-8">
          {/* Notification Settings */}
          <section className="rounded-lg border bg-white shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
              <p className="text-sm text-gray-500 mt-1">
                Configure how often you receive reminders and alerts
              </p>
            </div>
            <div className="px-6 divide-y divide-gray-100">
              <FrequencySelector
                label="Rebalance Reminder"
                description="How often to remind you to check portfolio rebalancing"
                value={settings.rebalanceFrequency}
                onChange={(value) => updateSettings({ rebalanceFrequency: value })}
              />
              <FrequencySelector
                label="Beneficiary Review"
                description="How often to remind you to review account beneficiaries"
                value={settings.beneficiaryReviewFrequency}
                onChange={(value) => updateSettings({ beneficiaryReviewFrequency: value })}
              />
              <NumberSetting
                label="Action Reminder Lead Time"
                description="Days before a task deadline to send a reminder"
                value={settings.actionReminderDays}
                onChange={(value) => updateSettings({ actionReminderDays: value })}
                min={1}
                max={30}
                suffix="days"
              />
            </div>
          </section>

          {/* Display Settings */}
          <section className="rounded-lg border bg-white shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Display Settings</h2>
              <p className="text-sm text-gray-500 mt-1">
                Control what appears in your dashboard
              </p>
            </div>
            <div className="px-6 divide-y divide-gray-100">
              <ToggleSetting
                label="Show Completed Tasks"
                description="Display tasks you've already completed in the recommendations list"
                checked={settings.showCompletedTasks}
                onChange={(checked) => updateSettings({ showCompletedTasks: checked })}
              />
              <ToggleSetting
                label="Show Dismissed Tasks"
                description="Display tasks you've dismissed in the recommendations list"
                checked={settings.showDismissedTasks}
                onChange={(checked) => updateSettings({ showDismissedTasks: checked })}
              />
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-lg border border-red-200 bg-red-50 shadow-sm">
            <div className="p-6 border-b border-red-200">
              <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
              <p className="text-sm text-red-700 mt-1">
                These actions are destructive and cannot be undone
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Clear Dashboard Data</h3>
                  <p className="text-sm text-gray-500">
                    Remove all tracked tasks, alerts, and IPS data. Your profile data will be preserved.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all dashboard data? This cannot be undone.')) {
                      clearDashboard();
                    }
                  }}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Clear Data
                </Button>
              </div>
            </div>
          </section>
        </div>
      </DashboardPage>
    </DashboardLayout>
  );
}

export default SettingsPage;
