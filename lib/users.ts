import { supabase } from './supabase'

export async function getOrCreateUser(userId: string, email: string) {
  // Check if user exists
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (existing) return existing

  // Create new user with 2 free credits
  const { data: newUser, error } = await supabase
    .from('user_profiles')
    .insert({
      user_id: userId,
      email: email,
      credits: 2,
      plan_type: 'starter'
    })
    .select()
    .single()

  if (error) throw error
  return newUser
}

export async function getUserCredits(userId: string) {
  const { data } = await supabase
    .from('user_profiles')
    .select('credits, plan_type')
    .eq('user_id', userId)
    .single()
  
  return data
}

export async function useCredit(userId: string) {
  const { data: user } = await supabase
    .from('user_profiles')
    .select('credits, plan_type')
    .eq('user_id', userId)
    .single()

  if (user?.plan_type === 'unlimited') return true
  if ((user?.credits || 0) <= 0) return false

  await supabase
    .from('user_profiles')
    .update({ credits: (user?.credits || 0) - 1 })
    .eq('user_id', userId)

  return true
}

export async function addCredits(userId: string, amount: number) {
  const { data: user } = await supabase
    .from('user_profiles')
    .select('credits')
    .eq('user_id', userId)
    .single()

  await supabase
    .from('user_profiles')
    .update({ credits: (user?.credits || 0) + amount })
    .eq('user_id', userId)
}
