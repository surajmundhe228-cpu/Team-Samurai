import { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Home, 
  Map, 
  MessageSquare, 
  User, 
  Camera, 
  Send, 
  X 
} from 'lucide-react';
import './InfoExchangeScreen.css';

export default function InfoExchangeScreen({ citizenUser, onBack, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Disaster Relief Authority',
      role: 'authority',
      text: 'Heavy rainfall alert active for Rampur & nearby habitations. Send ground photos of flood water for quick response.',
      photo: null,
      time: '10:14 AM'
    },
    {
      id: 2,
      sender: 'Citizen',
      role: 'citizen',
      text: 'Water has reached the main road near the school.',
      photo: null,
      time: '10:18 AM'
    }
  ]);

  const [textInput, setTextInput] = useState('');
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingPhoto]);

  // Launch camera
  const handleOpenCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch {
      alert('Camera permission denied or camera not available.');
    }
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setPendingPhoto(canvas.toDataURL('image/jpeg'));
      closeCamera();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!textInput.trim() && !pendingPhoto) return;

    const newMsg = {
      id: Date.now(),
      sender: citizenUser?.name || 'Citizen (You)',
      role: 'citizen',
      text: textInput.trim(),
      photo: pendingPhoto,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setTextInput('');
    setPendingPhoto(null);
  };

  return (
    <div className="exchange-page-wrapper">
      <div className="exchange-mobile-frame">

        {/* 1. Header */}
        <div className="exchange-top-header">
          <button className="exchange-nav-icon-btn" onClick={() => onNavigate('settings')} title="Menu">
            <Menu size={22} />
          </button>
          <h2 className="exchange-header-title" onClick={onBack}>Reloc8</h2>
          <button className="exchange-nav-icon-btn" onClick={() => onNavigate('map')} title="Alerts">
            <Bell size={22} color="#dc2626" />
          </button>
        </div>

        {/* 2. Chat Feed */}
        <div className="chat-messages-area">
          {messages.map((m) => (
            <div key={m.id} className={`chat-bubble ${m.role}`}>
              <span className="chat-sender-name">{m.sender}</span>
              {m.photo && (
                <img src={m.photo} alt="Flood Ground Scene" className="chat-photo-attachment" />
              )}
              {m.text && <p className="chat-message-text">{m.text}</p>}
              <span className="chat-timestamp">{m.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 3. Pending Photo Thumbnail (if photo clicked) */}
        {pendingPhoto && (
          <div className="preview-thumbnail-strip">
            <img src={pendingPhoto} alt="Snapshot preview" className="preview-thumb" />
            <span style={{ fontSize: '11px', color: '#64748b', flex: 1 }}>Photo ready to send</span>
            <button 
              onClick={() => setPendingPhoto(null)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* 4. Chat Input Bar with Camera Icon at Bottom-Left */}
        <form onSubmit={handleSendMessage} className="chat-input-bar">
          <button 
            type="button" 
            className="chat-camera-btn" 
            onClick={handleOpenCamera} 
            title="Take Photo"
          >
            <Camera size={20} />
          </button>

          <input
            type="text"
            placeholder="Type a message to authorities..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="chat-text-input"
          />

          <button 
            type="submit" 
            className="chat-send-btn" 
            disabled={!textInput.trim() && !pendingPhoto}
          >
            <Send size={18} />
          </button>
        </form>

        {/* 5. Live Camera Full-Screen Capture Modal */}
        {isCameraOpen && (
          <div className="camera-modal-overlay">
            <div className="camera-modal-top">
              <span style={{ fontWeight: '700', fontSize: '14px' }}>Click Flood / Water Photo</span>
              <button onClick={closeCamera} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div className="camera-view-container">
              <video ref={videoRef} autoPlay playsInline className="camera-live-video" />
            </div>

            <div className="camera-modal-controls">
              <button type="button" onClick={capturePhoto} className="camera-shutter-btn" title="Snap Photo" />
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}

        {/* 6. Bottom Navigation Bar */}
        <div className="exchange-bottom-bar">
          <div className="exchange-bar-item" onClick={() => onNavigate('citizenDashboard')}>
            <Home size={18} />
            <span>Home</span>
          </div>

          <div className="exchange-bar-item" onClick={() => onNavigate('map')}>
            <Map size={18} />
            <span>Map</span>
          </div>

          <div className="exchange-bar-item active">
            <MessageSquare size={18} />
            <span>Exchange</span>
          </div>

          <div className="exchange-bar-item" onClick={() => onNavigate('settings')}>
            <User size={18} />
            <span>Profile</span>
          </div>
        </div>

      </div>
    </div>
  );
}