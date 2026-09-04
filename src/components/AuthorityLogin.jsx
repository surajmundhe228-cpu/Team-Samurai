import { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Eye, 
  EyeOff, 
  UploadCloud, 
  ShieldCheck, 
  FileCheck, 
  AlertCircle 
} from 'lucide-react';
import './AuthorityLogin.css';

export default function AuthorityLogin({ onBack, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Strict email format check
  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  // Strong password check (min 8 chars, 1 number, 1 special character)
  const validatePassword = (val) => {
    const strongPasswordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return strongPasswordRegex.test(val);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Only PDF, JPG, and PNG documents are allowed.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // 1. Email format validation
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid official email address.');
      return;
    }

    // 2. Strong password validation
    if (!validatePassword(password)) {
      setErrorMessage('Password must be at least 8 characters with 1 number and 1 special char.');
      return;
    }

    // Retrieve existing registered accounts from localStorage
    const storedAuthorities = JSON.parse(localStorage.getItem('reloc8_authorities') || '[]');

    if (isSignUp) {
      // 3. Document proof validation for registration
      if (!selectedFile) {
        setErrorMessage('Please upload your official ID / Aadhaar / PAN card proof.');
        return;
      }

      // 4. Check if email already exists
      const userExists = storedAuthorities.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
      if (userExists) {
        setErrorMessage('Email already exists! Please switch to Login.');
        return;
      }

      // Create and save new authority record
      const newAuthority = {
        email,
        password,
        documentName: selectedFile.name,
        verified: true,
      };

      storedAuthorities.push(newAuthority);
      localStorage.setItem('reloc8_authorities', JSON.stringify(storedAuthorities));
      localStorage.setItem('reloc8_authority_session', JSON.stringify(newAuthority));

      setSuccessMessage('Registration successful! Redirecting...');
      setTimeout(() => onLoginSuccess(newAuthority), 800);

    } else {
      // Login Check
      const existingUser = storedAuthorities.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (!existingUser) {
        setErrorMessage('Account not found. Please register your official identity first.');
        return;
      }

      if (existingUser.password !== password) {
        setErrorMessage('Invalid password. Please check and try again.');
        return;
      }

      // Save active session and log in
      localStorage.setItem('reloc8_authority_session', JSON.stringify(existingUser));
      onLoginSuccess(existingUser);
    }
  };

  return (
    <div className="mobile-frame">
      <div className="auth-container">
        
        {/* Top Header */}
        <div className="auth-header">
          <button className="auth-back-btn" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={22} />
          </button>
        </div>

        {/* Content Area */}
        <div className="auth-content">
          
          {/* Brand Header */}
          <div className="auth-brand">
            <div className="building-icon-box">
              <Building2 size={36} color="#d97706" />
            </div>
            <h2>Authority Login</h2>
            <p>Login with your official account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            
            {/* Error Message Alert */}
            {errorMessage && (
              <div className="error-badge">
                <AlertCircle size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="success-badge">
                <ShieldCheck size={15} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="form-group">
              <input
                type="email"
                placeholder="Email / Official ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
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

            {!isSignUp && (
              <div className="forgot-password">
                <span onClick={() => alert('Password reset link sent to your registered email.')}>
                  Forgot Password?
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="login-btn">
              {isSignUp ? 'Verify & Register' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="or-divider">
            <span>OR</span>
          </div>

          {/* Document Verification Section */}
          <div className="verification-section">
            <div className="verification-title-row">
              <h4>{isSignUp ? 'Already registered?' : 'New Authority? Verify Your Identity'}</h4>
              <button 
                type="button" 
                className="toggle-mode-btn"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
              >
                {isSignUp ? 'Switch to Login' : 'Register Here'}
              </button>
            </div>

            {isSignUp && (
              <>
                <p className="upload-subtitle">
                  <strong>Upload Official Document</strong><br />
                  Accepted: ID Card, Aadhaar Card, PAN Card, Appointment Letter (PDF, JPG, PNG)
                </p>

                {/* Upload Dotted Box */}
                <label className="upload-box">
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    onChange={handleFileUpload}
                    style={{ display: 'none' }} 
                  />
                  {selectedFile ? (
                    <div className="file-preview">
                      <FileCheck size={28} color="#16a34a" />
                      <span className="file-name">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud size={32} color="#64748b" />
                      <span>Tap to upload document</span>
                    </>
                  )}
                </label>
              </>
            )}
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <ShieldCheck size={18} color="#065f46" />
            <p>
              Your document will be verified by admin. You will be notified once approved.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}