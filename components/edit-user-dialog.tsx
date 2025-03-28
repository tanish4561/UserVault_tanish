"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import type { User } from "@/services/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EditUserDialogProps {
  user: User
  onClose: () => void
  onUpdate: (updatedUser: User) => Promise<void>
}

export default function EditUserDialog({ user, onClose, onUpdate }: EditUserDialogProps) {
  // Form state
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  })

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Clear API error when user makes any change
    if (apiError) {
      setApiError(null)
    }
  }

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required"
      isValid = false
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = "First name must be at least 2 characters"
      isValid = false
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required"
      isValid = false
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters"
      isValid = false
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setApiError(null)

    try {
      // Create updated user object
      const updatedUser: User = {
        ...user,
        ...formData,
      }

      // Call the update function (passed from parent)
      await onUpdate(updatedUser)

      // Dialog will be closed by parent component on success
    } catch (error) {
      // Handle API error
      setApiError(error instanceof Error ? error.message : "Failed to update user. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        {apiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={errors.first_name ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={errors.last_name ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

