/**
 * Custom Value Modal Component
 * Allows users to create their own value cards
 */

import { useState, useRef, useEffect } from 'react';
import type { ValueCategory, ValueCard } from '@/types/valuesDiscovery';
import { CATEGORY_DISPLAY_NAMES } from '@/data/valueCards';
import { Button } from '@/components/common';

interface CustomValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateValue: (value: ValueCard) => void;
  isAdvisorMode?: boolean;
}

const CATEGORIES: ValueCategory[] = [
  'SECURITY',
  'FREEDOM',
  'FAMILY',
  'GROWTH',
  'CONTRIBUTION',
  'PURPOSE',
  'CONTROL',
  'HEALTH',
  'QUALITY_OF_LIFE',
];

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 150;

export function CustomValueModal({
  isOpen,
  onClose,
  onCreateValue,
  isAdvisorMode = false,
}: CustomValueModalProps): JSX.Element | null {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ValueCategory>('QUALITY_OF_LIFE');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const titleInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus title input when modal opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a title for your value';
    } else if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must be ${MAX_TITLE_LENGTH} characters or less`;
    }

    if (!description.trim()) {
      newErrors.description = 'Please add a brief description';
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Generate a unique ID for the custom value
    const customId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const customValue: ValueCard = {
      id: customId,
      title: title.trim(),
      description: description.trim(),
      category,
      // Create a generic scenario prompt based on the title
      scenarioPrompt: `When making financial decisions, would "${title.trim()}" be something you prioritize?`,
      isCustom: true,
    };

    onCreateValue(customValue);

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('QUALITY_OF_LIFE');
    setErrors({});
    onClose();
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setCategory('QUALITY_OF_LIFE');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-value-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 id="custom-value-title" className="text-lg font-semibold text-gray-900">
              Add Custom Value
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {isAdvisorMode
              ? "Create a value that's specific to this client's situation."
              : "Create a value that's specific to your situation."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="value-title" className="block text-sm font-medium text-gray-700 mb-1">
              Value Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="value-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH));
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g., Supporting my local community"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={MAX_TITLE_LENGTH}
            />
            <div className="flex justify-between mt-1">
              {errors.title ? (
                <span className="text-xs text-red-500">{errors.title}</span>
              ) : (
                <span className="text-xs text-gray-400" />
              )}
              <span className="text-xs text-gray-400">
                {title.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="value-description" className="block text-sm font-medium text-gray-700 mb-1">
              Brief Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="value-description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH));
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="Describe why this value matters for your financial planning..."
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <span className="text-xs text-red-500">{errors.description}</span>
              ) : (
                <span className="text-xs text-gray-400" />
              )}
              <span className="text-xs text-gray-400">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="value-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <p className="text-xs text-gray-500 mb-2">
              This helps us understand how this value relates to others.
            </p>
            <select
              id="value-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ValueCategory)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_DISPLAY_NAMES[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          {title && description && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-2">Preview</p>
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h4 className="font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
                <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {CATEGORY_DISPLAY_NAMES[category]}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Value
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
