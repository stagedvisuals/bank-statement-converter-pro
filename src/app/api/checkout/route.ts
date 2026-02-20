import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { priceId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: priceId === "starter" ? "5 Conversions Pack" : "Unlimited Monthly",
              description: priceId === "starter" ? "Convert 5 bank statements" : "Unlimited conversions per month",
            },
            unit_amount: priceId === "starter" ? 500 : 2900,
            recurring: priceId === "pro" ? { interval: "month" } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: priceId === "starter" ? "payment" : "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: {
        userId,
        priceId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
