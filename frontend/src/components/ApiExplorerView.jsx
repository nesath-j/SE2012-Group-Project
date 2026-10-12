import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Terminal,
  Send,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';

const ENDPOINTS = [
  // Couriers
  {
    id: 'get-all-couriers',
    controller: 'CourierController',
    method: 'GET',
    path: '/api/couriers',
    description: 'Retrieve all registered courier logistics partners',
    defaultParams: '',
    defaultBody: '',
  },
  {
    id: 'get-courier-by-id',
    controller: 'CourierController',
    method: 'GET',
    path: '/api/couriers/1',
    description: 'Find courier partner by ID',
    defaultParams: '',
    defaultBody: '',
  },
  {
    id: 'get-couriers-by-service-type',
    controller: 'CourierController',
    method: 'GET',
    path: '/api/couriers/service-type/Express Delivery',
    description: 'Filter couriers by optical service type',
    defaultParams: '',
    defaultBody: '',
  },
  {
    id: 'post-courier',
    controller: 'CourierController',
    method: 'POST',
    path: '/api/couriers',
    description: 'Register a new courier partner',
    defaultParams: '',
    defaultBody: JSON.stringify(
      {
        companyName: 'City Express Optical',
        contactNumber: '+94 77 123 4567',
        serviceType: 'Express Delivery',
      },
      null,
      2
    ),
  },
  {
    id: 'put-courier',
    controller: 'CourierController',
    method: 'PUT',
    path: '/api/couriers/1',
    description: 'Update courier information',
    defaultParams: '',
    defaultBody: JSON.stringify(
      {
        companyName: 'DHL Express Healthcare',
        contactNumber: '+94 11 245 8899',
        serviceType: 'Same Day Optical',
      },
      null,
      2
    ),
  },
  {
    id: 'delete-courier',
    controller: 'CourierController',
    method: 'DELETE',
    path: '/api/couriers/1',
    description: 'Delete courier partner',
    defaultParams: '',
    defaultBody: '',
  },

  // Employees
  {
    id: 'get-all-employees',
    controller: 'EmployeeController',
    method: 'GET',
    path: '/api/employees',
    description: 'Retrieve all optometrists and clinic staff',
    defaultParams: '',
    defaultBody: '',
  },
  {
    id: 'get-employee-by-id',
    controller: 'EmployeeController',
    method: 'GET',
    path: '/api/employees/101',
    description: 'Find staff member by Employee ID',
    defaultParams: '',
    defaultBody: '',
  },
  {
    id: 'get-employees-by-dept',
    controller: 'EmployeeController',
    method: 'GET',
    path: '/api/employees/department/Clinical Optometry',
    description: 'Filter staff by assigned department',
    defaultParams: '',
    defaultBody: '',
  },
  {
    id: 'post-employee',
    controller: 'EmployeeController',
    method: 'POST',
    path: '/api/employees',
    description: 'Create a new employee record',
    defaultParams: '',
    defaultBody: JSON.stringify(
      {
        employeeId: 106,
        roleTitle: 'Contact Lens Specialist',
        assignedDepartment: 'Clinical Optometry',
      },
      null,
      2
    ),
  },
  {
    id: 'put-employee',
    controller: 'EmployeeController',
    method: 'PUT',
    path: '/api/employees/101',
    description: 'Update employee role and department',
    defaultParams: '',
    defaultBody: JSON.stringify(
      {
        roleTitle: 'Principal Optometrist',
        assignedDepartment: 'Clinical Optometry',
      },
      null,
      2
    ),
  },
  {
    id: 'delete-employee',
    controller: 'EmployeeController',
    method: 'DELETE',
    path: '/api/employees/106',
    description: 'Delete employee record',
    defaultParams: '',
    defaultBody: '',
  },

  // Service Appointments
  {
    id: 'get-all-appointments',
    controller: 'ServiceAppointmentController',
    method: 'GET',
    path: '/api/service-appointments',
    description: 'Get all service appointments across the practice',
    defaultParams: '',
    defaultBody: '',
  },
  {
    id: 'get-appointment-by-id',
    controller: 'ServiceAppointmentController',
    method: 'GET',
    path: '/api/service-appointments/1',
    description: 'Get service appointment details by ID',
    defaultParams: '',
    defaultBody: '',
  },
  {
    id: 'get-appointments-by-member',
    controller: 'ServiceAppointmentController',
    method: 'GET',
    path: '/api/service-appointments/member/1001',
    description: 'Get all appointments booked by a specific member',
    defaultParams: '',
    defaultBody: '',
  },
  {
    id: 'get-appointments-by-employee',
    controller: 'ServiceAppointmentController',
    method: 'GET',
    path: '/api/service-appointments/employee/101',
    description: 'Get all appointments assigned to a specific optometrist',
    defaultParams: '',
    defaultBody: '',
  },
  {
    id: 'post-appointment',
    controller: 'ServiceAppointmentController',
    method: 'POST',
    path: '/api/service-appointments',
    description: 'Book a service appointment (Frame Adjustment, Lens Fitting, Repair)',
    defaultParams: '',
    defaultBody: JSON.stringify(
      {
        memberId: 1005,
        employeeId: 101,
        serviceType: 'Frame Adjustment',
        appointmentDate: '2026-10-15T15:30:00',
      },
      null,
      2
    ),
  },
  {
    id: 'patch-appointment-status',
    controller: 'ServiceAppointmentController',
    method: 'PATCH',
    path: '/api/service-appointments/1/status?status=Completed',
    description: 'Update appointment service status',
    defaultParams: '',
    defaultBody: '',
  },
  {
    id: 'put-cancel-appointment',
    controller: 'ServiceAppointmentController',
    method: 'PUT',
    path: '/api/service-appointments/1/cancel',
    description: 'Cancel service appointment',
    defaultParams: '',
    defaultBody: '',
  },

  // Products
  {
    id: 'post-product-add',
    controller: 'ProductController',
    method: 'POST',
    path: '/api/products/add',
    description: 'Add new optical product or eyewear',
    defaultParams: '',
    defaultBody: JSON.stringify(
      {
        name: 'Tom Ford Blue Block Eyeglasses',
        category: 'Eyeglasses',
        price: 395.00,
        stock_quantity: 12,
        description: 'Luxury Italian hand-crafted optical frames with anti-reflective blue-block lenses.',
        pic: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80',
      },
      null,
      2
    ),
  },
];

