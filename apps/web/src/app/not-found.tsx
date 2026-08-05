import React from 'react';
import Link from 'next/link';
import { Button } from '@hotspots/ui-web';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-3 p-4">
      <div className="p-4 bg-[#FFF3C4] text-[#C62828] rounded-full">
        <Compass className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-[#2B2B2B]">Page Not Found</h2>
      <p className="text-xs text-[#414643] max-w-xs">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/discover">
        <Button variant="primary" size="md">
          Back to Discover
        </Button>
      </Link>
    </div>
  );
}
