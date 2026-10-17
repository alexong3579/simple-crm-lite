import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Loader2 } from 'lucide-react';

const currentYear = new Date().getFullYear();

export default function CustomerModal({ isOpen, onClose, onSave, customer }) {
  const isEditing = Boolean(customer?.id);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    jobTitle: '',
    yearOfBirth: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        contactNo: customer.contactNo || '',
        jobTitle: customer.jobTitle || '',
        yearOfBirth: customer.yearOfBirth !== null && customer.yearOfBirth !== undefined 
          ? String(customer.yearOfBirth) 
          : '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        contactNo: '',
        jobTitle: '',
        yearOfBirth: '',
      });
    }
    setErrors({});
    setSubmitting(false);
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) {
      errs.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errs.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (formData.yearOfBirth) {
      const year = Number(formData.yearOfBirth);
      if (isNaN(year) || year < 1900 || year > currentYear) {
        errs.yearOfBirth = `Year must be between 1900 and ${currentYear}`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        contactNo: formData.contactNo.trim() || null,
        jobTitle: formData.jobTitle.trim() || null,
        yearOfBirth: formData.yearOfBirth ? parseInt(formData.yearOfBirth, 10) : null,
      };

      await onSave(payload, customer?.id);
      onClose();
    } catch (err) {
      // Error handled by caller toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isEditing ? <Save size={20} color="var(--primary)" /> : <UserPlus size={20} color="var(--primary)" />}
            <h2 className="modal-title">
              {isEditing ? 'Edit Customer' : 'Add New Customer'}
            </h2>
          </div>
          <button className="btn-ghost-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="e.g. Jane"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  autoFocus
                />
                {errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                {errors.lastName && <span className="form-error">{errors.lastName}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="jane.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+1 555-0199"
                  value={formData.contactNo}
                  onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Year of Birth</label>
                <input
                  type="number"
                  className={`form-input ${errors.yearOfBirth ? 'error' : ''}`}
                  placeholder="1992"
                  value={formData.yearOfBirth}
                  onChange={(e) => setFormData({ ...formData, yearOfBirth: e.target.value })}
                  min="1900"
                  max={currentYear}
                />
                {errors.yearOfBirth && <span className="form-error">{errors.yearOfBirth}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Product Manager"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Customer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

