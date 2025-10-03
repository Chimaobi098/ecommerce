// lib/supabase-utils.ts
import { createClient as createBrowserClient } from './client'
import { createClient as createServerClient } from './server'
import { Database } from '@/types/database.types'

// For client components
export function getSupabaseClient() {
  return createBrowserClient() as ReturnType<typeof createBrowserClient> & {
    // Add your custom database type here if needed
  }
}

// For server components and API routes
export async function getSupabaseServer() {
  return await createServerClient() as Awaited<ReturnType<typeof createServerClient>> & {
    // Add your custom database type here if needed
  }
}