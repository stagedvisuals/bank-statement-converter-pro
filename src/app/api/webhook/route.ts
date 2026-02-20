import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const priceId = session.metadata?.priceId;

        if (!userId) break;

        const user = await db.query.users.findFirst({
          where: eq(users.clerkId, userId),
        });

        if (!user) break;

        if (priceId === "starter") {
          // Add 5 credits
          await db.update(subscriptions)
            .set({ creditBalance: user.id + 5 })
            .where(eq(subscriptions.userId, user.id));
        } else {
          // Activate subscription
          await db.update(subscriptions)
            .set({
              status: "active",
              planType: "pro",
              stripeSubscriptionId: session.subscription as string,
            })
            .where(eq(subscriptions.userId, user.id));
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription;
        
        // Renew subscription credits
        const sub = await db.query.subscriptions.findFirst({
          where: eq(subscriptions.stripeSubscriptionId, subscriptionId as string),
        });

        if (sub) {
          await db.update(subscriptions)
            .set({ status: "active" })
            .where(eq(subscriptions.id, sub.id));
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
