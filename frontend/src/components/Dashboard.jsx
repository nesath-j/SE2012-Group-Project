import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  CalendarCheck2,
  Truck,
  Users2,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  Glasses
} from 'lucide-react';

export const Dashboard = () => {
  const { setActiveTab, setStats, backendOnline, pingBackend, addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apptsData, couriersData, empData, prodData] = await Promise.all([
        api.appointments.getAll(),
        api.couriers.getAll(),
        api.employees.getAll(),
        api.products.getAll(),
      ]);

      const safeAppts = Array.isArray(apptsData) ? apptsData : [];
      const safeCouriers = Array.isArray(couriersData) ? couriersData : [];
      const safeEmployees = Array.isArray(empData) ? empData : [];
      const safeProducts = Array.isArray(prodData) ? prodData : [];

      setAppointments(safeAppts);
      setCouriers(safeCouriers);
      setEmployees(safeEmployees);
      setProducts(safeProducts);

      const scheduled = safeAppts.filter(
        (a) => a.serviceStatus === 'Scheduled' || a.serviceStatus === 'In-Progress'
      ).length;

      setStats({
        appointmentsCount: safeAppts.length,
        scheduledAppointments: scheduled,
        couriersCount: safeCouriers.length,
        employeesCount: safeEmployees.length,
        productsCount: safeProducts.length,
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const scheduledCount = appointments.filter((a) => a.serviceStatus === 'Scheduled').length;
  const inProgressCount = appointments.filter((a) => a.serviceStatus === 'In-Progress').length;
  const completedCount = appointments.filter((a) => a.serviceStatus === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.serviceStatus === 'Cancelled').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner / Welcome */}
      <div
        className="glass-card"
        style={{
          padding: '2rem 2.5rem',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
          border: '1px solid rgba(14, 165, 233, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(14, 165, 233, 0.2)', borderRadius: '20px', marginBottom: '12px' }}>
            <Glasses size={14} color="var(--accent-cyan-light)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Optical Practice Control Center
            </span>
          </div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '8px', fontWeight: 800 }}>
            Welcome to <span style={{ color: 'var(--accent-cyan)' }}>VisionExpress</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
            Manage appointments for frame adjustments and lens fittings, coordinate optical courier logistics, monitor certified optometrist staff, and oversee premium eyewear inventory.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            id="dash-book-apt-btn"
            className="btn btn-primary"
            onClick={() => setActiveTab('appointments')}
          >
            <CalendarCheck2 size={16} />
            <span>Book Appointment</span>
          </button>
          <button
            id="dash-add-product-btn"
            className="btn btn-secondary"
            onClick={() => setActiveTab('products')}
          >
            <ShoppingBag size={16} />
            <span>Add Eyewear</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Metric 1: Appointments */}
        <div
          id="kpi-appointments"
          className="glass-card glass-card-interactive"
          onClick={() => setActiveTab('appointments')}
          style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Service Appointments
              </p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
                {loading ? '...' : appointments.length}
              </h2>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck2 size={22} color="var(--accent-cyan)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78125rem' }}>
            <span style={{ color: 'var(--accent-cyan-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} /> {scheduledCount} Scheduled
            </span>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>
              {inProgressCount} Active
            </span>
          </div>
        </div>

        {/* Metric 2: Couriers */}
        <div
          id="kpi-couriers"
          className="glass-card glass-card-interactive"
          onClick={() => setActiveTab('couriers')}
          style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Courier Partners
              </p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
                {loading ? '...' : couriers.length}
              </h2>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} color="#818cf8" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="#818cf8" />
            <span>Fast optical &amp; lens delivery network</span>
          </div>
        </div>

        {/* Metric 3: Employees */}
        <div
          id="kpi-employees"
          className="glass-card glass-card-interactive"
          onClick={() => setActiveTab('employees')}
          style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Optometrists &amp; Staff
              </p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
                {loading ? '...' : employees.length}
              </h2>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users2 size={22} color="#10b981" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
            <span>Across Clinical, Dispensing &amp; Lab</span>
          </div>
        </div>

        {/* Metric 4: Eyewear Catalog */}
        <div
          id="kpi-products"
          className="glass-card glass-card-interactive"
          onClick={() => setActiveTab('products')}
          style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Eyewear &amp; Products
              </p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
                {loading ? '...' : products.length}
              </h2>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={22} color="#f59e0b" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
            <span>Frames, sunglasses &amp; contacts</span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Appointments Snapshot + Logistics status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Appointments */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Upcoming Appointments</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>Latest service schedules</p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('appointments')}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {appointments.slice(0, 4).map((apt) => {
              const statusClass =
                apt.serviceStatus === 'Scheduled'
                  ? 'badge-scheduled'
                  : apt.serviceStatus === 'In-Progress'
                  ? 'badge-in-progress'
                  : apt.serviceStatus === 'Completed'
                  ? 'badge-completed'
                  : 'badge-cancelled';

              const dateStr = apt.appointmentDate
                ? new Date(apt.appointmentDate).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : 'Date pending';

              return (
                <div
                  key={apt.serviceAppointmentId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                        {apt.serviceType}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        #VE-{apt.serviceAppointmentId}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Member ID: <strong style={{ color: 'var(--text-main)' }}>{apt.memberId}</strong> • Staff ID: <strong style={{ color: 'var(--text-main)' }}>{apt.employeeId}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '4px' }}>
                      <span className={`badge ${statusClass}`}>
                        {apt.serviceStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {dateStr}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Courier Partners & Quick API status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Service Status Breakdown */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>
              Service Status Overview
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan-light)', fontWeight: 600 }}>Scheduled</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0', color: '#38bdf8' }}>{scheduledCount}</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>In-Progress</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0', color: '#fbbf24' }}>{inProgressCount}</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Completed</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0', color: '#34d399' }}>{completedCount}</p>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <span style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 600 }}>Cancelled</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0', color: '#fb7185' }}>{cancelledCount}</p>
              </div>
            </div>
          </div>

          {/* Quick API Tester Card */}
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Developer Console
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.6875rem' }}>13 Endpoints</span>
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
              Interactive Spring Boot API Explorer
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Directly invoke and inspect responses for Courier, Employee, Appointment, and Product endpoints.
            </p>
            <button
              id="dash-open-api-btn"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', borderColor: 'rgba(99, 102, 241, 0.3)' }}
              onClick={() => setActiveTab('api-explorer')}
            >
              <span>Launch API Console</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
