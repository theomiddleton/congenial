'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '~/lib/auth-client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof SignUpFormData | 'root', string>>

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 128

export function SignUpForm() {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)
  const [errors, setErrors] = React.useState<FormErrors>({})

  const validateForm = (data: SignUpFormData): FormErrors => {
    const newErrors: FormErrors = {}

    if (!data.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!data.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!data.password) {
      newErrors.password = 'Password is required'
    } else if (data.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    } else if (data.password.length > MAX_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at most ${MAX_PASSWORD_LENGTH} characters`
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data: SignUpFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    const validationErrors = validateForm(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsPending(true)

    const { error } = await authClient.signUp.email(
      {
        name: data.name.trim(),
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push('/dashboard')
          router.refresh()
        },
        onError: (ctx) => {
          setErrors({ root: ctx.error.message })
        },
      }
    )

    if (error) {
      setErrors({ root: error.message })
    }

    setIsPending(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errors.root && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {errors.root}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              autoCapitalize="words"
              disabled={isPending}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isPending}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isPending}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Must be at least {MIN_PASSWORD_LENGTH} characters
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isPending}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? 'confirm-password-error' : undefined
              }
            />
            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                className="text-sm text-destructive"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Creating account...' : 'Create account'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
