import React, { createContext, useContext, useState, useEffect } from 'react';
import { getInitialDemoData } from '../utils/demoData';

const STORAGE_KEY = 'subtrack_subscriptions';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  // Initialize state from localStorage or demo data if never set
  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null) {
        // Never initialized before -> seed demo data
        const initial = getInitialDemoData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(stored) || [];
    } catch (err) {
      console.error('Error reading localStorage for subscriptions:', err);
      return [];
    }
  });

  // Modal & Dialog state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [subscriptionToEdit, setSubscriptionToEdit] = useState(null);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null); // { id, type: 'success' | 'info' | 'error', message }

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Keep localStorage synced whenever subscriptions state changes
  const saveSubscriptions = (newList) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      setSubscriptions(newList);
    } catch (err) {
      console.error('Error writing subscriptions to localStorage:', err);
      showToast('Failed to save to local storage.', 'error');
    }
  };

  // Add Subscription
  const addSubscription = (subData) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newSub = {
      id,
      name: subData.name.trim(),
      category: subData.category || 'Other',
      price: parseFloat(subData.price),
      billingCycle: subData.billingCycle || 'Monthly',
      nextRenewalDate: subData.nextRenewalDate,
      status: subData.status || 'Active',
      createdAt: new Date().toISOString(),
    };

    const updated = [newSub, ...subscriptions];
    saveSubscriptions(updated);
    showToast(`"${newSub.name}" added successfully!`, 'success');
    return newSub;
  };

  // Update Subscription
  const updateSubscription = (id, updatedFields) => {
    let updatedName = '';
    const updated = subscriptions.map((sub) => {
      if (sub.id === id) {
        updatedName = updatedFields.name?.trim() || sub.name;
        return {
          ...sub,
          ...updatedFields,
          name: updatedFields.name ? updatedFields.name.trim() : sub.name,
          price: updatedFields.price !== undefined ? parseFloat(updatedFields.price) : sub.price,
          updatedAt: new Date().toISOString(),
        };
      }
      return sub;
    });

    saveSubscriptions(updated);
    showToast(`"${updatedName}" updated successfully!`, 'success');
  };

  // Delete Subscription
  const deleteSubscription = (id) => {
    const target = subscriptions.find((s) => s.id === id);
    const updated = subscriptions.filter((s) => s.id !== id);
    saveSubscriptions(updated);
    showToast(`"${target ? target.name : 'Subscription'}" was deleted.`, 'info');
  };

  // Reset to initial demo data (user-initiated)
  const resetToDemo = () => {
    const demo = getInitialDemoData();
    saveSubscriptions(demo);
    showToast('Reset sample demo subscriptions.', 'info');
  };

  // Modal helpers
  const openAddModal = () => {
    setSubscriptionToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (sub) => {
    setSubscriptionToEdit(sub);
    setIsAddEditModalOpen(true);
  };

  const closeAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setSubscriptionToEdit(null);
  };

  const openDeleteModal = (sub) => {
    setSubscriptionToDelete(sub);
  };

  const closeDeleteModal = () => {
    setSubscriptionToDelete(null);
  };

  const confirmDelete = () => {
    if (subscriptionToDelete) {
      deleteSubscription(subscriptionToDelete.id);
      closeDeleteModal();
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        resetToDemo,
        // Modal states & triggers
        isAddEditModalOpen,
        subscriptionToEdit,
        openAddModal,
        openEditModal,
        closeAddEditModal,
        subscriptionToDelete,
        openDeleteModal,
        closeDeleteModal,
        confirmDelete,
        // Toast
        toast,
        showToast,
        closeToast,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
}
