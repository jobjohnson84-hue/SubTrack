import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORIES } from '../../utils/demoData';

function getLocalDateString() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export default function SubscriptionFormModal({
  isOpen,
  onClose,
  onSubmit,
  subscriptionToEdit = null,
}) {
  const isEditing = Boolean(subscriptionToEdit);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Entertainment',
    price: '',
    billingCycle: 'Monthly',
    nextRenewalDate: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled])';
    const focusFirstField = () => dialogRef.current?.querySelector('input[name="name"]')?.focus();
    const frame = requestAnimationFrame(focusFirstField);
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusableElements = [...(dialogRef.current?.querySelectorAll(focusableSelector) || [])];
      if (!focusableElements.length) return;
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset or pre-fill form when modal opens or subscriptionToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (subscriptionToEdit) {
        setFormData({
          name: subscriptionToEdit.name || '',
          category: subscriptionToEdit.category || 'Entertainment',
          price: subscriptionToEdit.price !== undefined ? String(subscriptionToEdit.price) : '',
          billingCycle: subscriptionToEdit.billingCycle || 'Monthly',
          nextRenewalDate: subscriptionToEdit.nextRenewalDate || '',
          status: subscriptionToEdit.status || 'Active',
        });
      } else {
        // Today formatted as default next renewal if new
        const todayStr = getLocalDateString();
        setFormData({
          name: '',
          category: 'Entertainment',
          price: '',
          billingCycle: 'Monthly',
          nextRenewalDate: todayStr,
          status: 'Active',
        });
      }
      setErrors({});
    }
  }, [isOpen, subscriptionToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for that field on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (formData.price === '' || formData.price === null || formData.price === undefined) {
      newErrors.price = 'Price is required';
    } else {
      const num = Number(formData.price);
      if (!Number.isFinite(num)) {
        newErrors.price = 'Price must be a valid number';
      } else if (num < 0) {
        newErrors.price = 'Price must be non-negative (₹0 or greater)';
      }
    }

    if (!formData.nextRenewalDate) {
      newErrors.nextRenewalDate = 'Next renewal date is required';
    } else if (!isValidDateString(formData.nextRenewalDate)) {
      newErrors.nextRenewalDate = 'Enter a valid calendar date';
    }

    if (!CATEGORIES.includes(formData.category)) {
      newErrors.category = 'Select a valid category';
    }

    if (!['Monthly', 'Yearly'].includes(formData.billingCycle)) {
      newErrors.billingCycle = 'Select a billing cycle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      price: Number(formData.price),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div ref={dialogRef} tabIndex="-1" className="bg-white w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 id="form-modal-title" className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Subscription' : 'Add New Subscription'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update your subscription details and billing info.'
                : 'Enter details to track a new recurring payment.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Service Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Service Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Netflix, Spotify, GitHub"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.name && <p id="name-error" role="alert" className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          {/* Category & Billing Cycle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                aria-invalid={Boolean(errors.category)}
                aria-describedby={errors.category ? 'category-error' : undefined}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium bg-white focus:outline-none focus:ring-2 ${errors.category ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p id="category-error" role="alert" className="mt-1 text-xs text-rose-600">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="billingCycle" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Billing Cycle <span className="text-rose-500">*</span>
              </label>
              <select
                id="billingCycle"
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                aria-invalid={Boolean(errors.billingCycle)}
                aria-describedby={errors.billingCycle ? 'billing-cycle-error' : undefined}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium bg-white focus:outline-none focus:ring-2 ${errors.billingCycle ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              {errors.billingCycle && <p id="billing-cycle-error" role="alert" className="mt-1 text-xs text-rose-600">{errors.billingCycle}</p>}
            </div>
          </div>

          {/* Price & Next Renewal Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Price (in ₹ INR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-medium text-sm">₹</span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={errors.price ? 'price-error' : undefined}
                  className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 ${
                    errors.price
                      ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.price && <p id="price-error" role="alert" className="mt-1 text-xs text-rose-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="nextRenewalDate" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Next Renewal Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="nextRenewalDate"
                name="nextRenewalDate"
                type="date"
                value={formData.nextRenewalDate}
                onChange={handleChange}
                aria-invalid={Boolean(errors.nextRenewalDate)}
                aria-describedby={errors.nextRenewalDate ? 'renewal-date-error' : undefined}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 ${
                  errors.nextRenewalDate
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {errors.nextRenewalDate && (
                <p id="renewal-date-error" role="alert" className="mt-1 text-xs text-rose-600">{errors.nextRenewalDate}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.status === 'Active'
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950 font-medium shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-sm">Active</span>
                </div>
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={handleChange}
                  className="sr-only"
                />
                {formData.status === 'Active' && <Check className="w-4 h-4 text-emerald-600" />}
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.status === 'Paused'
                    ? 'border-amber-500 bg-amber-50/40 text-amber-950 font-medium shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-sm">Paused</span>
                </div>
                <input
                  type="radio"
                  name="status"
                  value="Paused"
                  checked={formData.status === 'Paused'}
                  onChange={handleChange}
                  className="sr-only"
                />
                {formData.status === 'Paused' && <Check className="w-4 h-4 text-amber-600" />}
              </label>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              * Paused subscriptions are excluded from active monthly and yearly spending totals.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-200 transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
