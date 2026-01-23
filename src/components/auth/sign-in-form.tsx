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

type SignInFormData = {
  email: string;
  password: string;
}

type FormErrors = Partial<Record<keyof SignInFormData | 'root', string>>

export function SignInForm() {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)
  const [isPasskeyPending, setIsPasskeyPending] = React.useState(false)
  const [errors, setErrors] = React.useState<FormErrors>({})

  const validateForm = (data: SignInFormData): FormErrors => {
    const newErrors: FormErrors = {}

    if (!data.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!data.password) {
      newErrors.password = 'Password is required'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data: SignInFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const validationErrors = validateForm(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsPending(true)

    const { error } = await authClient.signIn.email(
      {
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

  const handlePasskeySignIn = async () => {
    setErrors({})
    setIsPasskeyPending(true)

    const { error } = await authClient.signIn.passkey(
      {},
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

    setIsPasskeyPending(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to sign in to your account
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
              autoComplete="current-password"
              disabled={isPending}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || isPasskeyPending}
          >
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handlePasskeySignIn}
            disabled={isPending || isPasskeyPending}
          >
            {isPasskeyPending ? 'Authenticating...' : 'Sign in with Passkey'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/sign-up"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
