import { passkeyClient } from '@better-auth/passkey/client'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
  plugins: [ 
    passkeyClient() 
  ] 
})