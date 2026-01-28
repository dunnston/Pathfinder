/**
 * Account Form Component
 * Modal form for adding/editing IPS accounts
 */

import { useState, useEffect } from 'react';
import { Button, Modal } from '@/components/common';
import { useDashboardStore } from '@/stores';
import type { AccountType } from '@/types/financialSnapshot';
import type { IPSAccount } from '@/types/dashboard';

interface AccountFormProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Account to edit (if editing) */
  editAccount?: IPSAccount;
}

interface FormData {
  name: string;
  accountType: AccountType;
  custodian: string;
  currentBalance: string;
  asOfDate: string;
}

const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string }[] = [
  { value: 'tsp_traditional', label: 'TSP (Traditional)' },
  { value: 'tsp_roth', label: 'TSP (Roth)' },
  { value: 'traditional_ira', label: 'Traditional IRA' },
  { value: 'roth_ira', label: 'Roth IRA' },
  { value: '401k', label: '401(k)' },
  { value: 'taxable_brokerage', label: 'Taxable Brokerage' },
  { value: 'savings', label: 'Savings' },
  { value: 'other', label: 'Other' },
];

const initialFormData: FormData = {
  name: '',
  accountType: 'taxable_brokerage',
  custodian: '',
  currentBalance: '',
  asOfDate: new Date().toISOString().split('T')[0],
};

export function AccountForm({ isOpen, onClose, editAccount }: AccountFormProps): JSX.Element {
  const { addIPSAccount, updateIPSAccount } = useDashboardStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Populate form when editing
  useEffect(() => {
    if (editAccount) {
      setFormData({
        name: editAccount.name,
        accountType: editAccount.accountType,
        custodian: editAccount.custodian || '',
        currentBalance: editAccount.currentBalance.toString(),
        asOfDate: editAccount.asOfDate.split('T')[0],
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [editAccount, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Account name must be 100 characters or less';
    }

    if (!formData.currentBalance) {
      newErrors.currentBalance = 'Balance is required';
    } else {
      const balance = parseFloat(formData.currentBalance);
      if (isNaN(balance) || balance < 0) {
        newErrors.currentBalance = 'Balance must be a positive number';
      } else if (balance > 100000000000) {
        newErrors.currentBalance = 'Balance exceeds maximum allowed value';
      }
    }

    if (!formData.asOfDate) {
      newErrors.asOfDate = 'As-of date is required';
    }

    if (formData.custodian && formData.custodian.length > 100) {
      newErrors.custodian = 'Custodian must be 100 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const accountData = {
      name: formData.name.trim(),
      accountType: formData.accountType,
      custodian: formData.custodian.trim() || undefined,
      currentBalance: parseFloat(formData.currentBalance),
      asOfDate: new Date(formData.asOfDate).toISOString(),
      holdings: editAccount?.holdings || [],
    };

    if (editAccount) {
      updateIPSAccount(editAccount.id, accountData);
    } else {
      addIPSAccount(accountData);
    }

    onClose();
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editAccount ? 'Edit Account' : 'Add Account'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Name */}
        <div>
          <label htmlFor="account-name" className="block text-sm font-medium text-gray-700 mb-1">
            Account Name <span className="text-red-500">*</span>
          </label>
          <input
            id="account-name"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            placeholder="e.g., Fidelity 401k"
            maxLength={100}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Account Type */}
        <div>
          <label htmlFor="account-type" className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select
            id="account-type"
            value={formData.accountType}
            onChange={handleChange('accountType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {ACCOUNT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Custodian */}
        <div>
          <label htmlFor="custodian" className="block text-sm font-medium text-gray-700 mb-1">
            Custodian / Institution
          </label>
          <input
            id="custodian"
            type="text"
            value={formData.custodian}
            onChange={handleChange('custodian')}
            placeholder="e.g., Fidelity, Vanguard, Schwab"
            maxLength={100}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.custodian ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.custodian && <p className="mt-1 text-sm text-red-500">{errors.custodian}</p>}
        </div>

        {/* Current Balance */}
        <div>
          <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
            Current Balance <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              id="balance"
              type="number"
              step="0.01"
              min="0"
              value={formData.currentBalance}
              onChange={handleChange('currentBalance')}
              placeholder="0.00"
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.currentBalance ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.currentBalance && (
            <p className="mt-1 text-sm text-red-500">{errors.currentBalance}</p>
          )}
        </div>

        {/* As-of Date */}
        <div>
          <label htmlFor="as-of-date" className="block text-sm font-medium text-gray-700 mb-1">
            Balance As-Of Date <span className="text-red-500">*</span>
          </label>
          <input
            id="as-of-date"
            type="date"
            value={formData.asOfDate}
            onChange={handleChange('asOfDate')}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.asOfDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.asOfDate && <p className="mt-1 text-sm text-red-500">{errors.asOfDate}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editAccount ? 'Save Changes' : 'Add Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
