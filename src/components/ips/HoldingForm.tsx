/**
 * Holding Form Component
 * Modal form for adding/editing holdings within an account
 */

import { useState, useEffect } from 'react';
import { Button, Modal } from '@/components/common';
import { useDashboardStore } from '@/stores';
import type { AssetClass, IPSHolding } from '@/types/dashboard';
import { ASSET_CLASS_OPTIONS } from '@/data/assetClasses';

interface HoldingFormProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Account ID to add holding to */
  accountId: string;
  /** Holding to edit (if editing) */
  editHolding?: IPSHolding;
}

interface FormData {
  name: string;
  symbol: string;
  assetClass: AssetClass;
  currentValue: string;
}

const initialFormData: FormData = {
  name: '',
  symbol: '',
  assetClass: 'us_large_cap',
  currentValue: '',
};

export function HoldingForm({
  isOpen,
  onClose,
  accountId,
  editHolding,
}: HoldingFormProps): JSX.Element {
  const { addHolding, updateHolding } = useDashboardStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Populate form when editing
  useEffect(() => {
    if (editHolding) {
      setFormData({
        name: editHolding.name,
        symbol: editHolding.symbol || '',
        assetClass: editHolding.assetClass,
        currentValue: editHolding.currentValue.toString(),
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [editHolding, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Holding name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Holding name must be 100 characters or less';
    }

    if (formData.symbol && formData.symbol.length > 10) {
      newErrors.symbol = 'Symbol must be 10 characters or less';
    }

    if (!formData.currentValue) {
      newErrors.currentValue = 'Value is required';
    } else {
      const value = parseFloat(formData.currentValue);
      if (isNaN(value) || value < 0) {
        newErrors.currentValue = 'Value must be a positive number';
      } else if (value > 100000000000) {
        newErrors.currentValue = 'Value exceeds maximum allowed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const holdingData = {
      name: formData.name.trim(),
      symbol: formData.symbol.trim().toUpperCase() || undefined,
      assetClass: formData.assetClass,
      currentValue: parseFloat(formData.currentValue),
    };

    if (editHolding) {
      updateHolding(accountId, editHolding.id, holdingData);
    } else {
      addHolding(accountId, holdingData);
    }

    onClose();
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editHolding ? 'Edit Holding' : 'Add Holding'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Holding Name */}
        <div>
          <label htmlFor="holding-name" className="block text-sm font-medium text-gray-700 mb-1">
            Holding Name <span className="text-red-500">*</span>
          </label>
          <input
            id="holding-name"
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            placeholder="e.g., Vanguard Total Stock Market Index"
            maxLength={100}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Symbol */}
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
            Ticker Symbol (optional)
          </label>
          <input
            id="symbol"
            type="text"
            value={formData.symbol}
            onChange={handleChange('symbol')}
            placeholder="e.g., VTI"
            maxLength={10}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.symbol ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.symbol && <p className="mt-1 text-sm text-red-500">{errors.symbol}</p>}
        </div>

        {/* Asset Class */}
        <div>
          <label htmlFor="asset-class" className="block text-sm font-medium text-gray-700 mb-1">
            Asset Class
          </label>
          <select
            id="asset-class"
            value={formData.assetClass}
            onChange={handleChange('assetClass')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {ASSET_CLASS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Current Value */}
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            Current Value <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              id="value"
              type="number"
              step="0.01"
              min="0"
              value={formData.currentValue}
              onChange={handleChange('currentValue')}
              placeholder="0.00"
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.currentValue ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.currentValue && (
            <p className="mt-1 text-sm text-red-500">{errors.currentValue}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editHolding ? 'Save Changes' : 'Add Holding'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
