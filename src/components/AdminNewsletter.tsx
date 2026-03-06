import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Mail, Trash2, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AdminNewsletter() {
  const { siteSettings, updateSiteSettings } = useAppContext();
  const [subscribers, setSubscribers] = useState<{ id: string, email: string, createdAt: string }[]>([]);
  const [localSettings, setLocalSettings] = useState(siteSettings);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'subscribers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      })) as { id: string, email: string, createdAt: string }[];
      setSubscribers(fetched);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      await deleteDoc(doc(db, 'subscribers', id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(localSettings);
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Newsletter Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage subscribers and automation emails.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Settings Form */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Automation & Display</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Newsletter Title</label>
              <input type="text" value={localSettings.newsletterTitle} onChange={e => setLocalSettings({...localSettings, newsletterTitle: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <input type="text" value={localSettings.newsletterDescription} onChange={e => setLocalSettings({...localSettings, newsletterDescription: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Button Text</label>
              <input type="text" value={localSettings.newsletterButtonText} onChange={e => setLocalSettings({...localSettings, newsletterButtonText: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Success Message (UI)</label>
              <input type="text" value={localSettings.newsletterSuccessMsg} onChange={e => setLocalSettings({...localSettings, newsletterSuccessMsg: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Email Automation</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">This message will be automatically sent to new subscribers.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Body Text</label>
                  <textarea value={localSettings.newsletterAutomationText} onChange={e => setLocalSettings({...localSettings, newsletterAutomationText: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none h-32" placeholder="Thank you for subscribing..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">PDF/Resource Link (Optional)</label>
                  <input type="url" value={localSettings.newsletterAutomationPdfUrl} onChange={e => setLocalSettings({...localSettings, newsletterAutomationPdfUrl: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://example.com/guide.pdf" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">{saveMessage}</span>
              <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Settings</button>
            </div>
          </form>
        </div>

        {/* Subscribers List */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Subscribers ({subscribers.length})</h2>
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              {subscribers.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">No subscribers yet.</p>
              ) : (
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                  {subscribers.map((sub) => (
                    <li key={sub.id} className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{sub.email}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => handleDelete(sub.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
