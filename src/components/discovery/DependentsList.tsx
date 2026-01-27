/**
 * Dependents List Component
 * Dynamic list for adding/removing dependents in Basic Context section
 */

import { useState } from 'react'
import { Button, Select, DateInput } from '@/components/common'
import { DEPENDENT_RELATIONSHIP_OPTIONS } from '@/data/basicContextQuestions'
import type { Dependent } from '@/types'

interface DependentsListProps {
  dependents: Dependent[]
  errors: Record<string, string>
  onChange: (dependents: Dependent[]) => void
  isAdvisorMode?: boolean
}

export function DependentsList({
  dependents,
  errors,
  onChange,
  isAdvisorMode = false,
}: DependentsListProps): JSX.Element {
  const [isAdding, setIsAdding] = useState(false)
  const [newDependent, setNewDependent] = useState<Partial<Dependent>>({
    relationship: '',
    financiallyDependent: true,
  })

  const handleAddDependent = (): void => {
    if (!newDependent.relationship || !newDependent.birthDate) return

    onChange([
      ...dependents,
      {
        relationship: newDependent.relationship,
        birthDate: newDependent.birthDate,
        financiallyDependent: newDependent.financiallyDependent ?? true,
      },
    ])

    setNewDependent({ relationship: '', financiallyDependent: true })
    setIsAdding(false)
  }

  const handleRemoveDependent = (index: number): void => {
    onChange(dependents.filter((_, i) => i !== index))
  }

  const handleUpdateDependent = (index: number, field: keyof Dependent, value: unknown): void => {
    const updated = [...dependents]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  // Format date for input (yyyy-MM-dd format required by HTML date input)
  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return ''
    // Handle both Date objects and ISO strings
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toISOString().split('T')[0]
  }

  // Calculate age from birth date
  const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const youOrClient = isAdvisorMode ? 'the client' : 'you'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Dependents</h3>
          <p className="text-sm text-gray-500">
            Children, parents, or others who depend on {youOrClient} financially.
          </p>
        </div>
        {!isAdding && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            + Add Dependent
          </Button>
        )}
      </div>

      {/* Existing Dependents */}
      {dependents.length > 0 && (
        <div className="space-y-3">
          {dependents.map((dependent, index) => {
            const age = calculateAge(dependent.birthDate)
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">
                    {dependent.relationship}
                  </p>
                  <p className="text-sm text-gray-500">
                    {age} years old
                    {dependent.financiallyDependent && ' • Financially dependent'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={dependent.financiallyDependent}
                      onChange={(e) => handleUpdateDependent(index, 'financiallyDependent', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-600 hidden sm:inline">Financial</span>
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDependent(index)}
                    className="text-error hover:bg-error/10"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add New Dependent Form */}
      {isAdding && (
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-medium text-gray-900 mb-4">Add Dependent</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Relationship"
              options={DEPENDENT_RELATIONSHIP_OPTIONS.map((rel) => ({ value: rel, label: rel }))}
              placeholder="Select relationship..."
              value={newDependent.relationship || ''}
              onChange={(e) => setNewDependent((prev) => ({ ...prev, relationship: e.target.value }))}
              error={errors['newDependent.relationship']}
            />
            <DateInput
              label="Date of Birth"
              value={formatDateForInput(newDependent.birthDate)}
              onChange={(e) => setNewDependent((prev) => ({ ...prev, birthDate: new Date(e.target.value) }))}
              error={errors['newDependent.birthDate']}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newDependent.financiallyDependent ?? true}
                onChange={(e) => setNewDependent((prev) => ({ ...prev, financiallyDependent: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Financially dependent</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAdding(false)
                setNewDependent({ relationship: '', financiallyDependent: true })
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAddDependent}
              disabled={!newDependent.relationship || !newDependent.birthDate}
            >
              Add Dependent
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {dependents.length === 0 && !isAdding && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500 text-sm">No dependents added yet</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="mt-2"
          >
            + Add your first dependent
          </Button>
        </div>
      )}

      {/* Error display */}
      {errors.dependents && (
        <p className="text-sm text-error">{errors.dependents}</p>
      )}
    </div>
  )
}
