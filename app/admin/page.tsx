"use client";

import { useAccount } from "wagmi";
import { Card } from "@/components/ui";
import { config } from "@/lib/config";

export default function AdminPage() {
  const { address } = useAccount();

  // Check if user is admin (basic check, will be enhanced later)
  const isAdmin = config.adminAddresses.includes(address?.toLowerCase() || "");

  if (!isAdmin) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-200px)] max-w-7xl items-center justify-center px-4 py-16">
        <Card className="max-w-md text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Access Denied</h2>
          <p className="text-foreground/70">
            You don&apos;t have permission to access this page.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Card>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Admin Panel</h2>
        <p className="text-sm text-foreground/70">
          Admin features will be implemented in later phases. This will include:
        </p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-foreground/70">
          <li>Create/close/resolve markets</li>
          <li>Seed demo data</li>
          <li>Toggle simulated APR rate</li>
        </ul>
      </Card>
    </div>
  );
}
