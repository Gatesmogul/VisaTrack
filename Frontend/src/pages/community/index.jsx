import React from 'react';
import Header from '../../components/ui/Header';
import { Helmet } from 'react-helmet';
import { useCommunity } from '../../contexts/CommunityContext';
import Button from '../../components/ui/Button';

const CommunityPage = () => {
  const { posts } = useCommunity();

  return (
    <>
      <Helmet>
        <title>Community - VisaTrack</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-heading font-semibold mb-4">Community</h1>
          <p className="text-sm text-muted-foreground mb-6">Browse public visa experiences and shared tips from the community (anonymized where selected).</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              {posts.map(p => (
                <div key={p.id} className="p-4 border rounded mb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{p.anonymous ? 'Anonymous' : p.author || 'Community member'}</div>
                      <div className="text-xs text-muted-foreground">{p.country} — {p.rating} / 5 — {new Date(p.createdAt).toLocaleDateString()}</div>
                      <div className="mt-2 text-sm text-muted-foreground">{p.text}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">▲ {p.upvotes || 0}</div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-medium mb-3">Get involved</h3>
              <p className="text-sm text-muted-foreground mb-4">Share your visa experiences to help others plan better.</p>
              <Button onClick={() => window.location.href = '/visa-requirements-lookup'}>Find a destination</Button>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
};

export default CommunityPage;