import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Rating {
  id: string;
  template_id: string;
  user_id: string;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
}

interface TemplateStats {
  average_rating: number;
  total_ratings: number;
  total_generates: number;
  total_clones: number;
  rating_distribution: { [key: number]: number };
}

interface TemplateRatingProps {
  templateId: string;
  showReviews?: boolean;
  showStats?: boolean;
  onRatingSubmit?: (rating: Rating) => void;
}

export const TemplateRating: React.FC<TemplateRatingProps> = ({
  templateId,
  showReviews = true,
  showStats = false,
  onRatingSubmit
}) => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [stats, setStats] = useState<TemplateStats>({
    average_rating: 0,
    total_ratings: 0,
    total_generates: 0,
    total_clones: 0,
    rating_distribution: {}
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchRatings();
    fetchStats();
    if (user) {
      fetchUserRating();
    }
  }, [templateId, user]);

  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('template_ratings')
        .select(`
          *,
          user:user_id(email, full_name, avatar_url)
        `)
        .eq('template_id', templateId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRatings(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRating = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('template_ratings')
        .select('*')
        .eq('template_id', templateId)
        .eq('user_id', user.id)
        .single();

      if (data) {
        setUserRating(data);
        setSelectedRating(data.rating);
        setReview(data.review || '');
      }
    } catch (error) {
      // User hasn't rated yet
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('template_analytics')
        .select('event_type')
        .eq('template_id', templateId);

      if (error) throw error;

      const analytics = data || [];
      setStats(prev => ({
        ...prev,
        total_generates: analytics.filter(a => a.event_type === 'generate').length,
        total_clones: analytics.filter(a => a.event_type === 'clone').length
      }));
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const calculateStats = (ratings: Rating[]) => {
    if (ratings.length === 0) {
      setStats(prev => ({
        ...prev,
        average_rating: 0,
        total_ratings: 0,
        rating_distribution: {}
      }));
      return;
    }

    const distribution: { [key: number]: number } = {};
    let total = 0;

    ratings.forEach(r => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      total += r.rating;
    });

    setStats(prev => ({
      ...prev,
      average_rating: total / ratings.length,
      total_ratings: ratings.length,
      rating_distribution: distribution
    }));
  };

  const submitRating = async () => {
    if (!user || selectedRating === 0) return;

    setSubmitting(true);
    try {
      const ratingData = {
        template_id: templateId,
        user_id: user.id,
        rating: selectedRating,
        review: review.trim() || null
      };

      let result;
      if (userRating) {
        // Update existing rating
        const { data, error } = await supabase
          .from('template_ratings')
          .update({
            ...ratingData,
            updated_at: new Date().toISOString()
          })
          .eq('id', userRating.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new rating
        const { data, error } = await supabase
          .from('template_ratings')
          .insert(ratingData)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      setUserRating(result);
      setShowReviewForm(false);
      
      if (onRatingSubmit) {
        onRatingSubmit(result);
      }

      // Refresh ratings
      fetchRatings();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setSelectedRating(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= (interactive ? hoveredStar || selectedRating : rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-background rounded-lg border border-border p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">
                {stats.average_rating.toFixed(1)}
              </span>
              {renderStars(Math.round(stats.average_rating))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Based on {stats.total_ratings} {stats.total_ratings === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {user && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {userRating ? 'Update Review' : 'Write a Review'}
            </button>
          )}
        </div>

        {showStats && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-primary">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{stats.total_ratings}</span>
              </div>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-green-500">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">{stats.total_generates}</span>
              </div>
              <p className="text-xs text-muted-foreground">Generates</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-blue-500">
                <BarChart3 className="w-4 h-4" />
                <span className="font-semibold">{stats.total_clones}</span>
              </div>
              <p className="text-xs text-muted-foreground">Clones</p>
            </div>
          </div>
        )}

        {/* Rating Distribution */}
        {stats.total_ratings > 0 && (
          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.rating_distribution[star] || 0;
              const percentage = (count / stats.total_ratings) * 100;
              
              return (
                <div key={star} className="flex items-center space-x-2">
                  <span className="text-sm w-4">{star}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-10 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && user && (
        <div className="bg-background rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">
            {userRating ? 'Update Your Review' : 'Write a Review'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              {renderStars(selectedRating, true)}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Review (Optional)</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this template..."
                className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={submitRating}
                disabled={selectedRating === 0 || submitting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : userRating ? 'Update' : 'Submit'}
              </button>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setSelectedRating(userRating?.rating || 0);
                  setReview(userRating?.review || '');
                }}
                className="px-4 py-2 border border-border rounded-md hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {showReviews && ratings.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Reviews</h3>
          {ratings.map((rating) => (
            <div key={rating.id} className="bg-background rounded-lg border border-border p-4">
              <div className="flex items-start space-x-3">
                {rating.user?.avatar_url ? (
                  <img
                    src={rating.user.avatar_url}
                    alt={rating.user.full_name || rating.user.email}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {(rating.user?.full_name || rating.user?.email || '?')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {rating.user?.full_name || rating.user?.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(rating.rating)}
                        <span className="text-xs text-muted-foreground">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {user?.id === rating.user_id && (
                      <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                        Your Review
                      </span>
                    )}
                  </div>
                  
                  {rating.review && (
                    <p className="mt-2 text-sm text-foreground">{rating.review}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};