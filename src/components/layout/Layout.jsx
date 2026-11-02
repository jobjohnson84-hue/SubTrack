import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Toast from '../common/Toast';
import ConfirmDialog from '../common/ConfirmDialog';
import SubscriptionFormModal from '../subscriptions/SubscriptionFormModal';
import { useSubscriptions } from '../../context/SubscriptionContext';
import { RotateCcw } from 'lucide-react';

export default function Layout() {
  const {
    isAddEditModalOpen,
    subscriptionToEdit,
    closeAddEditModal,
    addSubscription,
    updateSubscription,
    subscriptionToDelete,
    closeDeleteModal,
    confirmDelete,
    toast,
    closeToast,
    resetToDemo,
  } = useSubscriptions();

  const handleFormSubmit = (formData) => {
    if (subscriptionToEdit) {
      updateSubscription(subscriptionToEdit.id, formData);
    } else {
      addSubscription(formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SubTrack</span>
            <span>–</span>
            <span>Your subscriptions, simplified.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={resetToDemo}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors font-medium py-1 px-2 rounded-md hover:bg-slate-50"
              title="Reload the 4 realistic sample subscriptions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
            <span>•</span>
            <span>Version 3.0</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Notifications */}
      <SubscriptionFormModal
        isOpen={isAddEditModalOpen}
        onClose={closeAddEditModal}
        onSubmit={handleFormSubmit}
        subscriptionToEdit={subscriptionToEdit}
      />

      <ConfirmDialog
        isOpen={Boolean(subscriptionToDelete)}
        subscription={subscriptionToDelete}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
