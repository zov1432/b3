import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const FollowContext = createContext();

export const useFollow = () => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
};

export const FollowProvider = ({ children }) => {
  const { apiRequest } = useAuth();
  const [followingUsers, setFollowingUsers] = useState(new Map()); // userId -> isFollowing boolean

  const followUser = async (userId) => {
    try {
      const response = await apiRequest(`/api/users/${userId}/follow`, {
        method: 'POST',
      });
      
      if (response.message) {
        // Update local state
        setFollowingUsers(prev => new Map(prev.set(userId, true)));
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error('Error following user:', error);
      return { success: false, error: error.message };
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const response = await apiRequest(`/api/users/${userId}/follow`, {
        method: 'DELETE',
      });
      
      if (response.message) {
        // Update local state
        setFollowingUsers(prev => new Map(prev.set(userId, false)));
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return { success: false, error: error.message };
    }
  };

  const getFollowStatus = async (userId) => {
    try {
      const response = await apiRequest(`/api/users/${userId}/follow-status`);
      // Update local cache
      setFollowingUsers(prev => new Map(prev.set(userId, response.is_following)));
      return response.is_following;
    } catch (error) {
      console.error('Error getting follow status:', error);
      return false;
    }
  };

  const isFollowing = (userId) => {
    return followingUsers.get(userId) || false;
  };

  const getFollowingUsers = async () => {
    try {
      const response = await apiRequest('/api/users/following');
      // Update local cache
      const followingMap = new Map();
      response.following.forEach(user => {
        followingMap.set(user.id, true);
      });
      setFollowingUsers(followingMap);
      return response;
    } catch (error) {
      console.error('Error getting following users:', error);
      return { following: [], total: 0 };
    }
  };

  const value = {
    followUser,
    unfollowUser,
    getFollowStatus,
    isFollowing,
    getFollowingUsers,
    followingUsers
  };

  return (
    <FollowContext.Provider value={value}>
      {children}
    </FollowContext.Provider>
  );
};