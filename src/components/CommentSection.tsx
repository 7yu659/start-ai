import { useState, useEffect } from 'react';
import { Star, Send, User } from 'lucide-react';
import { Comment } from '../types';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CommentSection({ toolId }: { toolId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('toolId', '==', toolId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      })) as Comment[];
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [toolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !text) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        toolId,
        userName: name,
        userEmail: email,
        text,
        rating,
        createdAt: serverTimestamp()
      });
      setName('');
      setEmail('');
      setText('');
      setRating(5);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to submit comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-12">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">User Reviews & Comments</h3>

      {/* Comment Form */}
      <div className="glass-card p-6 md:p-8 mb-12">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Leave a Review</h4>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email * (Will not be published)</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Review *</label>
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Share your experience with this tool..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Review</>}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">{comment.userName}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= comment.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.text}</p>
              
              {comment.reply && (
                <div className="mt-4 ml-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-l-4 border-blue-500">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Admin Reply</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{comment.reply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
