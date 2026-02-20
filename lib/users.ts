import { auth } from '@clerk/nextjs/server'
import { supabase } from './supabase'

export async function getOrCreateUser(clerkId: string, email: string) {
  // Check if user exists
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single()

  if (existing) return existing

  // Create new user with 2 free credits
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      clerk_id: clerkId,
      email: email,
      credits: 2,
      plan_type: 'starter'
    })
    .select()
    .single()

  if (error) throw error
  return newUser
}

export async function getUserCredits(clerkId: string) {
  const { data } = await supabase
    .from('users')
    .select('credits, plan_type')
    .eq('clerk_id', clerkId)
    .single()
  
  return data
}

export async function deductCredit(clerkId: string) {
  const { data: user } = await supabase
    .from('users')
    .select('credits, plan_type')
    .eq('clerk_id', clerkId)
    .single()

  if (user?.plan_type === 'unlimited') return true
  if ((user?.credits || 0) <= 0) return false

  await supabase
    .from('users')
    .update({ credits: (user.credits || 0) - 1 })
    .eq('clerk_id', clerkId)

  return true
}

export async function addCredits(clerkId: string, amount: number) {
  const { data: user } = await supabase
    .from('users')
    .select('credits')
    .eq('clerk_id', clerkId)
    .single()

  await supabase
    .from('users')
    .update({ credits: (user?.credits || 0) + amount })
    .eq('clerk_id', clerkId)
}
