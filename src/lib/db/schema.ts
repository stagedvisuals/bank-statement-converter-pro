import { pgTable, serial, varchar, timestamp, integer, jsonb, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 256 }).unique().notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planType: varchar("plan_type", { length: 50 }).notNull().default("starter"),
  creditBalance: integer("credit_balance").default(0),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 256 }),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  status: varchar("status", { length: 50 }).default("inactive"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversions = pgTable("conversions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  pdfName: varchar("pdf_name", { length: 512 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  downloadUrl: text("download_url"),
  transactionCount: integer("transaction_count"),
  extractedData: jsonb("extracted_data"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type Conversion = typeof conversions.$inferSelect;
