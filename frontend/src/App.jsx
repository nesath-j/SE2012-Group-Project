import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AppointmentsView } from './components/AppointmentsView';
import { CouriersView } from './components/CouriersView';
import { EmployeesView } from './components/EmployeesView';
import { ProductsView } from './components/ProductsView';
import { ApiExplorerView } from './components/ApiExplorerView';
import { Toast } from './components/Toast';

const MainView = () => {
  const { activeTab } = useApp();

  return (
    <main className="page-wrapper">
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'appointments' && <AppointmentsView />}
      {activeTab === 'couriers' && <CouriersView />}
      {activeTab === 'employees' && <EmployeesView />}
      {activeTab === 'products' && <ProductsView />}
      {activeTab === 'api-explorer' && <ApiExplorerView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="ambient-glow" />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <MainView />
        </div>
      </div>
      <Toast />
    </AppProvider>
  );
}
