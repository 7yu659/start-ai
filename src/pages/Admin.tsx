import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings, LayoutDashboard, FileText, DollarSign, Save, Plus, Edit2, Trash2, LogIn, X, MessageSquare, Mail, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { AITool, AdSettings, Comment } from '../types';
import AdminComments from '../components/AdminComments';
import AdminNewsletter from '../components/AdminNewsletter';
import AdminAnalytics from '../components/AdminAnalytics';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Admin() {
  const { tools, adSettings, siteSettings, isAdmin, loginAdmin, logoutAdmin, addTool, updateTool, deleteTool, updateAdSettings, updateSiteSettings } = useAppContext();
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('tools');
  const [localAdSettings, setLocalAdSettings] = useState(adSettings);
  const [localSiteSettings, setLocalSiteSettings] = useState(siteSettings);
  const [saveMessage, setSaveMessage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<string | null>(null);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [unreadComments, setUnreadComments] = useState(0);

  const contentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isAdmin) return;
    
    const q = query(collection(db, 'comments'), where('isRead', '==', false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadComments(snapshot.size);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const [formData, setFormData] = useState<Partial<AITool>>({
    name: '', slug: '', tagline: '', category: '', imageUrl: '', pricing: '', websiteUrl: '',
    description: '', content: '', dateAdded: new Date().toISOString().split('T')[0],
    homeSection: 'latest', ctaText: '', ctaLink: '', ctaPosition: 'none',
    pros: [], cons: [], features: [],
    rating: { overall: 5, easeOfUse: 5, features: 5, valueForMoney: 5, performance: 5 }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(email, phone);
    if (!success) {
      setLoginError('Invalid email or password.');
    }
  };

  const handleAdSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdSettings(localAdSettings);
    showSaveMsg();
  };

  const handleSiteSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(localSiteSettings);
    showSaveMsg();
  };

  const showSaveMsg = () => {
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const openAddModal = () => {
    setEditingTool(null);
    setFormData({
      name: '', slug: '', tagline: '', category: '', imageUrl: '', pricing: '', websiteUrl: '',
      description: '', content: '', dateAdded: new Date().toISOString().split('T')[0],
      homeSection: 'latest', ctaText: '', ctaLink: '', ctaPosition: 'none',
      pros: [], cons: [], features: [],
      rating: { overall: 5, easeOfUse: 5, features: 5, valueForMoney: 5, performance: 5 }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tool: AITool) => {
    setEditingTool(tool);
    setFormData(tool);
    setIsModalOpen(true);
  };

  const [isUploading, setIsUploading] = useState(false);
  const [isContentUploading, setIsContentUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Assuming 'ml_default' is an unsigned preset

    const response = await fetch('https://api.cloudinary.com/v1_1/dggkvls21/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    
    if (data.secure_url) {
      // Ensure the URL is in the requested format
      return data.secure_url;
    } else if (data.url) {
      return data.url.replace('http://', 'https://');
    } else {
      console.error('Cloudinary response error:', data);
      throw new Error(data.error?.message || 'Upload failed');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please check Cloudinary settings.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsContentUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      const caption = window.prompt('Enter image caption (optional):', '');
      const imageMarkdown = caption 
        ? `\n\n<div class="blog-image-container">\n  ![${caption}](${url})\n  <p class="image-caption">${caption}</p>\n</div>\n\n`
        : `\n\n<div class="blog-image-container">\n  ![Image](${url})\n</div>\n\n`;
      
      const textarea = contentTextAreaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content || '';
        const before = text.substring(0, start);
        const after = text.substring(end);
        setFormData(prev => ({ ...prev, content: before + imageMarkdown + after }));
      } else {
        setFormData(prev => ({ ...prev, content: (prev.content || '') + imageMarkdown }));
      }
    } catch (error) {
      console.error('Error uploading content image:', error);
      alert('Error uploading image. Please check Cloudinary settings.');
    } finally {
      setIsContentUploading(false);
    }
  };

  const insertLink = () => {
    const url = window.prompt('Enter URL:', 'https://');
    if (!url) return;
    const text = window.prompt('Enter link text:', 'Click here');
    if (!text) return;
    
    const linkMarkdown = `[${text}](${url})`;
    const textarea = contentTextAreaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = formData.content || '';
      const before = content.substring(0, start);
      const after = content.substring(end);
      setFormData(prev => ({ ...prev, content: before + linkMarkdown + after }));
    } else {
      setFormData(prev => ({ ...prev, content: (prev.content || '') + linkMarkdown }));
    }
  };

  const getWordCount = (text: string = '') => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const handleToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTool) {
      updateTool({ ...editingTool, ...formData } as AITool);
    } else {
      addTool({ ...formData, id: Date.now().toString() } as AITool);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (id: string) => {
    setToolToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (toolToDelete) {
      deleteTool(toolToDelete);
      setIsDeleteModalOpen(false);
      setToolToDelete(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <div className="glass-card p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4">
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Login</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Enter your credentials to access the dashboard.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="admin@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input type="password" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
            </div>
            {loginError && <p className="text-rose-500 text-sm">{loginError}</p>}
            <button type="submit" className="btn-primary w-full mt-6">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shrink-0 md:sticky md:top-0 md:h-screen overflow-hidden flex flex-col">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" /> Admin
          </h2>
          <button onClick={() => setIsLogoutModalOpen(true)} className="md:hidden text-sm text-rose-500">Logout</button>
        </div>
        <nav className="px-4 space-y-2 pb-6 flex md:flex-col overflow-x-auto md:overflow-y-auto flex-1 scrollbar-hide">
          <button onClick={() => setActiveTab('tools')} className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'tools' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}>
            <FileText className="w-4 h-4" /> Manage Tools
          </button>
          <button onClick={() => setActiveTab('categories')} className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}>
            <LayoutDashboard className="w-4 h-4" /> Categories
          </button>
          <button onClick={() => setActiveTab('comments')} className={`shrink-0 w-auto md:w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'comments' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4" /> Comments
            </div>
            {unreadComments > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {unreadComments}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab('newsletter')} className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'newsletter' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}>
            <Mail className="w-4 h-4" /> Newsletter
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}>
            <LayoutDashboard className="w-4 h-4" /> Analytics
          </button>
          <button onClick={() => setActiveTab('ads')} className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'ads' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}>
            <DollarSign className="w-4 h-4" /> AdSense
          </button>
          <button onClick={() => setActiveTab('settings')} className={`shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'}`}>
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button onClick={() => setIsLogoutModalOpen(true)} className="hidden md:flex shrink-0 w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 transition-colors mt-auto mb-4">
            <LogIn className="w-4 h-4 rotate-180" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'tools' && (
            <div className="glass-card p-6 md:p-8">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage AI Tools</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Add, edit, or remove tool reviews.</p>
                </div>
                <button onClick={openAddModal} className="btn-primary text-sm px-4 py-2"><Plus className="w-4 h-4" /> Add New</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400">
                      <th className="pb-3 px-4">Tool Name</th>
                      <th className="pb-3 px-4">Category</th>
                      <th className="pb-3 px-4">Section</th>
                      <th className="pb-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tools.map(tool => (
                      <tr key={tool.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                          <img src={tool.imageUrl} alt="" className="w-8 h-8 rounded-md object-cover" referrerPolicy="no-referrer" />
                          {tool.name}
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{tool.category}</td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400 capitalize">{tool.homeSection}</td>
                        <td className="py-4 px-4 text-right">
                          <button onClick={() => openEditModal(tool)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm mr-4"><Edit2 className="w-4 h-4 inline" /></button>
                          <button onClick={() => confirmDelete(tool.id)} className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 font-medium text-sm"><Trash2 className="w-4 h-4 inline" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Categories & Menus</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Configure header and footer category menus for better SEO.</p>
                </div>
              </div>
              <form onSubmit={handleSiteSave} className="space-y-8">
                <div className="space-y-6">
                  {(localSiteSettings.categoryGroups || []).map((group, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex justify-between items-center mb-4">
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) => {
                            const newGroups = [...(localSiteSettings.categoryGroups || [])];
                            newGroups[idx].name = e.target.value;
                            setLocalSiteSettings({ ...localSiteSettings, categoryGroups: newGroups });
                          }}
                          className="font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none px-1 py-1"
                          placeholder="Group Name (e.g. Solutions)"
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            const newGroups = (localSiteSettings.categoryGroups || []).filter((_, i) => i !== idx);
                            setLocalSiteSettings({ ...localSiteSettings, categoryGroups: newGroups });
                          }}
                          className="text-rose-500 hover:text-rose-700 text-sm"
                        >
                          Remove Group
                        </button>
                      </div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Categories in this group (Comma separated)</label>
                      <input
                        type="text"
                        value={group.categories.join(', ')}
                        onChange={(e) => {
                          const newGroups = [...(localSiteSettings.categoryGroups || [])];
                          newGroups[idx].categories = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setLocalSiteSettings({ ...localSiteSettings, categoryGroups: newGroups });
                        }}
                        className="w-full px-3 py-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="e.g. Chatbots, Writing"
                      />
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => {
                      const newGroups = [...(localSiteSettings.categoryGroups || []), { name: 'New Group', categories: [] }];
                      setLocalSiteSettings({ ...localSiteSettings, categoryGroups: newGroups });
                    }}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Menu Group
                  </button>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">{saveMessage}</span>
                  <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Categories</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'comments' && <AdminComments />}

          {activeTab === 'newsletter' && <AdminNewsletter />}

          {activeTab === 'analytics' && <AdminAnalytics />}

          {activeTab === 'ads' && (
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AdSense Placement</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Paste your Google AdSense code snippets below.</p>
                </div>
              </div>
              <form onSubmit={handleAdSave} className="space-y-6">
                {Object.keys(localAdSettings).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <textarea
                      value={localAdSettings[key as keyof AdSettings]}
                      onChange={(e) => setLocalAdSettings({...localAdSettings, [key]: e.target.value})}
                      className="w-full h-24 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="<!-- Paste AdSense code here -->"
                    />
                  </div>
                ))}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">{saveMessage}</span>
                  <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Ads</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Site Settings</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Manage footer and newsletter content.</p>
                </div>
              </div>
              <form onSubmit={handleSiteSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Logo Text</label>
                    <input type="text" value={localSiteSettings.logoText} onChange={e => setLocalSiteSettings({...localSiteSettings, logoText: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Slogan</label>
                    <input type="text" value={localSiteSettings.slogan} onChange={e => setLocalSiteSettings({...localSiteSettings, slogan: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Posts Per Section (Home Page)</label>
                    <input type="number" min="1" max="20" value={localSiteSettings.postsPerSection} onChange={e => setLocalSiteSettings({...localSiteSettings, postsPerSection: parseInt(e.target.value) || 5})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Footer Categories (Comma separated)</label>
                    <input type="text" value={localSiteSettings.footerCategories?.join(', ') || ''} onChange={e => setLocalSiteSettings({...localSiteSettings, footerCategories: e.target.value.split(',').map(s => s.trim())})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Header Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Header Title</label>
                      <input type="text" value={localSiteSettings.headerTitle || ''} onChange={e => setLocalSiteSettings({...localSiteSettings, headerTitle: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Header Subtitle</label>
                      <input type="text" value={localSiteSettings.headerSubtitle || ''} onChange={e => setLocalSiteSettings({...localSiteSettings, headerSubtitle: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Header Description</label>
                      <textarea value={localSiteSettings.headerDescription || ''} onChange={e => setLocalSiteSettings({...localSiteSettings, headerDescription: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none h-24" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Header Image URL (Optional)</label>
                      <input type="url" value={localSiteSettings.headerImageUrl || ''} onChange={e => setLocalSiteSettings({...localSiteSettings, headerImageUrl: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://example.com/image.jpg" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Pre-Footer Features</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Feature 1 Title</label>
                        <input type="text" value={localSiteSettings.preFooterTitle1 || ''} onChange={e => setLocalSiteSettings({...localSiteSettings, preFooterTitle1: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Feature 1 Description</label>
                        <input type="text" value={localSiteSettings.preFooterDesc1 || ''} onChange={e => setLocalSiteSettings({...localSiteSettings, preFooterDesc1: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Feature 2 Title</label>
                        <input type="text" value={localSiteSettings.preFooterTitle2 || ''} onChange={e => setLocalSiteSettings({...localSiteSettings, preFooterTitle2: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Feature 2 Description</label>
                        <input type="text" value={localSiteSettings.preFooterDesc2 || ''} onChange={e => setLocalSiteSettings({...localSiteSettings, preFooterDesc2: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Feature 3 Title</label>
                        <input type="text" value={localSiteSettings.preFooterTitle3 || ''} onChange={e => setLocalSiteSettings({...localSiteSettings, preFooterTitle3: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Feature 3 Description</label>
                        <input type="text" value={localSiteSettings.preFooterDesc3 || ''} onChange={e => setLocalSiteSettings({...localSiteSettings, preFooterDesc3: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Static Pages (Markdown)</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Privacy Policy</label>
                      <textarea value={localSiteSettings.privacyPolicy} onChange={e => setLocalSiteSettings({...localSiteSettings, privacyPolicy: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none h-32 font-mono text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Terms of Service</label>
                      <textarea value={localSiteSettings.termsOfService} onChange={e => setLocalSiteSettings({...localSiteSettings, termsOfService: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none h-32 font-mono text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">About Us</label>
                      <textarea value={localSiteSettings.aboutUs} onChange={e => setLocalSiteSettings({...localSiteSettings, aboutUs: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none h-32 font-mono text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Us</label>
                      <textarea value={localSiteSettings.contactUs} onChange={e => setLocalSiteSettings({...localSiteSettings, contactUs: e.target.value})} className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none h-32 font-mono text-sm" />
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">{saveMessage}</span>
                  <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Save Settings</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 h-fit">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{editingTool ? 'Edit Tool' : 'Add New Tool'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleToolSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm mb-1">Name</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-')})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700" /></div>
                <div><label className="block text-sm mb-1">Slug</label><input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700" /></div>
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700">
                    <option value="">Select a category</option>
                    {Array.from(new Set((localSiteSettings.categoryGroups || []).flatMap(g => g.categories))).sort().map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Featured Image</label>
                  <div className="flex flex-col gap-2">
                    {formData.imageUrl && (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                    )}
                    <label className="cursor-pointer bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      {isUploading ? 'Uploading...' : (formData.imageUrl ? 'Change Image' : 'Upload Image')}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                  </div>
                </div>
                <div><label className="block text-sm mb-1">Pricing</label><input required type="text" value={formData.pricing} onChange={e => setFormData({...formData, pricing: e.target.value})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700" /></div>
                <div><label className="block text-sm mb-1">Website URL</label><input required type="text" value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700" /></div>
                <div>
                  <label className="block text-sm mb-1">Home Section</label>
                  <select value={formData.homeSection} onChange={e => setFormData({...formData, homeSection: e.target.value as any})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700">
                    <option value="latest">Latest</option>
                    <option value="popular">Popular</option>
                    <option value="new">New Blog</option>
                  </select>
                </div>
                <div><label className="block text-sm mb-1">Date Added</label><input required type="date" value={formData.dateAdded} onChange={e => setFormData({...formData, dateAdded: e.target.value})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700" /></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                <div><label className="block text-sm mb-1">CTA Text</label><input type="text" value={formData.ctaText} onChange={e => setFormData({...formData, ctaText: e.target.value})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700" placeholder="e.g. Try Now" /></div>
                <div><label className="block text-sm mb-1">CTA Link</label><input type="text" value={formData.ctaLink} onChange={e => setFormData({...formData, ctaLink: e.target.value})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700" /></div>
                <div>
                  <label className="block text-sm mb-1">CTA Position in Blog</label>
                  <select value={formData.ctaPosition} onChange={e => setFormData({...formData, ctaPosition: e.target.value as any})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700">
                    <option value="none">None</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              <div><label className="block text-sm mb-1">Tagline</label><input required type="text" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700" /></div>
              <div><label className="block text-sm mb-1">Short Description</label><textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700 h-20" /></div>
              
              <div>
                <div className="flex justify-between items-end mb-1">
                  <div className="flex items-center gap-4">
                    <label className="block text-sm">Full Content (Markdown)</label>
                    <button type="button" onClick={insertLink} className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" /> Add Link
                    </button>
                  </div>
                  <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" />
                    {isContentUploading ? 'Uploading...' : '+ Insert Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleContentImageUpload} disabled={isContentUploading} />
                  </label>
                </div>
                <div className="relative">
                  <textarea 
                    ref={contentTextAreaRef}
                    required 
                    value={formData.content} 
                    onChange={e => setFormData({...formData, content: e.target.value})} 
                    className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700 h-64 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                  <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono">
                    Words: {getWordCount(formData.content)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm mb-1">Pros (Comma separated)</label>
                  <div className="relative">
                    <textarea required value={formData.pros?.join(', ')} onChange={e => setFormData({...formData, pros: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700 h-20" />
                    <div className="absolute bottom-1 right-2 text-[10px] text-slate-400 font-mono">Count: {formData.pros?.length || 0}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Cons (Comma separated)</label>
                  <div className="relative">
                    <textarea required value={formData.cons?.join(', ')} onChange={e => setFormData({...formData, cons: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700 h-20" />
                    <div className="absolute bottom-1 right-2 text-[10px] text-slate-400 font-mono">Count: {formData.cons?.length || 0}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Features (Comma separated)</label>
                  <div className="relative">
                    <textarea required value={formData.features?.join(', ')} onChange={e => setFormData({...formData, features: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700 h-20" />
                    <div className="absolute bottom-1 right-2 text-[10px] text-slate-400 font-mono">Count: {formData.features?.length || 0}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="font-semibold mb-4">Ratings (1-5)</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['overall', 'easeOfUse', 'features', 'valueForMoney', 'performance'].map(key => (
                    <div key={key}>
                      <label className="block text-xs mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <input type="number" step="0.1" min="1" max="5" required value={formData.rating?.[key as keyof typeof formData.rating]} onChange={e => setFormData({...formData, rating: {...formData.rating!, [key]: parseFloat(e.target.value)}})} className="w-full px-3 py-2 rounded border dark:bg-slate-800 dark:border-slate-700" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
                <button type="submit" className="btn-primary">Save Tool</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Delete Tool?</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to delete this tool? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
              <button onClick={handleDelete} className="px-6 py-2 rounded-xl font-medium text-white bg-rose-600 hover:bg-rose-700">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4">
              <LogIn className="w-8 h-8 rotate-180" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Logout?</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to log out of the admin panel?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-6 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
              <button onClick={() => { logoutAdmin(); setIsLogoutModalOpen(false); }} className="px-6 py-2 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
