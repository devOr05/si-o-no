import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import type { ActiveTab } from './components/Navigation';
import { CongressTab } from './components/CongressTab';
import { NewsTab } from './components/NewsTab';
import { CommunityTab } from './components/CommunityTab';
import { VerificationModal } from './components/VerificationModal';
import { INITIAL_BILLS, INITIAL_NEWS, INITIAL_COMMUNITY_POLLS } from './data/mockData';
import type { LawBill, NewsArticle, CommunityPoll, UserVerificationState } from './types';
import { networkService } from './services/networkService';
import { scraperService } from './services/scraperService';
import { Download } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('congress');
  
  // Data State with LocalStorage Persistence
  const [bills, setBills] = useState<LawBill[]>(() => {
    const saved = localStorage.getItem('siono_bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem('siono_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [communityPolls, setCommunityPolls] = useState<CommunityPoll[]>(() => {
    const saved = localStorage.getItem('siono_polls');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POLLS;
  });

  const [userState, setUserState] = useState<UserVerificationState>(() => {
    const saved = localStorage.getItem('siono_user');
    return saved ? JSON.parse(saved) : {
      phone: '+54 9 223 512-3456',
      isPhoneVerified: true,
      isPasskeyActive: true,
      isCertified: false,
      certificationMethod: null,
      nullifierSeed: 'seed_zk_user_' + Math.random().toString(36).substring(7),
      voterBadgeId: 'ZK-CIVIC-' + Math.floor(1000 + Math.random() * 9000)
    };
  });

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [isRefreshingNews, setIsRefreshingNews] = useState(false);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('siono_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('siono_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('siono_polls', JSON.stringify(communityPolls));
  }, [communityPolls]);

  useEffect(() => {
    localStorage.setItem('siono_user', JSON.stringify(userState));
  }, [userState]);

  // PWA Install Event Listener
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPWA(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Sync with Decentralized Network (Nostr Relays)
  useEffect(() => {
    // 1. Fetch existing public polls from the network
    networkService.fetchNetworkPolls().then((networkPolls) => {
      if (networkPolls.length > 0) {
        setCommunityPolls((prev) => {
          const map = new Map<string, CommunityPoll>();
          // Remote network polls first
          networkPolls.forEach((p) => map.set(p.id, p));
          // Prepend local polls if they don't exist remotely yet
          prev.forEach((p) => {
            if (!map.has(p.id)) map.set(p.id, p);
          });
          return Array.from(map.values());
        });
      }
    });

    // 2. Real-time subscription to events from any user across the globe
    const unsubscribe = networkService.subscribeToRealtimeEvents(
      (newPoll) => {
        setCommunityPolls((prev) => {
          if (prev.some((p) => p.id === newPoll.id)) return prev;
          return [newPoll, ...prev];
        });
      },
      (pollId, choice) => {
        setCommunityPolls((prev) =>
          prev.map((poll) => {
            if (poll.id !== pollId) return poll;
            return {
              ...poll,
              votes: {
                yes: choice === 'yes' ? poll.votes.yes + 1 : poll.votes.yes,
                no: choice === 'no' ? poll.votes.no + 1 : poll.votes.no
              }
            };
          })
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // Live News Scraping Effect
  useEffect(() => {
    scraperService.fetchLiveNews().then((liveNews) => {
      if (liveNews.length > 0) {
        setNews((prev) => {
          const map = new Map<string, NewsArticle>();
          // Live scraped news first
          liveNews.forEach((n) => map.set(n.title, n));
          // Prepend existing local news
          prev.forEach((n) => {
            if (!map.has(n.title)) map.set(n.title, n);
          });
          return Array.from(map.values());
        });
      }
    });
  }, []);

  const handleRefreshNews = async () => {
    setIsRefreshingNews(true);
    try {
      const liveNews = await scraperService.fetchLiveNews();
      if (liveNews.length > 0) {
        setNews((prev) => {
          const map = new Map<string, NewsArticle>();
          liveNews.forEach((n) => map.set(n.title, n));
          prev.forEach((n) => {
            if (!map.has(n.title)) map.set(n.title, n);
          });
          return Array.from(map.values());
        });
      }
    } finally {
      setIsRefreshingNews(false);
    }
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setCanInstallPWA(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('Para instalar la PWA en tu dispositivo móvil:\n- En iPhone: Pulsa "Compartir" y luego "Agregar a pantalla de inicio".\n- En Android: Abre el menú de 3 puntos y elige "Instalar app".');
    }
  };

  // Voting Handlers
  const handleVoteBill = (billId: string, choice: 'yes' | 'no') => {
    setBills((prevBills) =>
      prevBills.map((bill) => {
        if (bill.id !== billId) return bill;

        const previousVote = bill.userVoted;
        let newCommYes = bill.votesCommunity.yes;
        let newCommNo = bill.votesCommunity.no;
        let newCertYes = bill.votesCertified.yes;
        let newCertNo = bill.votesCertified.no;

        // If previously voted, undo that vote
        if (previousVote === 'yes') {
          newCommYes--;
          if (userState.isCertified) newCertYes--;
        } else if (previousVote === 'no') {
          newCommNo--;
          if (userState.isCertified) newCertNo--;
        }

        // Apply new vote
        if (choice === 'yes') {
          newCommYes++;
          if (userState.isCertified) newCertYes++;
        } else {
          newCommNo++;
          if (userState.isCertified) newCertNo++;
        }

        return {
          ...bill,
          userVoted: choice,
          votesCommunity: { yes: newCommYes, no: newCommNo },
          votesCertified: { yes: newCertYes, no: newCertNo },
          nullifierHash: '0x' + Math.random().toString(16).substring(2, 10) + '...'
        };
      })
    );
  };

  const handleToggleLikeNews = (articleId: string) => {
    setNews((prevNews) =>
      prevNews.map((article) => {
        if (article.id !== articleId) return article;
        const wasLiked = article.userLiked || false;
        return {
          ...article,
          userLiked: !wasLiked,
          likes: wasLiked ? article.likes - 1 : article.likes + 1
        };
      })
    );
  };

  const handleVoteCommunityPoll = (pollId: string, choice: 'yes' | 'no') => {
    // Broadcast vote to decentralized network relays
    networkService.publishVote(pollId, choice, userState.isCertified);

    setCommunityPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        const prevVote = poll.userVoted;
        let newYes = poll.votes.yes;
        let newNo = poll.votes.no;

        if (prevVote === 'yes') newYes--;
        if (prevVote === 'no') newNo--;

        if (choice === 'yes') newYes++;
        else newNo++;

        return {
          ...poll,
          userVoted: choice,
          votes: { yes: newYes, no: newNo }
        };
      })
    );
  };

  const handleCreateCommunityPoll = (
    newPollData: Omit<CommunityPoll, 'id' | 'votes' | 'userVoted' | 'commentsCount' | 'timeAgo'>
  ) => {
    const pollId = 'poll-' + Date.now();
    const newPoll: CommunityPoll = {
      ...newPollData,
      id: pollId,
      votes: { yes: 1, no: 0 },
      userVoted: 'yes',
      commentsCount: 0,
      timeAgo: 'Recién publicado'
    };

    // Broadcast poll to decentralized network relays (Nostr)
    networkService.publishPoll({
      id: pollId,
      author: newPoll.author,
      isAuthorVerified: newPoll.isAuthorVerified,
      category: newPoll.category,
      question: newPoll.question,
      context: newPoll.context
    });

    setCommunityPolls((prev) => [newPoll, ...prev]);
  };

  const handleCompleteVerification = (method: 'World ID' | 'DNI + Selfie' | 'DNI NFC') => {
    setUserState((prev) => ({
      ...prev,
      isCertified: true,
      certificationMethod: method
    }));
  };

  const handleResetVerification = () => {
    setUserState((prev) => ({
      ...prev,
      isCertified: false,
      certificationMethod: null
    }));
  };

  const pendingBillsCount = bills.filter((b) => !b.userVoted).length;
  const trendingPollsCount = communityPolls.filter((p) => p.isTrending).length;

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col pb-20 sm:pb-8 selection:bg-brand-accent/20 selection:text-brand-accent">
      
      {/* Top Header */}
      <Header
        userState={userState}
        onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
        canInstallPWA={canInstallPWA}
        onInstallPWA={handleInstallPWA}
      />

      {/* 3 Main Tabs Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingBillsCount={pendingBillsCount}
        trendingPollsCount={trendingPollsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'congress' && (
          <CongressTab
            bills={bills}
            userState={userState}
            onVote={handleVoteBill}
            onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
          />
        )}

        {activeTab === 'news' && (
          <NewsTab
            news={news}
            onToggleLike={handleToggleLikeNews}
            onRefreshNews={handleRefreshNews}
            isRefreshing={isRefreshingNews}
          />
        )}

        {activeTab === 'community' && (
          <CommunityTab
            polls={communityPolls}
            userState={userState}
            onVotePoll={handleVoteCommunityPoll}
            onCreatePoll={handleCreateCommunityPoll}
          />
        )}
      </main>

      {/* Mobile Floating PWA Install Bar */}
      {canInstallPWA && (
        <div className="fixed bottom-16 sm:bottom-4 left-4 right-4 max-w-md mx-auto z-30 animate-fadeIn">
          <div className="glass-panel rounded-2xl p-3 border border-sky-500/40 shadow-2xl flex items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-sky-950/60 to-slate-900">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent font-black text-xs">
                S/N
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Instalar app en tu pantalla</div>
                <div className="text-[10px] text-slate-400">Vota sin internet y recibe alertas</div>
              </div>
            </div>
            <button
              onClick={handleInstallPWA}
              className="px-3 py-1.5 rounded-xl bg-brand-accent hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
          </div>
        </div>
      )}

      {/* Identity Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        userState={userState}
        onCompleteVerification={handleCompleteVerification}
        onResetVerification={handleResetVerification}
      />

      {/* Footer info */}
      <footer className="mt-8 pt-6 border-t border-slate-900/80 text-center text-[10px] font-mono text-slate-500 px-4">
        <p>© 2026 ¿SÍ O NO? — Plataforma Cívica y Social Desarrollada por Taller IT.</p>
        <p className="mt-1">
          Datos de proyectos extraídos de <code className="text-slate-400">datos.hcdn.gob.ar</code> y <code className="text-slate-400">senado.gob.ar</code>.
        </p>
      </footer>

    </div>
  );
}

export default App;
