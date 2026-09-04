import { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import './AuthorityLogin.css'; // Reuses auth styling

export default function CitizenAuth({ onBack, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const validatePassword = (val) => {
    const strongPasswordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return strongPasswordRegex.test(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isSignUp && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('Password must be at least 8 characters with 1 number and 1 special char.');
      return;
    }

    const storedCitizens = JSON.parse(localStorage.getItem('reloc8_citizens') || '[]');

    if (isSignUp) {
      const userExists = storedCitizens.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
      if (userExists) {
        setErrorMessage('Email already registered! Please switch to Login.');
        return;
      }

      const newCitizen = {
        name: name.trim(),
        email: email.trim(),
        password,
      };

      storedCitizens.push(newCitizen);
      localStorage.setItem('reloc8_citizens', JSON.stringify(storedCitizens));
      localStorage.setItem('reloc8_citizen_session', JSON.stringify(newCitizen));

      setSuccessMessage('Registration successful! Redirecting...');
      setTimeout(() => onLoginSuccess(newCitizen), 700);

    } else {
      const existingUser = storedCitizens.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (!existingUser) {
        setErrorMessage('Citizen account not found. Please register first.');
        return;
      }

      if (existingUser.password !== password) {
        setErrorMessage('Incorrect password. Please try again.');
        return;
      }

      localStorage.setItem('reloc8_citizen_session', JSON.stringify(existingUser));
      onLoginSuccess(existingUser);
    }
  };

  return (
    <div className="mobile-frame">
      <div className="auth-container">
        <div className="auth-header">
          <button className="auth-back-btn" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={22} />
          </button>
        </div>

        <div className="auth-content">
          <div className="auth-brand">
            <div className="building-icon-box">
              <User size={36} color="#065f46" />
            </div>
            <h2>{isSignUp ? 'Citizen Registration' : 'Citizen Login'}</h2>
            <p>Access personalized disaster updates & safe routes</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errorMessage && (
              <div className="error-badge">
                <AlertCircle size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="success-badge">
                <ShieldCheck size={15} />
                <span>{successMessage}</span>
              </div>
            )}

            {isSignUp && (
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Samrudhi)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" className="login-btn">
              {isSignUp ? 'Create Citizen Account' : 'Sign In'}
            </button>
          </form>

          <div className="or-divider">
            <span>OR</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account yet? "}
            </span>
            <button 
              type="button" 
              className="toggle-mode-btn"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage('');
                setSuccessMessage('');
              }}
            >
              {isSignUp ? 'Sign In Here' : 'Register Here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}