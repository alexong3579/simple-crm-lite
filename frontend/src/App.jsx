import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CustomerStats from './components/CustomerStats';
import CustomerTable from './components/CustomerTable';
import CustomerModal from './components/CustomerModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } from './services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load customers:', err);
      setError(err.message || 'Could not connect to the CRM server.');
      addToast('Failed to load customers. Check backend connection.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const handleOpenDelete = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const handleSaveCustomer = async (customerData, id) => {
    try {
      if (id) {
        await updateCustomer(id, customerData);
        addToast(`Updated ${customerData.firstName} ${customerData.lastName} successfully.`);
      } else {
        await createCustomer(customerData);
        addToast(`Added ${customerData.firstName} ${customerData.lastName} successfully.`);
      }
      fetchCustomers();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
      throw err;
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteCustomer(id);
      addToast('Customer removed successfully.');
      fetchCustomers();
    } catch (err) {
      addToast(err.message || 'Failed to delete customer', 'error');
      throw err;
    }
  };

  return (
    <div className="app-container">
      <Navbar customerCount={customers.length} />

      <main className="main-content">
        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              color: '#991b1b',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} />
              <div>
                <strong>Connection Error:</strong> {error}
                <div style={{ fontSize: '0.8rem', marginTop: '0.2rem', color: '#b91c1c' }}>
                  Make sure the Spring Boot backend is running on <code>http://localhost:8080</code>.
                </div>
              </div>
            </div>
            <button
              className="btn btn-secondary"
              onClick={fetchCustomers}
              style={{ borderColor: '#fca5a5' }}
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        <CustomerStats customers={customers} />

        <CustomerTable
          customers={customers}
          loading={loading}
          onRefresh={fetchCustomers}
          onAddClick={handleOpenAdd}
          onEditClick={handleOpenEdit}
          onDeleteClick={handleOpenDelete}
        />
      </main>

      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={editingCustomer}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        customer={customerToDelete}
      />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

