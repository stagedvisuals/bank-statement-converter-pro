#!/usr/bin/env node
/**
 * Create admin user script for BSC Pro
 * Usage: node scripts/create-admin.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const ADMIN_EMAIL = 'arthybagdas@gmail.com'
const ADMIN_PASSWORD = '@Dim123321!'
const ADMIN_NAME = 'Admin'

async function createAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials')
    console.log('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log('🔧 Creating admin user...')
  console.log('Email:', ADMIN_EMAIL)

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === ADMIN_EMAIL)

    if (existingUser) {
      console.log('⚠️  Admin user already exists')
      console.log('Updating password...')
      
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: ADMIN_PASSWORD }
      )

      if (updateError) {
        console.error('❌ Failed to update password:', updateError.message)
        process.exit(1)
      }

      console.log('✅ Password updated successfully')
    } else {
      // Create new user
      const { data, error } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: ADMIN_NAME,
          role: 'admin'
        }
      })

      if (error) {
        console.error('❌ Failed to create admin:', error.message)
        process.exit(1)
      }

      console.log('✅ Admin user created successfully')
      console.log('User ID:', data.user.id)
    }

    // Ensure profile has admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: existingUser?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === ADMIN_EMAIL)?.id,
        email: ADMIN_EMAIL,
        full_name: ADMIN_NAME,
        role: 'admin'
      })

    if (profileError) {
      console.error('⚠️  Profile update warning:', profileError.message)
    }

    console.log('\n🎉 Admin account ready!')
    console.log('Email:', ADMIN_EMAIL)
    console.log('Password:', ADMIN_PASSWORD)
    console.log('\nLogin at: https://www.bscpro.nl/login')

    process.exit(0)

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createAdmin()
