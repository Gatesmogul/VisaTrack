import React, { useState } from 'react';
import { useCommunity } from '../../../contexts/CommunityContext';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ReviewForm = ({ country, onSaved }) => {
  const { addPost } = useCommunity();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const p = addPost({ country, rating, text, anonymous: !!anonymous });
    if (onSaved) onSaved(p);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border border-input rounded px-2 py-1">
          {[5,4,3,2,1].map(r => (<option key={r} value={r}>{r}</option>))}
        </select>
        <label className="ml-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} /> Post anonymously</label>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="w-full border border-input rounded p-2" placeholder="Share your experience..." />
      <div className="flex items-center justify-end gap-2">
        <Button type="submit">Submit Review</Button>
      </div>
    </form>
  );
};

const ReviewsList = ({ country }) => {
  const { getPostsForCountry, upvote } = useCommunity();
  const posts = getPostsForCountry(country);
  if (!posts || posts.length === 0) return <div className="text-sm text-muted-foreground">No reviews yet. Be the first to share.</div>;

  return (
    <div className="space-y-3">
      {posts.map(p => (
        <div key={p.id} className="p-3 border rounded">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium">{p.anonymous ? 'Anonymous' : p.author || 'Community member'}</div>
              <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()} — {p.rating} / 5</div>
              <div className="mt-2 text-sm text-muted-foreground">{p.text}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button className="text-sm text-muted-foreground" onClick={() => upvote(p.id)} aria-label="upvote">▲ {p.upvotes || 0}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CommunityReviews = ({ country }) => {
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-heading font-semibold text-foreground">Community Experiences</h3>
        <div className="text-sm text-muted-foreground">Share anonymized reviews</div>
      </div>

      <div className="space-y-4">
        <ReviewForm country={country} onSaved={() => setSaved(true)} />
        <ReviewsList country={country} />
      </div>
    </div>
  );
};

export default CommunityReviews;