import { InstagramProfile } from '@/lib/types';

interface ProfileHeaderProps {
  profile: InstagramProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center space-x-4">
        {profile.profile_picture_url && (
          <img
            src={profile.profile_picture_url}
            alt={profile.username}
            className="w-20 h-20 rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">@{profile.username}</h1>
          <div className="flex space-x-4 mt-2 text-gray-600">
            <span className="font-medium">{profile.followers_count.toLocaleString()} followers</span>
            <span>{profile.media_count} posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
