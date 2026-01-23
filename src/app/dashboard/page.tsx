'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '~/lib/auth-client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

type Passkey = {
  id: string
  name?: string | null
  credentialID: string
  createdAt?: Date | null
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, isPending, error } = authClient.useSession()
  const [isAddingPasskey, setIsAddingPasskey] = React.useState(false)
  const [passkeyMessage, setPasskeyMessage] = React.useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [passkeys, setPasskeys] = React.useState<Passkey[]>([])
  const [isLoadingPasskeys, setIsLoadingPasskeys] = React.useState(false)
  const [editingPasskeyId, setEditingPasskeyId] = React.useState<string | null>(null)
  const [editingName, setEditingName] = React.useState('')
  const [deletingPasskeyId, setDeletingPasskeyId] = React.useState<string | null>(null)

  const fetchPasskeys = React.useCallback(async () => {
    setIsLoadingPasskeys(true)
    const { data, error } = await authClient.passkey.listUserPasskeys()
    if (data && !error) {
      setPasskeys(data)
    }
    setIsLoadingPasskeys(false)
  }, [])

  React.useEffect(() => {
    if (session) {
      fetchPasskeys()
    }
  }, [session, fetchPasskeys])

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in')
          router.refresh()
        },
      },
    })
  }

  const handleAddPasskey = async () => {
    setIsAddingPasskey(true)
    setPasskeyMessage(null)

    const { error } = await authClient.passkey.addPasskey({
      authenticatorAttachment: 'platform',
    })

    if (error) {
      setPasskeyMessage({ type: 'error', text: error.message ?? 'Failed to add passkey' })
    } else {
      setPasskeyMessage({ type: 'success', text: 'Passkey registered successfully!' })
      await fetchPasskeys()
    }

    setIsAddingPasskey(false)
  }

  const handleDeletePasskey = async (id: string) => {
    setDeletingPasskeyId(id)
    setPasskeyMessage(null)

    const { error } = await authClient.passkey.deletePasskey({ id })

    if (error) {
      setPasskeyMessage({ type: 'error', text: error.message ?? 'Failed to delete passkey' })
    } else {
      setPasskeyMessage({ type: 'success', text: 'Passkey deleted successfully!' })
      await fetchPasskeys()
    }

    setDeletingPasskeyId(null)
  }

  const handleStartEdit = (passkey: Passkey) => {
    setEditingPasskeyId(passkey.id)
    setEditingName(passkey.name ?? '')
  }

  const handleCancelEdit = () => {
    setEditingPasskeyId(null)
    setEditingName('')
  }

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) {
      setPasskeyMessage({ type: 'error', text: 'Passkey name cannot be empty' })
      return
    }

    setPasskeyMessage(null)

    const { error } = await authClient.passkey.updatePasskey({
      id,
      name: editingName.trim(),
    })

    if (error) {
      setPasskeyMessage({ type: 'error', text: error.message ?? 'Failed to update passkey' })
    } else {
      setPasskeyMessage({ type: 'success', text: 'Passkey renamed successfully!' })
      await fetchPasskeys()
    }

    setEditingPasskeyId(null)
    setEditingName('')
  }

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    )
  }

  if (error || !session) {
    router.push('/sign-in')
    return null
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
          <CardDescription>Welcome back!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="font-medium">{session.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>
          <div className="space-y-2">
            <Button
              onClick={handleAddPasskey}
              variant="secondary"
              className="w-full"
              disabled={isAddingPasskey}
            >
              {isAddingPasskey ? 'Registering...' : 'Add Passkey'}
            </Button>
            {passkeyMessage && (
              <p
                className={`text-sm ${
                  passkeyMessage.type === 'success'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-destructive'
                }`}
              >
                {passkeyMessage.text}
              </p>
            )}
          </div>

          {/* Passkeys List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Your Passkeys</h3>
            {isLoadingPasskeys ? (
              <p className="text-sm text-muted-foreground">Loading passkeys...</p>
            ) : passkeys.length === 0 ? (
              <p className="text-sm text-muted-foreground">No passkeys registered yet.</p>
            ) : (
              <ul className="space-y-2">
                {passkeys.map((passkey) => (
                  <li
                    key={passkey.id}
                    className="rounded-md border p-3 text-sm"
                  >
                    {editingPasskeyId === passkey.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          placeholder="Passkey name"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(passkey.id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {passkey.name ?? 'Unnamed Passkey'}
                          </p>
                          {passkey.createdAt && (
                            <p className="text-xs text-muted-foreground">
                              Added {new Date(passkey.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEdit(passkey)}
                          >
                            Rename
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeletePasskey(passkey.id)}
                            disabled={deletingPasskeyId === passkey.id}
                          >
                            {deletingPasskeyId === passkey.id ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign out
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
