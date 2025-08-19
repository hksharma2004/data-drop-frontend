"use client";

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../actions/user.actions';
import { Models } from 'node-appwrite';

export const useCurrentUser = () => {
  const [user, setUser] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
