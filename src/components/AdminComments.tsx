import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Comment } from '../types';
import { MessageSquare, Star, Trash2, Reply, Check, Calendar, ExternalLink, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AdminComments() {
  const { tools } = useAppContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      })) as Comment[];
      setComments(fetched);
      
      // Mark as read when admin views them
      fetched.forEach(comment => {
        if (!comment.isRead) {
          updateDoc(doc(db, 'comments', comment.id), { isRead: true });
        }
      });
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      await deleteDoc(doc(db, 'comments', id));
    }
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    if (window.confirm('Save this reply?')) {
      await updateDoc(doc(db, 'comments', id), {
        reply: replyText
      });
      setReplyingTo(null);
      setReplyText('');
    }
  };

  const handleUpdateDate = async (id: string) => {
    if (!newDate) return;
    if (window.confirm('Are you sure you want to change the comment date?')) {
      await updateDoc(doc(db, 'comments', id), {
        createdAt: Timestamp.fromDate(new Date(newDate))
      });
      setEditingDate(null);
    }
  };

  const getToolName = (toolId: string) => {
    return tools.find(t => t.id === toolId)?.name || 'Unknown Tool';
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Comments & Reviews</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">View user feedback, ratings, and reply to comments.</p>
        </div>
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-bold text-slate-900 dark:text-white">{comment.userName}</h5>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> {getToolName(comment.toolId)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{comment.userEmail}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    {editingDate === comment.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="datetime-local" 
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="text-xs px-2 py-1 rounded border dark:bg-slate-900 dark:border-slate-700"
                        />
                        <button onClick={() => handleUpdateDate(comment.id)} className="text-emerald-500 hover:text-emerald-600"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingDate(null)} className="text-slate-400 hover:text-slate-500"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setEditingDate(comment.id); setNewDate(comment.createdAt.substring(0, 16)); }}
                        className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 hover:text-blue-500 transition-colors"
                      >
                        <Calendar className="w-3 h-3" /> {new Date(comment.createdAt).toLocaleString()}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= comment.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
                    ))}
                  </div>
                  <button onClick={() => handleDelete(comment.id)} className="text-rose-500 hover:text-rose-700 text-sm flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-4 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">{comment.text}</p>
              
              {comment.reply ? (
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Your Reply</p>
                    <button onClick={() => { setReplyingTo(comment.id); setReplyText(comment.reply || ''); }} className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1">
                      <Reply className="w-3 h-3" /> Edit Reply
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{comment.reply}"</p>
                </div>
              ) : (
                replyingTo === comment.id ? (
                  <div className="mt-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-2 text-sm"
                      placeholder="Write your reply..."
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
                      <button onClick={() => handleReply(comment.id)} className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-1">
                        <Check className="w-4 h-4" /> Save Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setReplyingTo(comment.id); setReplyText(''); }} className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1 mt-2">
                    <Reply className="w-4 h-4" /> Reply to comment
                  </button>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
