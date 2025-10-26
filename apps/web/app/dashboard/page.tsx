// app/dashboard/page.tsx
import { HealthDashboard } from '@/components/dashboard/HealthDashboard';

export const metadata = {
  title: 'System Health Dashboard',
  description: 'Monitor the health of all system services',
};

/**
 * Fetch initial health data on server for SSR
 * This provides instant content on page load
 */
async function getInitialHealth() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
    const response = await fetch(`${baseUrl}/api/health`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Health check failed:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch initial health:', error);
    return null;
  }
}

/**
 * System Health Dashboard Page
 * Server component that fetches initial health data and renders the client dashboard
 */
export default async function DashboardPage() {
  const initialHealth = await getInitialHealth();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Health Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor the status of all system services in real-time
          </p>
        </div>
      </div>

      <HealthDashboard initialData={initialHealth} />
    </div>
  );
}
