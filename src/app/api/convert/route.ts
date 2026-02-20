import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { users, subscriptions, conversions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import pdfParse from "pdf-parse";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user credits
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
      with: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check credits
    if (user.subscription?.status !== "active" && (user.subscription?.creditBalance || 0) <= 0) {
      return NextResponse.json({ error: "No credits available" }, { status: 403 });
    }

    // Get file from request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create conversion record
    const conversion = await db.insert(conversions).values({
      userId: user.id,
      pdfName: file.name,
      status: "processing",
    }).returning();

    try {
      // Parse PDF
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfData = await pdfParse(buffer);
      const text = pdfData.text;

      // Extract transactions (basic pattern matching)
      const transactions = extractTransactions(text);

      // Generate CSV
      const csv = generateCSV(transactions);

      // Update conversion record
      await db.update(conversions)
        .set({
          status: "completed",
          transactionCount: transactions.length,
          extractedData: transactions,
          completedAt: new Date(),
        })
        .where(eq(conversions.id, conversion[0].id));

      // Deduct credit if not on subscription
      if (user.subscription?.status !== "active") {
        await db.update(subscriptions)
          .set({ creditBalance: (user.subscription?.creditBalance || 0) - 1 })
          .where(eq(subscriptions.userId, user.id));
      }

      return NextResponse.json({
        success: true,
        conversionId: conversion[0].id,
        transactionCount: transactions.length,
        csv: csv,
      });

    } catch (error) {
      await db.update(conversions)
        .set({
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        })
        .where(eq(conversions.id, conversion[0].id));

      throw error;
    }

  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}

function extractTransactions(text: string): any[] {
  const transactions = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Pattern: Date (DD-MM-YYYY) Description Amount
    const match = line.match(/(\d{2}-\d{2}-\d{4})\s+(.+?)\s+([\d.,]+)/);
    if (match) {
      transactions.push({
        date: match[1],
        description: match[2].trim(),
        amount: match[3].replace(',', '.'),
      });
    }
  }
  
  return transactions;
}

function generateCSV(transactions: any[]): string {
  const header = "Date,Description,Amount\n";
  const rows = transactions.map(t => `${t.date},"${t.description}",${t.amount}`).join("\n");
  return header + rows;
}
