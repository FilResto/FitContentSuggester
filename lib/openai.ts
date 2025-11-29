import OpenAI from 'openai';
import { InstagramProfile, InstagramMedia, AnalyticsData, AISuggestion } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FITNESS_BEST_PRACTICES = `
Fitness Content Best Practices for Instagram:
- Post workout videos and transformation photos to inspire followers
- Share nutrition tips, meal prep ideas, and healthy recipes
- Use before/after comparisons to show results and progress
- Include exercise demonstrations with proper form and technique
- Post during peak engagement times (typically 6-9 AM and 5-8 PM)
- Use relevant hashtags like #fitness #workout #fitfam #gym #health #wellness
- Mix educational content with inspirational posts
- Show authenticity and share your personal fitness journey
- Engage with your fitness community through comments and stories
- Post Reels for higher reach and engagement
- Include clear calls-to-action in captions
- Share client testimonials and success stories
`;

/**
 * Generate AI-powered content suggestions based on Instagram data
 */
export async function generateContentSuggestions(
  profile: InstagramProfile,
  analytics: AnalyticsData,
  recentPosts: InstagramMedia[]
): Promise<AISuggestion[]> {
  // Build context from recent post captions
  const captions = recentPosts
    .filter(p => p.caption && p.caption.trim().length > 0)
    .slice(0, 10)
    .map(p => p.caption)
    .join('\n---\n');

  const prompt = `You are a professional fitness content strategist analyzing Instagram performance for fitness influencers.

User Profile:
- Username: ${profile.username}
- Followers: ${profile.followers_count.toLocaleString()}
- Total Posts Analyzed: ${analytics.totalPosts}

Performance Metrics:
- Average Engagement Rate: ${analytics.avgEngagementRate.toFixed(2)}%
- Total Likes (last ${analytics.totalPosts} posts): ${analytics.totalLikes.toLocaleString()}
- Total Comments (last ${analytics.totalPosts} posts): ${analytics.totalComments.toLocaleString()}
- Best Performing Content Type: ${analytics.bestPerformingType}

Recent Post Captions:
${captions || 'No captions available'}

${FITNESS_BEST_PRACTICES}

Based on this data, analyze the user's content strategy and provide 5-7 specific, actionable suggestions to improve their Instagram engagement and content strategy.

Focus on:
1. Content types that would perform better based on their current performance
2. Posting strategy and timing recommendations
3. Caption writing and storytelling improvements
4. Hashtag and discovery optimization
5. Community engagement tactics

Provide your response as a JSON array with this exact structure:
[
  {
    "category": "Content Strategy",
    "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
  },
  {
    "category": "Posting & Timing",
    "suggestions": ["suggestion 1", "suggestion 2"]
  },
  {
    "category": "Engagement Tactics",
    "suggestions": ["suggestion 1", "suggestion 2"]
  }
]

Make each suggestion specific, actionable, and based on the actual data provided. Avoid generic advice.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a fitness social media expert providing Instagram content strategy advice. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);

    // Handle different response formats
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
      return parsed.suggestions;
    } else {
      // If the response is wrapped in an object, try to extract the array
      const keys = Object.keys(parsed);
      const firstKey = keys[0];
      if (Array.isArray(parsed[firstKey])) {
        return parsed[firstKey];
      }
    }

    throw new Error('Invalid response format from OpenAI');
  } catch (error: any) {
    console.error('Error generating content suggestions:', error.message);

    // Fallback suggestions if OpenAI fails
    return [
      {
        category: 'Content Strategy',
        suggestions: [
          `Focus more on ${analytics.bestPerformingType.toLowerCase()} as they perform best for your audience`,
          'Share more behind-the-scenes content from your fitness journey',
          'Create educational content about proper exercise form and technique',
        ],
      },
      {
        category: 'Posting & Timing',
        suggestions: [
          'Post during peak hours (6-9 AM and 5-8 PM) when your audience is most active',
          'Maintain a consistent posting schedule of 4-5 times per week',
        ],
      },
      {
        category: 'Engagement Tactics',
        suggestions: [
          'Ask questions in your captions to encourage comments',
          'Respond to comments within the first hour to boost engagement',
          'Use 20-30 relevant hashtags to increase discoverability',
        ],
      },
    ];
  }
}
