'use client';

import React, { useState } from 'react';
import CartDisplay from '@/components/CartDisplay';
import Toast from '@/components/Toast';

export default function CartPage() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-serif text-4xl font-light tracking-wide text-gray-800">
            Shopping Bag
          </h1>
          <div className="mx-auto mb-4 h-px w-24 bg-gray-300" />
        </div>
        <CartDisplay setShowToast={setToast} />
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
