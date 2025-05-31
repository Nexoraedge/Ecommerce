'use client';

import { useState } from 'react';
import { Star, User, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  productId: string;
}

interface ProductReviewsProps {
  productId: string;
  initialReviews?: Review[];
}

export default function ProductReviews({ productId, initialReviews = [] }: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this to your API
      const newReview: Review = {
        id: Math.random().toString(36).substring(2, 9),
        userId: user.id,
        userName: user.email?.split('@')[0] || 'Anonymous',
        rating,
        comment,
        date: new Date().toISOString(),
        helpful: 0,
        productId
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setReviews(prev => [newReview, ...prev]);
      setComment('');
      setRating(5);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAsHelpful = (reviewId: string) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 } 
          : review
      )
    );
  };

  const renderStars = (count: number, interactive = false) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <button
        key={i}
        type={interactive ? "button" : "button"}
        onClick={interactive ? () => setRating(i + 1) : undefined}
        onMouseEnter={interactive ? () => setHoveredStar(i + 1) : undefined}
        onMouseLeave={interactive ? () => setHoveredStar(null) : undefined}
        className={`${interactive ? 'cursor-pointer' : ''}`}
      >
        <Star 
          className={`w-5 h-5 ${
            (interactive && (hoveredStar !== null ? i < hoveredStar : i < rating)) || 
            (!interactive && i < count) 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300 dark:text-gray-600'
          }`} 
        />
      </button>
    ));
  };

  return (
    <div className="mt-10 border-t border-border pt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Customer Reviews</h3>
        {user && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Write a Review
          </button>
        )}
        {!user && (
          <button
            onClick={() => window.location.href = '/auth/signin?next=' + encodeURIComponent(window.location.pathname)}
            className="px-4 py-2 bg-muted text-foreground border border-border rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Sign in to Review
          </button>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-4 border border-border">
              <form onSubmit={handleSubmitReview}>
                <h4 className="text-lg font-medium text-foreground mb-3">Your Review</h4>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {renderStars(rating, true)}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-muted/20 rounded-lg border border-border">
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-6 last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="bg-muted rounded-full p-2 mr-3">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{review.userName}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex mr-2">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => markAsHelpful(review.id)}
                  className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{review.helpful > 0 ? `${review.helpful} helpful` : 'Helpful'}</span>
                </button>
              </div>
              <p className="mt-3 text-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
