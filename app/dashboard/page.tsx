'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InstagramProfile, InstagramMedia, AnalyticsData, AISuggestion } from '@/lib/types';
import { calculateAnalytics } from '@/lib/analytics';
import Navbar from '@/components/Navbar';
import ProfileHeader from '@/components/dashboard/ProfileHeader';
import AnalyticsOverview from '@/components/dashboard/AnalyticsOverview';
import PostsGrid from '@/components/dashboard/PostsGrid';
import AISuggestions from '@/components/dashboard/AISuggestions';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      // Fetch profile
      const profileRes = await fetch('/api/instagram/profile');
      if (!profileRes.ok) {
        router.push('/');
        return;
      }
      const profileData = await profileRes.json();
      setProfile(profileData);

      // Fetch media
      const mediaRes = await fetch('/api/instagram/media');
      const mediaData = await mediaRes.json();
      setMedia(mediaData.data || []);

      // Calculate analytics
      const analyticsData = calculateAnalytics(
        mediaData.data || [],
        profileData.followers_count
      );
      setAnalytics(analyticsData);

      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      router.push('/');
    }
  }

  async function generateSuggestions() {
    try {
      const res = await fetch('/api/suggestions', { method: 'POST' });
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    }
  }

  if (loading || !profile || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <ProfileHeader profile={profile} />

        <AnalyticsOverview analytics={analytics} />

        <PostsGrid posts={media} />

        <AISuggestions suggestions={suggestions} onGenerate={generateSuggestions} />
      </div>
    </div>
  );
}
