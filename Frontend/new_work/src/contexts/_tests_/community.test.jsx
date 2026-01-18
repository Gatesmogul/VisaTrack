import { renderHook, act } from '@testing-library/react-hooks';
import { CommunityProvider, useCommunity } from '../CommunityContext';
import React from 'react';

const wrapper = ({ children }) => <CommunityProvider>{children}</CommunityProvider>;

describe('CommunityContext', () => {
  test('addPost and getPostsForCountry', () => {
    const { result } = renderHook(() => useCommunity(), { wrapper });
    act(() => {
      result.current.addPost({ country: 'Testland', rating: 4, text: 'Ok', anonymous: true });
    });
    const posts = result.current.getPostsForCountry('Testland');
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].text).toBe('Ok');
  });
});