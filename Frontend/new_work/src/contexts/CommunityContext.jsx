import React, { createContext, useContext, useEffect, useState } from 'react';

const CommunityContext = createContext(null);
const STORAGE_KEY = 'visatrack.community';

const defaultPosts = [
  { id: '1', country: 'Thailand', rating: 5, text: 'Quick VOA experience at BKK, friendly staff.', anonymous: true, createdAt: new Date().toISOString(), upvotes: 3 },
  { id: '2', country: 'France', rating: 4, text: 'Schengen appointment process took a while but straightforward.', anonymous: false, author: 'user@example.com', createdAt: new Date().toISOString(), upvotes: 2 }
];

export const CommunityProvider = ({ children }) => {
  const [posts, setPosts] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultPosts;
    } catch (e) {
      return defaultPosts;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); } catch (e) {}
  }, [posts]);

  const addPost = (post) => {
    const p = { id: Date.now().toString(), createdAt: new Date().toISOString(), upvotes: 0, ...post };
    setPosts((prev) => [p, ...prev]);
    return p;
  };

  const upvote = (id) => setPosts((prev) => prev.map(p => p.id === id ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p));
  const removePost = (id) => setPosts((prev) => prev.filter(p => p.id !== id));

  const getPostsForCountry = (country) => posts.filter(p => (p.country || '').toString().toLowerCase() === (country || '').toString().toLowerCase());

  return (
    <CommunityContext.Provider value={{ posts, addPost, upvote, removePost, getPostsForCountry }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
};

export default CommunityContext;