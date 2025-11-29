'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error || !code) {
        router.push('/error');
        return;
      }

      try {
        // Call the API route to process the OAuth callback
        const response = await fetch(`/api/auth/callback?code=${code}`, {
          method: 'GET',
        });

        if (response.ok) {
          // Redirect to dashboard on success
          router.push('/dashboard');
        } else {
          router.push('/error');
        }
      } catch (error) {
        console.error('Callback error:', error);
        router.push('/error');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 text-lg">Authenticating with Instagram...</p>
      </div>
    </div>
  );
}
