import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 text-lg">Authenticating with Instagram...</p>
      </div>
    </div>
  );
}
