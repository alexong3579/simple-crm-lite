import React from 'react';
import { Users } from 'lucide-react';

export default function Navbar({ customerCount }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-icon">
            <Users size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="brand-title">SimpleCRM Lite</span>
              <span className="brand-badge">React + Vite</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Spring Boot + PostgreSQL Connected
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>{customerCount}</strong> active {customerCount === 1 ? 'contact' : 'contacts'}
          </span>
        </div>
      </div>
    </header>
  );
}

