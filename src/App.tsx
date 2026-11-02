import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductListing } from './components/ProductListing';
import { ProductDetailsView } from './components/ProductDetailsModal';
import { ImageCreationStudio } from './components/ImageCreationStudio';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import { CategoriesPage } from './components/CategoriesPage';
import { UserProfilePage } from './components/UserProfilePage';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { activeTab, currentUser } = useApp();

  return (
    <main className="flex-1 bg-neutral-950 text-neutral-100 min-h-screen">
      {activeTab === 'explore' && (
        <>
          <Hero />
          <ProductListing />
        </>
      )}

      {activeTab === 'categories' && <CategoriesPage />}

      {activeTab === 'details' && <ProductDetailsView />}

      {activeTab === 'create-image' && <ImageCreationStudio />}

      {activeTab === 'cart' && <CartPage />}

      {activeTab === 'checkout' && <CheckoutPage />}

      {activeTab === 'success' && <OrderSuccessPage />}

      {activeTab === 'history' && <OrderHistoryPage />}

      {activeTab === 'profile' && <UserProfilePage />}

      {activeTab === 'admin' && (
        currentUser.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <div className="max-w-md mx-auto px-4 py-24 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Administrator Access Required</h2>
            <p className="text-xs text-neutral-400 mb-6">
              You are currently viewing as a Customer. Click the "Admin Panel" button in the top navbar to switch roles.
            </p>
          </div>
        )
      )}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-neutral-950 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        <Navbar />
        <MainContent />
        <Footer />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
