import { useState } from 'react';
import {
  HeartPulse,
  X,
  MapPin,
  Phone,
  User,
  AlertTriangle
} from 'lucide-react';
import './MedicalSOS.css';

export default function MedicalSOS({ onClose, citizenUser }) {
  const [form, setForm] = useState({
    patientName: citizenUser?.name || '',
    phone: '',
    emergencyType: 'Medical Emergency',
    location: '',
    description: ''
  });

  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.patientName || !form.phone || !form.location) {
      alert('Please fill all required fields.');
      return;
    }

    const newSOS = {
      id: Date.now(),
      ...form,
      status: 'PENDING',
      createdAt: new Date().toLocaleString()
    };

    const existingSOS =
      JSON.parse(localStorage.getItem('reloc8SOSAlerts')) || [];

    localStorage.setItem(
      'reloc8SOSAlerts',
      JSON.stringify([...existingSOS, newSOS])
    );

    setSent(true);
  };

  return (
    <div className="sos-overlay">
      <div className="sos-modal">

        <div className="sos-header">
          <div className="sos-title">
            <div className="sos-icon">
              <HeartPulse size={22} />
            </div>

            <div>
              <h3>Medical SOS</h3>
              <p>Emergency medical assistance</p>
            </div>
          </div>

          <button
            className="sos-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {sent ? (
          <div className="sos-success">

            <div className="success-icon">
              <HeartPulse size={38} />
            </div>

            <h3>SOS Sent Successfully</h3>

            <p>
              Your medical emergency alert has been
              sent to the authority control room.
            </p>

            <div className="success-info">
                <AlertTriangle size={17} />
                <span>
                Please stay at your current safe location
                and keep your phone available.
                </span>
            </div>
            <button
              className="sos-done-btn"
              onClick={onClose}
            >
              Done
            </button>

          </div>
        ) : (

          <form onSubmit={handleSubmit} className="sos-form">

            <div className="sos-emergency-note">
              <AlertTriangle size={18} />
              Use this only for genuine medical emergencies.
            </div>

            <label>
              <User size={15} />
              Patient Name *
            </label>

            <input
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              placeholder="Enter patient name"
            />

            <label>
              <Phone size={15} />
              Contact Number *
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              type="tel"
            />

            <label>Emergency Type *</label>

            <select
              name="emergencyType"
              value={form.emergencyType}
              onChange={handleChange}
            >
              <option>Medical Emergency</option>
              <option>Injury</option>
              <option>Pregnancy Emergency</option>
              <option>Breathing Problem</option>
              <option>Unconscious Person</option>
              <option>Other</option>
            </select>

            <label>
              <MapPin size={15} />
              Current Location *
            </label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Village / landmark"
            />

            <label>Describe the Emergency</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Briefly describe what happened..."
              rows="3"
            />

            <button
              type="submit"
              className="send-sos-btn"
            >
              <HeartPulse size={19} />
              SEND MEDICAL SOS
            </button>

          </form>

        )}

      </div>
    </div>
  );
}