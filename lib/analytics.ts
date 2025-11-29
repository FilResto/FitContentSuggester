import { InstagramMedia, AnalyticsData } from './types';

/**
 * Calculate engagement metrics for Instagram media
 */
export function calculateAnalytics(
  media: InstagramMedia[],
  followersCount: number
): AnalyticsData {
  if (!media || media.length === 0) {
    return {
      avgEngagementRate: 0,
      totalPosts: 0,
      totalLikes: 0,
      totalComments: 0,
      bestPerformingType: 'N/A',
      bestPerformingPost: null,
    };
  }

  // Calculate totals
  const totalLikes = media.reduce((sum, post) => sum + (post.like_count || 0), 0);
  const totalComments = media.reduce((sum, post) => sum + (post.comments_count || 0), 0);
  const totalEngagement = totalLikes + totalComments;

  // Calculate average engagement rate
  // Engagement Rate = ((total likes + total comments) / (followers * number of posts)) * 100
  const avgEngagementRate = followersCount > 0
    ? (totalEngagement / (followersCount * media.length)) * 100
    : 0;

  // Find best performing content type
  const typeStats: Record<string, { total: number; count: number }> = {};

  media.forEach(post => {
    const engagement = (post.like_count || 0) + (post.comments_count || 0);
    const type = post.media_type;

    if (!typeStats[type]) {
      typeStats[type] = { total: 0, count: 0 };
    }

    typeStats[type].total += engagement;
    typeStats[type].count += 1;
  });

  let bestType = 'N/A';
  let highestAvgEngagement = 0;

  Object.entries(typeStats).forEach(([type, stats]) => {
    const avgEngagement = stats.total / stats.count;
    if (avgEngagement > highestAvgEngagement) {
      highestAvgEngagement = avgEngagement;
      bestType = getContentTypeLabel(type);
    }
  });

  // Find best performing post
  let bestPost = media[0];
  let highestPostEngagement = 0;

  media.forEach(post => {
    const engagement = (post.like_count || 0) + (post.comments_count || 0);
    if (engagement > highestPostEngagement) {
      highestPostEngagement = engagement;
      bestPost = post;
    }
  });

  return {
    avgEngagementRate,
    totalPosts: media.length,
    totalLikes,
    totalComments,
    bestPerformingType: bestType,
    bestPerformingPost: bestPost,
  };
}

/**
 * Format engagement rate for display
 */
export function formatEngagementRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

/**
 * Get user-friendly label for content type
 */
export function getContentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'IMAGE': 'Photos',
    'VIDEO': 'Videos',
    'CAROUSEL_ALBUM': 'Carousels',
  };

  return labels[type] || type;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
