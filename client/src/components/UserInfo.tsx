import React from 'react';
import { UserData } from '@/types/quiz';

interface UserInfoProps {
  userData: UserData;
  compact?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ userData, compact = false }) => {
  return (
    <div id="user-info" className="flex items-center p-4 border-b border-dark-border">
      <img 
        src={userData.photo_100} 
        alt={userData.first_name}
        className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full mr-${compact ? '2' : '3'}`}
      />
      <span className={`${compact ? 'text-sm' : ''} font-medium`}>{userData.first_name}</span>
    </div>
  );
};

export default UserInfo;
