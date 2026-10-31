import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getSkills, getUpdates } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const [skills, updates] = await Promise.all([getSkills(), getUpdates()]);

  return (
    <DashboardClient
      skills={skills}
      updates={updates}
      userEmail={session.user!.email!}
    />
  );
}
