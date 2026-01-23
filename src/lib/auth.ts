import { passkey } from '@better-auth/passkey'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '~/db'
import * as authSchema from '~/db/schema/auth-schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [ 
      passkey(), 
  ], 
})
