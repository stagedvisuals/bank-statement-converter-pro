import { supabase } from './supabase'

  // Check if user exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .single()

  if (existing) return existing

  // Create new user with 2 free credits
  const { data: newUser, error } = await supabase
    .from('profiles')
    .insert({
      email: userEmail,
      credits: 2,
      plan_type: 'starter'
    })
    .select()
    .single()

  if (error) throw error
  return newUser
}

  const { data } = await supabase
    .from('profiles')
    .select('credits, plan_type')
    .single()
  
  return data
}

  const { data: user } = await supabase
    .from('profiles')
    .select('credits, plan_type')
    .single()

  if (user?.plan_type === 'unlimited') return true
  if ((user?.credits || 0) <= 0) return false

  await supabase
    .from('profiles')
    .update({ credits: (user?.credits || 0) - 1 })

  return true
}

  const { data: user } = await supabase
    .from('profiles')
    .select('credits')
    .single()

  await supabase
    .from('profiles')
    .update({ credits: (user?.credits || 0) + amount })
}
