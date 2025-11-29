import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            FitContent Suggester
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            AI-powered Instagram analytics for fitness creators
          </p>
          <p className="text-lg mb-12">
            Connect your Instagram Business account to get personalized content suggestions
            and improve your engagement with data-driven insights.
          </p>

          <Link href="/api/auth/manual-login">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Connect Instagram
            </Button>
          </Link>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-sm">Track engagement metrics and performance across your posts</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI Suggestions</h3>
              <p className="text-sm">Get personalized content recommendations powered by AI</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Optimize</h3>
              <p className="text-sm">Improve your Instagram strategy and grow your audience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
