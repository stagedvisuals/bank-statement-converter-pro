import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rating, feedback, anonymous, conversion_id, user_email } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert feedback into Supabase
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          rating,
          feedback: feedback || null,
          anonymous: anonymous || false,
          conversion_id: conversion_id || null,
          user_email: user_email || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    // Send email notification for ratings < 4
    if (rating < 4) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'info@bscpro.nl',
            subject: `BSCPro: Nieuwe feedback met rating ${rating}/5`,
            html: `
              <h2>Nieuwe gebruikersfeedback</h2>
              <p><strong>Rating:</strong> ${rating}/5</p>
              <p><strong>Feedback:</strong> ${feedback || 'Geen tekstuele feedback'}</p>
              <p><strong>Anoniem:</strong> ${anonymous ? 'Ja' : 'Nee'}</p>
              <p><strong>Datum:</strong> ${new Date().toLocaleString('nl-NL')}</p>
              ${conversion_id ? `<p><strong>Conversie ID:</strong> ${conversion_id}</p>` : ''}
              ${user_email ? `<p><strong>Gebruiker:</strong> ${user_email}</p>` : ''}
            `,
          }),
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
