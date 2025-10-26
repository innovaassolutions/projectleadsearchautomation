import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function HomePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'Not configured';
  const environment = process.env.NEXT_PUBLIC_APP_ENV || 'unknown';

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="flex justify-center mb-4">
          <Badge variant="default" className="bg-green-500">
            System Operational
          </Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Job Application System
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Automated job search and application platform
        </p>
        <Link href="/dashboard">
          <Button size="lg">View Dashboard</Button>
        </Link>
      </section>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current environment configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="font-medium">Environment:</span>
              <Badge variant="outline">{environment}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">API URL:</span>
              <span className="text-sm text-muted-foreground truncate max-w-xs">
                {apiUrl}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Placeholder */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Jobs Scraped</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Applications Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
