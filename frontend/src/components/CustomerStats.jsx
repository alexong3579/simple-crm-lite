import React from 'react';
import { Users, Briefcase, Calendar, Mail } from 'lucide-react';

export default function CustomerStats({ customers }) {
  const total = customers.length;
  
  const uniqueJobTitles = new Set(
    customers.map((c) => c.jobTitle?.trim()).filter(Boolean)
  ).size;

  const validYears = customers
    .map((c) => Number(c.yearOfBirth))
    .filter((y) => !isNaN(y) && y > 1900);

  const avgBirthYear = validYears.length
    ? Math.round(validYears.reduce((a, b) => a + b, 0) / validYears.length)
    : '—';

  const withEmailCount = customers.filter((c) => Boolean(c.email)).length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div>
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
          <Users size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div>
          <div className="stat-label">Unique Job Titles</div>
          <div className="stat-value">{uniqueJobTitles}</div>
        </div>
        <div className="stat-icon-wrapper" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
          <Briefcase size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div>
          <div className="stat-label">Avg. Birth Year</div>
          <div className="stat-value">{avgBirthYear}</div>
        </div>
        <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}>
          <Calendar size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div>
          <div className="stat-label">Registered Emails</div>
          <div className="stat-value">{withEmailCount}</div>
        </div>
        <div className="stat-icon-wrapper" style={{ background: '#fffbeb', color: '#d97706' }}>
          <Mail size={24} />
        </div>
      </div>
    </div>
  );
}

