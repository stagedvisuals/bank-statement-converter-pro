import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, subscriptions, conversions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Converter from "@/components/converter";
import Link from "next/link";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  // Get or create user
  let user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
    with: {
      subscription: true,
    },
  });

  if (!user) {
    // Create new user
    const newUser = await db.insert(users).values({
      clerkId: userId,
      email: "", // Will be populated by webhook
    }).returning();
    
    // Create subscription
    await db.insert(subscriptions).values({
      userId: newUser[0].id,
      planType: "starter",
      creditBalance: 2, // 2 free conversions
    });
    
    user = await db.query.users.findFirst({
      where: eq(users.id, newUser[0].id),
      with: {
        subscription: true,
      },
    });
  }

  const userConversions = await db.query.conversions.findMany({
    where: eq(conversions.userId, user!.id),
    orderBy: (conversions, { desc }) => [desc(conversions.createdAt)],
    limit: 10,
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold gradient-text">
              BSC Pro
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                Credits: <span className="text-[var(--neon-blue)] font-bold">{user?.subscription?.creditBalance || 0}</span>
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="text-gray-400 text-sm mb-1">Beschikbare Credits</div>
            <div className="text-3xl font-bold text-white">{user?.subscription?.creditBalance || 0}</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-gray-400 text-sm mb-1">Abonnement</div>
            <div className={`text-3xl font-bold ${user?.subscription?.status === "active" ? "text-[var(--neon-blue)]" : "text-gray-500"}`}>
              {user?.subscription?.status === "active" ? "Active" : "Starter"}
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-gray-400 text-sm mb-1">Totaal Conversies</div>
            <div className="text-3xl font-bold text-white">{userConversions.length}</div>
          </div>
        </div>

        {/* Converter */}
        <div className="glass rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Nieuwe Conversie</h2>
          <Converter />
        </div>

        {/* History */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Conversie Geschiedenis</h2>
          
          {userConversions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left py-3">Datum</th>
                    <th className="text-left py-3">Bestand</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Transacties</th>
                  </tr>
                </thead>
                <tbody>
                  {userConversions.map((conv) => (
                    <tr key={conv.id} className="border-b border-gray-800">
                      <td className="py-4">{new Date(conv.createdAt!).toLocaleDateString("nl-NL")}</td>
                      <td className="py-4">{conv.pdfName}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          conv.status === "completed" ? "bg-green-500/20 text-green-400" :
                          conv.status === "processing" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {conv.status}
                        </span>
                      </td>
                      <td className="py-4">{conv.transactionCount || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nog geen conversies. Upload je eerste bestand!</p>
          )}
        </div>
      </div>
    </div>
  );
}
