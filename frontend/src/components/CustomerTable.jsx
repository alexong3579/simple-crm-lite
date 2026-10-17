import React, { useState, useMemo } from 'react';
import { Search, UserPlus, RefreshCw, Edit2, Trash2, Mail, Phone, Calendar, Users, X } from 'lucide-react';

export default function CustomerTable({
  customers,
  loading,
  onRefresh,
  onAddClick,
  onEditClick,
  onDeleteClick,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter((c) => {
      const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
      const email = (c.email || '').toLowerCase();
      const job = (c.jobTitle || '').toLowerCase();
      const phone = (c.contactNo || '').toLowerCase();
      return fullName.includes(term) || email.includes(term) || job.includes(term) || phone.includes(term);
    });
  }, [customers, searchTerm]);

  const getInitials = (firstName, lastName) => {
    const f = (firstName || '').charAt(0);
    const l = (lastName || '').charAt(0);
    return `${f}${l}`.toUpperCase() || '?';
  };

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="btn-ghost-icon"
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="actions-group">
          <button
            className="btn btn-secondary"
            onClick={onRefresh}
            disabled={loading}
            title="Reload customers list"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={onAddClick}>
            <UserPlus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        {filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={28} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
              {searchTerm ? 'No matching customers found' : 'No customers yet'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '360px' }}>
              {searchTerm
                ? `No customers matched "${searchTerm}". Try checking for spelling errors or searching another term.`
                : 'Get started by creating your first customer contact in the CRM system.'}
            </p>
            {!searchTerm && (
              <button
                className="btn btn-primary"
                style={{ marginTop: '0.5rem' }}
                onClick={onAddClick}
              >
                <UserPlus size={16} />
                Create Customer
              </button>
            )}
          </div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Contact No</th>
                <th>Job Title</th>
                <th>Birth Year</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-name-cell">
                      <div className="avatar">
                        {getInitials(customer.firstName, customer.lastName)}
                      </div>
                      <div>
                        <div className="customer-full-name">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="customer-id">ID: #{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      <Mail size={14} color="var(--text-muted)" />
                      <span>{customer.email || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      {customer.contactNo ? (
                        <>
                          <Phone size={14} color="var(--text-muted)" />
                          <span>{customer.contactNo}</span>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {customer.jobTitle ? (
                      <span className="badge badge-role">{customer.jobTitle}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      {customer.yearOfBirth ? (
                        <>
                          <Calendar size={14} color="var(--text-muted)" />
                          <span>{customer.yearOfBirth}</span>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                      <button
                        className="btn-ghost-icon edit"
                        onClick={() => onEditClick(customer)}
                        title="Edit Customer"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-ghost-icon delete"
                        onClick={() => onDeleteClick(customer)}
                        title="Delete Customer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

