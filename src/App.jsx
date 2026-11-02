import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MySubscriptions from './pages/MySubscriptions';
import SpendingInsights from './pages/SpendingInsights';

export default function App() {
  return (
    <SubscriptionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="subscriptions" element={<MySubscriptions />} />
            <Route path="insights" element={<SpendingInsights />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SubscriptionProvider>
  );
}

