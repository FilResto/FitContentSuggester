import { InstagramMedia } from '@/lib/types';

interface PostsGridProps {
  posts: InstagramMedia[];
}

function PostCard({ post }: { post: InstagramMedia }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.media_url && (
        <img
          src={post.media_url}
          alt="Post"
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>❤️ {post.like_count?.toLocaleString() || 0}</span>
          <span>💬 {post.comments_count?.toLocaleString() || 0}</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {post.media_type}
        </div>
        {post.caption && (
          <p className="text-sm text-gray-700 line-clamp-2">{post.caption}</p>
        )}
      </div>
    </div>
  );
}

export default function PostsGrid({ posts }: PostsGridProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
