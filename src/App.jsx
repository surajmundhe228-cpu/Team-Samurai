import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import RoleSelection from './components/RoleSelection';
import CitizenDashboard from './components/CitizenDashboard';
import AuthorityDashboard from './components/AuthorityDashboard';
import OfflineScreen from './components/OfflineScreen';
import AuthorityLogin from './components/AuthorityLogin';
import CitizenSettingsScreen from './components/CitizenSettingsScreen';
import CitizenAuth from './components/CitizenAuth';
import MapScreen from './components/MapScreen';
import InfoExchangeScreen from './components/InfoExchangeScreen';
import DonationScreen from './components/DonationScreen';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [pendingDestination, setPendingDestination] = useState(null);

  // Authority session persistence
  const [currentAuthority, setCurrentAuthority] = useState(() => {
    try {
      const saved = localStorage.getItem('reloc8_authority_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Citizen session persistence
  const [currentCitizen, setCurrentCitizen] = useState(() => {
    try {
      const saved = localStorage.getItem('reloc8_citizen_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const navigate = (page) => setCurrentPage(page);

  // Protected navigation: prompts CitizenAuth if unauthenticated, keeps offline public
  const handleProtectedNavigate = (targetPage) => {
    const publicPages = ['citizenDashboard', 'welcome', 'roleSelection', 'settings', 'offlineScreen'];

    if (!currentCitizen && !publicPages.includes(targetPage)) {
      setPendingDestination(targetPage);
      setCurrentPage('citizenAuth');
      return;
    }

    setCurrentPage(targetPage);
  };

  const handleRoleSelect = (role) => {
    if (role === 'citizen') {
      navigate('citizenDashboard');
    } else if (role === 'authority') {
      if (currentAuthority) {
        navigate('authorityDashboard');
      } else {
        navigate('authorityLogin');
      }
    }
  };

  // Authority handlers
  const handleAuthorityLoginSuccess = (user) => {
    setCurrentAuthority(user);
    navigate('authorityDashboard');
  };

  const handleAuthorityLogout = () => {
    localStorage.removeItem('reloc8_authority_session');
    setCurrentAuthority(null);
    alert('Authority logged out successfully.');
    navigate('roleSelection');
  };

  // Citizen handlers
  const handleCitizenLoginSuccess = (citizen) => {
    setCurrentCitizen(citizen);
    if (pendingDestination) {
      const target = pendingDestination;
      setPendingDestination(null);
      navigate(target);
    } else {
      navigate('citizenDashboard');
    }
  };

  const handleCitizenLogout = () => {
    localStorage.removeItem('reloc8_citizen_session');
    setCurrentCitizen(null);
    alert('Citizen logged out successfully.');
    navigate('citizenDashboard');
  };

  return (
    <div>
      {/* 1. Welcome Page */}
      {currentPage === 'welcome' && (
        <WelcomePage 
          onLogin={() => navigate('roleSelection')} 
          onContinueOffline={() => navigate('offlineScreen')} 
        />
      )}

      {/* 2. Role Selection */}
      {currentPage === 'roleSelection' && (
        <RoleSelection 
          onSelectRole={handleRoleSelect} 
          onBack={() => navigate('welcome')} 
        />
      )}

      {/* 3. Authority Login */}
      {currentPage === 'authorityLogin' && (
        <AuthorityLogin 
          onBack={() => navigate('roleSelection')}
          onLoginSuccess={handleAuthorityLoginSuccess}
        />
      )}

      {/* 4. Authority Dashboard */}
      {currentPage === 'authorityDashboard' && (
        <AuthorityDashboard 
          user={currentAuthority} 
          onBack={() => navigate('roleSelection')} 
          onLogout={handleAuthorityLogout}
        />
      )}

      {/* 5. Citizen Dashboard with Protected Gate */}
      {currentPage === 'citizenDashboard' && (
        <CitizenDashboard 
          citizenUser={currentCitizen}
          onBack={() => navigate('roleSelection')} 
          onNavigate={handleProtectedNavigate}
        />
      )}

      {/* 6. Interactive Risk Map */}
      {currentPage === 'map' && (
        <MapScreen 
          onBack={() => navigate('citizenDashboard')} 
        />
      )}

      {/* 7. Information Exchange Screen */}
      {currentPage === 'infoExchange' && (
        <InfoExchangeScreen 
          citizenUser={currentCitizen}
          onBack={() => navigate('citizenDashboard')} 
          onNavigate={handleProtectedNavigate}
        />
      )}

      {/* 8. Donation Screen */}
      {currentPage === 'donation' && (
        <DonationScreen 
          citizenUser={currentCitizen}
          onBack={() => navigate('citizenDashboard')} 
          onNavigate={handleProtectedNavigate}
        />
      )}

      {/* 9. Citizen Settings Screen */}
      {currentPage === 'settings' && (
        <CitizenSettingsScreen 
          citizenUser={currentCitizen}
          onBack={() => navigate('citizenDashboard')}
          onOpenAuth={() => navigate('citizenAuth')}
          onLogout={handleCitizenLogout}
          onNavigate={handleProtectedNavigate}
        />
      )}

      {/* 10. Citizen Registration & Sign-In */}
      {currentPage === 'citizenAuth' && (
        <CitizenAuth 
          onBack={() => {
            setPendingDestination(null);
            navigate('citizenDashboard');
          }}
          onLoginSuccess={handleCitizenLoginSuccess}
        />
      )}

      {/* 11. Offline Center (Publicly accessible) */}
      {currentPage === 'offlineScreen' && (
        <OfflineScreen 
          onBack={() => navigate('citizenDashboard')} 
          onNavigate={handleProtectedNavigate}
        />
      )}
    </div>
  );
}