import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const naam = formData.get('naam') as string;
    const email = formData.get('email') as string;
    const onderwerp = formData.get('onderwerp') as string;
    const bericht = formData.get('bericht') as string;
    const privacy = formData.get('privacy') as string;

    // Validatie
    if (!naam || !email || !onderwerp || !bericht || !privacy) {
      return NextResponse.json(
        { error: 'Alle velden zijn verplicht' },
        { status: 400 }
      );
    }

    // Email validatie
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ongeldig emailadres' },
        { status: 400 }
      );
    }

    // TODO: Hier zou je de email kunnen versturen via Resend of opslaan in Supabase
    // Voor nu loggen we naar console
    console.log('Contact formulier ontvangen:', {
      naam,
      email,
      onderwerp,
      bericht,
      timestamp: new Date().toISOString(),
    });

    // Succes response - redirect terug naar contact pagina met succesmelding
    return NextResponse.redirect(new URL('/contact?success=true', request.url), 302);
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.redirect(new URL('/contact?error=true', request.url), 302);
  }
}