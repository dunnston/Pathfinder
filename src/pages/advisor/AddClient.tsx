import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClientStore } from '@/stores'
import { AdvisorLayout, AdvisorPage } from '@/components/layout'
import { Button, Input, TextArea } from '@/components/common'

export function AddClient(): JSX.Element {
  const navigate = useNavigate()
  const { addClient } = useClientStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required'
    }

    // RFC 5322 compliant email validation (simplified but comprehensive)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    if (!validate()) return

    const newClient = addClient({
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      advisorNotes: formData.notes.trim() || undefined,
    })

    navigate(`/advisor/clients/${newClient.id}`)
  }

  return (
    <AdvisorLayout title="Add New Client">
      <AdvisorPage>
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Client Information
              </h3>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter client's full name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="client@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                  helperText="Optional - for contact purposes only"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  helperText="Optional"
                />
              </div>
            </div>

            {/* Advisor Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Advisor Notes
              </h3>
              <TextArea
                placeholder="Add any initial notes about this client..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                helperText="Private notes only visible to you"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/advisor/clients')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Client
              </Button>
            </div>
          </form>
        </div>
      </AdvisorPage>
    </AdvisorLayout>
  )
}
