import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Programs from './components/Programs';
import AICoach from './components/AICoach';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Checkout from './components/Checkout';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import UpdatePassword from './components/UpdatePassword';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { PricingPlan } from './types';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setCurrentPage('update-password');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'home' && (
        <>
          <Hero onNavigate={setCurrentPage} />
          <About />
          <Services />
          <Programs />
          <AICoach />
          <Testimonials />
          <Pricing onSelectPlan={handlePlanSelect} />
          <Contact />
        </>
      )}
      
      {currentPage === 'login' && <Login onNavigate={setCurrentPage} />}
      {currentPage === 'signup' && <Signup onNavigate={setCurrentPage} />}
      {currentPage === 'forgot-password' && <ForgotPassword onNavigate={setCurrentPage} />}
      {currentPage === 'update-password' && <UpdatePassword onNavigate={setCurrentPage} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
      {currentPage === 'checkout' && selectedPlan && <Checkout plan={selectedPlan} onNavigate={setCurrentPage} />}
      {currentPage === 'admin-login' && <AdminLogin onNavigate={setCurrentPage} />}
      {currentPage === 'admin-dashboard' && <AdminDashboard onNavigate={setCurrentPage} />}
    </Layout>
  );
};

export default App;