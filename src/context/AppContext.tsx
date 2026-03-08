import React, { createContext, useContext, useState, useEffect } from 'react';
import { AITool, AdSettings, SiteSettings } from '../types';
import { initialTools, initialAdSettings, initialSiteSettings } from '../data/mockData';
import { db } from '../lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, onSnapshot, increment, updateDoc, serverTimestamp } from 'firebase/firestore';

interface AppContextType {
  tools: AITool[];
  adSettings: AdSettings;
  siteSettings: SiteSettings;
  isDarkMode: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  toggleDarkMode: () => void;
  loginAdmin: (email: string, phone: string) => Promise<boolean>;
  logoutAdmin: () => void;
  addTool: (tool: AITool) => Promise<void>;
  updateTool: (tool: AITool) => Promise<void>;
  deleteTool: (id: string) => Promise<void>;
  updateAdSettings: (settings: AdSettings) => Promise<void>;
  updateSiteSettings: (settings: SiteSettings) => Promise<void>;
  trackToolView: (toolId: string) => Promise<void>;
  trackCTAClick: (toolId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tools, setTools] = useState<AITool[]>([]);
  const [adSettings, setAdSettings] = useState<AdSettings>(initialAdSettings);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedAdmin = localStorage.getItem('ai_admin');

    if (storedAdmin === 'true') setIsAdmin(true);
    
    if (storedTheme === 'dark' || !storedTheme) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Firebase Realtime Listeners
    const unsubscribeTools = onSnapshot(collection(db, 'tools'), (snapshot) => {
      if (snapshot.empty) {
        // Initialize with mock data if empty
        initialTools.forEach(tool => setDoc(doc(db, 'tools', tool.id), tool));
        setTools(initialTools);
      } else {
        const fetchedTools = snapshot.docs.map(doc => doc.data() as AITool);
        setTools(fetchedTools);
      }
    }, (error) => {
      console.error("Error fetching tools:", error);
      // Fallback to local storage if Firebase fails
      const storedTools = localStorage.getItem('ai_tools');
      if (storedTools) setTools(JSON.parse(storedTools));
      else setTools(initialTools);
    });

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.adSettings) setAdSettings(data.adSettings);
        if (data.siteSettings) setSiteSettings(data.siteSettings);
      } else {
        // Initialize settings
        setDoc(doc(db, 'settings', 'global'), {
          adSettings: initialAdSettings,
          siteSettings: initialSiteSettings
        });
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      // Fallback
      const storedAds = localStorage.getItem('ai_ads');
      const storedSite = localStorage.getItem('ai_site');
      if (storedAds) setAdSettings({ ...initialAdSettings, ...JSON.parse(storedAds) });
      if (storedSite) setSiteSettings({ ...initialSiteSettings, ...JSON.parse(storedSite) });
      setIsLoading(false);
    });

    return () => {
      unsubscribeTools();
      unsubscribeSettings();
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const loginAdmin = async (email: string, phone: string) => {
    try {
      const credsDoc = await getDoc(doc(db, 'settings', 'admin_credentials'));
      if (credsDoc.exists()) {
        const data = credsDoc.data();
        if (data.email === email && data.phone === phone) {
          setIsAdmin(true);
          localStorage.setItem('ai_admin', 'true');
          return true;
        }
        return false;
      } else {
        // First time login, save credentials
        await setDoc(doc(db, 'settings', 'admin_credentials'), {
          email,
          phone
        });
        setIsAdmin(true);
        localStorage.setItem('ai_admin', 'true');
        return true;
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Fallback to local storage if Firebase fails
      const storedCreds = localStorage.getItem('admin_creds');
      if (storedCreds) {
        const creds = JSON.parse(storedCreds);
        if (creds.email === email && creds.phone === phone) {
          setIsAdmin(true);
          localStorage.setItem('ai_admin', 'true');
          return true;
        }
        return false;
      } else {
        localStorage.setItem('admin_creds', JSON.stringify({ email, phone }));
        setIsAdmin(true);
        localStorage.setItem('ai_admin', 'true');
        return true;
      }
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('ai_admin');
  };

  const addTool = async (tool: AITool) => {
    try {
      await setDoc(doc(db, 'tools', tool.id), tool);
    } catch (error) {
      console.error("Error adding tool:", error);
      // Fallback
      const newTools = [...tools, tool];
      setTools(newTools);
      localStorage.setItem('ai_tools', JSON.stringify(newTools));
    }
  };

  const updateTool = async (updatedTool: AITool) => {
    try {
      await setDoc(doc(db, 'tools', updatedTool.id), updatedTool);
    } catch (error) {
      console.error("Error updating tool:", error);
      const newTools = tools.map(t => t.id === updatedTool.id ? updatedTool : t);
      setTools(newTools);
      localStorage.setItem('ai_tools', JSON.stringify(newTools));
    }
  };

  const deleteTool = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tools', id));
    } catch (error) {
      console.error("Error deleting tool:", error);
      const newTools = tools.filter(t => t.id !== id);
      setTools(newTools);
      localStorage.setItem('ai_tools', JSON.stringify(newTools));
    }
  };

  const updateAdSettings = async (settings: AdSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), { adSettings: settings }, { merge: true });
    } catch (error) {
      console.error("Error updating ad settings:", error);
      setAdSettings(settings);
      localStorage.setItem('ai_ads', JSON.stringify(settings));
    }
  };

  const updateSiteSettings = async (settings: SiteSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), { siteSettings: settings }, { merge: true });
    } catch (error) {
      console.error("Error updating site settings:", error);
      setSiteSettings(settings);
      localStorage.setItem('ai_site', JSON.stringify(settings));
    }
  };

  const trackToolView = async (toolId: string) => {
    if (isAdmin) return; // Don't track admin views
    try {
      const statsRef = doc(db, 'stats', toolId);
      const statsDoc = await getDoc(statsRef);
      if (!statsDoc.exists()) {
        await setDoc(statsRef, { views: 1, clicks: 0, lastUpdated: serverTimestamp() });
      } else {
        await updateDoc(statsRef, { views: increment(1), lastUpdated: serverTimestamp() });
      }
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  const trackCTAClick = async (toolId: string) => {
    try {
      const statsRef = doc(db, 'stats', toolId);
      const statsDoc = await getDoc(statsRef);
      if (!statsDoc.exists()) {
        await setDoc(statsRef, { views: 0, clicks: 1, lastUpdated: serverTimestamp() });
      } else {
        await updateDoc(statsRef, { clicks: increment(1), lastUpdated: serverTimestamp() });
      }
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  return (
    <AppContext.Provider value={{
      tools, adSettings, siteSettings, isDarkMode, isAdmin, isLoading,
      toggleDarkMode, loginAdmin, logoutAdmin,
      addTool, updateTool, deleteTool, updateAdSettings, updateSiteSettings,
      trackToolView, trackCTAClick
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
