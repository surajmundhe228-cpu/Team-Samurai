import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import RoleSelection from './components/RoleSelection';
import CitizenDashboard from './components/CitizenDashboard';
import AuthorityDashboard from './components/AuthorityDashboard';
import OfflineScreen from './components/OfflineScreen';
import AuthorityLogin from './components/AuthorityLogin';
import CitizenSettingsScreen from './components/CitizenSettingsScreen';
import CitizenAuth from './components/CitizenAuth';
import SheltersScreen from './components/SheltersScreen';
import MapScreen from './components/MapScreen';
import AnimalInfoScreen from './components/AnimalInfoScreen';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

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

  // Authority Handlers
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

  // Citizen Handlers
  const handleCitizenLoginSuccess = (citizen) => {
    setCurrentCitizen(citizen);
    navigate('citizenDashboard');
  };

  const handleCitizenLogout = () => {
    localStorage.removeItem('reloc8_citizen_session');
    setCurrentCitizen(null);
    alert('Citizen logged out successfully.');
    navigate('citizenDashboard');
  };

  return (
    <div>
      {/* 1. Welcome Screen */}
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

      {/* 5. Citizen Dashboard */}
      {currentPage === 'citizenDashboard' && (
        <CitizenDashboard 
          citizenUser={currentCitizen}
          onBack={() => navigate('roleSelection')} 
          onNavigate={navigate}
        />
      )}

      {/* 6. Interactive Risk Map Screen */}
      {currentPage === 'map' && (
        <MapScreen 
          onBack={() => navigate('citizenDashboard')} 
        />
      )}

      {/* 7. Safe Shelters Screen */}
      {currentPage === 'shelters' && (
        <SheltersScreen 
          onBack={() => navigate('citizenDashboard')} 
        />
      )}

      {/* 8. Livestock & Animal Distress Screen */}
      {currentPage === 'animalInfo' && (
        <AnimalInfoScreen 
          onBack={() => navigate('citizenDashboard')}
          onNavigateToMap={() => navigate('map')}
        />
      )}

      {/* 9. Citizen Settings & Profile Screen */}
      {currentPage === 'settings' && (
        <CitizenSettingsScreen 
          citizenUser={currentCitizen}
          onBack={() => navigate('citizenDashboard')}
          onOpenAuth={() => navigate('citizenAuth')}
          onLogout={handleCitizenLogout}
          onNavigate={navigate}
        />
      )}

      {/* 10. Citizen Registration & Sign-In */}
      {currentPage === 'citizenAuth' && (
        <CitizenAuth 
          onBack={() => navigate('settings')}
          onLoginSuccess={handleCitizenLoginSuccess}
        />
      )}

      {/* 11. Offline Mode Screen */}
      {currentPage === 'offlineScreen' && (
        <OfflineScreen 
          onBack={() => navigate('citizenDashboard')} 
          onNavigate={navigate}
        />
      )}
    </div>
  );
}