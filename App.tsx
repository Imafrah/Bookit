
import React from 'react';
import { useAppContext } from './frontend/components/context/AppContext';
import HomePage from './frontend/components/pages/HomePage';
import DetailsPage from './frontend/components/pages/DetailsPage';
import CheckoutPage from './frontend/components/pages/CheckoutPage';
import ResultPage from './frontend/components/pages/ResultPage';
import Header from './frontend/components/Header';

const App: React.FC = () => {
  const { currentPage } = useAppContext();

  const renderPage = () => {
    switch (currentPage) {
      case 'details':
        return <DetailsPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'result':
        return <ResultPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Header />
      {renderPage()}
    </div>
  );
};

export default App;
