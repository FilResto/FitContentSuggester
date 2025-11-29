import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          There was an error connecting to Instagram. This could be due to:
        </p>
        <ul className="text-left text-gray-600 mb-8 space-y-2">
          <li>• Declined authorization</li>
          <li>• Network issues</li>
          <li>• Invalid Instagram account type (requires Business/Creator account)</li>
        </ul>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
