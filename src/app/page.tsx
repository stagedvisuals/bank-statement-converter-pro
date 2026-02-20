import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import LandingPage from "@/components/landing-page";

export default async function Home() {
  const { userId } = auth();
  
  if (userId) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