export const ApiExplorerView = () => {
  const { backendOnline, addToast } = useApp();
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [customPath, setCustomPath] = useState(ENDPOINTS[0].path);
  const [requestBody, setRequestBody] = useState(ENDPOINTS[0].defaultBody);
  const [responseOutput, setResponseOutput] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
    setCustomPath(endpoint.path);
    setRequestBody(endpoint.defaultBody);
    setResponseOutput(null);
    setResponseStatus(null);
    setResponseTime(null);
  };

  const handleExecute = async () => {
    setExecuting(true);
    setResponseOutput(null);
    setResponseStatus(null);
    const start = performance.now();

    try {
      const options = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (['POST', 'PUT'].includes(selectedEndpoint.method) && requestBody.trim()) {
        try {
          JSON.parse(requestBody); // validate JSON
          options.body = requestBody;
        } catch {
          throw new Error('Invalid JSON payload in request body');
        }
      }

      const res = await fetch(customPath, options);
      const elapsed = Math.round(performance.now() - start);
      setResponseTime(elapsed);
      setResponseStatus(res.status);

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text || '(Empty response / 204 No Content)';
      }

      setResponseOutput(data);
      addToast(res.ok ? 'success' : 'error', `HTTP ${res.status} returned in ${elapsed}ms`, 'API Response');
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setResponseTime(elapsed);
      setResponseStatus('ERR');
      setResponseOutput({
        error: err.message,
        tip: 'Check that Spring Boot is running on http://localhost:8081 or verify the request body.',
      });
      addToast('error', err.message, 'API Request Failed');
    } finally {
      setExecuting(false);
    }
  };

  const copyResponse = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(
      typeof responseOutput === 'object'
        ? JSON.stringify(responseOutput, null, 2)
        : String(responseOutput)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodColors = {
    GET: '#10b981',
    POST: '#0ea5e9',
    PUT: '#f59e0b',
    PATCH: '#a855f7',
    DELETE: '#f43f5e',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <Terminal size={24} color="var(--accent-cyan)" />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
            Spring Boot REST API Console
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
          Directly inspect, test, and debug all 4 backend controllers (Courier, Employee, ServiceAppointment, Product).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Endpoint Selector List */}
        <div
          className="glass-card"
          style={{
            padding: '1rem',
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ padding: '4px 8px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Available Endpoints ({ENDPOINTS.length})
            </span>
          </div>

          {ENDPOINTS.map((ep) => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <button
                key={ep.id}
                id={`ep-btn-${ep.id}`}
                onClick={() => handleSelect(ep)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--border-glow)' : '1px solid transparent',
                  background: isSelected ? 'rgba(14, 165, 233, 0.12)' : 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: methodColors[ep.method],
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    {ep.method}
                  </span>
                  <span style={{ fontSize: '0.78125rem', fontWeight: 600, color: 'var(--text-main)', wordBreak: 'break-all' }}>
                    {ep.path.split('?')[0]}
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', paddingLeft: '2px' }}>
                  {ep.controller}
                </span>
              </button>
            );
          })}
        </div>

        {/* Request / Response Workbench */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* URL & Method Execution Bar */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  color: methodColors[selectedEndpoint.method],
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {selectedEndpoint.method}
              </span>
              <input
                id="api-path-input"
                type="text"
                className="form-control"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '0.875rem', height: '40px' }}
              />
              <button
                id="api-send-btn"
                className="btn btn-primary"
                onClick={handleExecute}
                disabled={executing}
                style={{ height: '40px', padding: '0 1.5rem' }}
              >
                <Send size={15} />
                <span>{executing ? 'Sending...' : 'Send'}</span>
              </button>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              {selectedEndpoint.description} • Controller: <code style={{ color: 'var(--accent-cyan-light)' }}>{selectedEndpoint.controller}</code>
            </p>
          </div>

          {/* Request Body (for POST/PUT) */}
          {['POST', 'PUT'].includes(selectedEndpoint.method) && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Request Payload (JSON)
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setRequestBody(selectedEndpoint.defaultBody)}
                >
                  <RotateCcw size={12} />
                  <span>Reset Default</span>
                </button>
              </div>
              <textarea
                id="api-body-textarea"
                className="form-control"
                rows={6}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  background: 'rgba(11, 17, 32, 0.9)',
                }}
              />
            </div>
          )}

          {/* Response Console */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Response Output
                </span>
                {responseStatus && (
                  <span
                    className={`badge ${
                      String(responseStatus).startsWith('2')
                        ? 'badge-completed'
                        : 'badge-cancelled'
                    }`}
                  >
                    HTTP {responseStatus}
                  </span>
                )}
                {responseTime !== null && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {responseTime}ms
                  </span>
                )}
              </div>

              {responseOutput && (
                <button className="btn btn-secondary btn-sm" onClick={copyResponse}>
                  {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <pre
              id="api-response-pre"
              style={{
                background: 'rgba(11, 17, 32, 0.95)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                color: '#38bdf8',
                fontFamily: 'monospace',
                fontSize: '0.8125rem',
                overflowX: 'auto',
                minHeight: '160px',
                maxHeight: '380px',
                margin: 0,
              }}
            >
              {responseOutput !== null
                ? typeof responseOutput === 'object'
                  ? JSON.stringify(responseOutput, null, 2)
                  : String(responseOutput)
                : '// Click "Send" above to invoke the endpoint and inspect response output'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
