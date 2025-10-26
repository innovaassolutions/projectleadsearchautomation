import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            JobApp
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/jobs" className="text-sm font-medium hover:text-primary">
              Jobs
            </Link>
            <Link href="/projects" className="text-sm font-medium hover:text-primary">
              Projects
            </Link>
          </nav>
        </div>
        <Button variant="outline">Sign In</Button>
      </div>
    </header>
  );
}
