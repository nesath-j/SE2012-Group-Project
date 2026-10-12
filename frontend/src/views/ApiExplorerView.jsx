import React, { useState } from 'react';
import { Code2, Play, CheckCircle, AlertCircle, Copy, Terminal, Server, ArrowRight } from 'lucide-react';

export default function ApiExplorerView() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiEndpoints = [
    {
      group: 'Doctor Appointments',
      method: 'POST',
      path: '/api/doctor-appointments',
      desc: 'Book a new doctor appointment slot for a member. Automatically sets schedule slot is_booked=true.',
      sampleBody: JSON.stringify({
        memberId: 501,
        doctorId: 1,
        scheduleId: 2,
        appointmentDate: "2026-10-02T10:30:00",
        status: "SCHEDULED",
        consultationNotes: "Initial routine eye exam"
      }, null, 2)
    },
    {
      group: 'Doctor Appointments',
      method: 'GET',
      path: '/api/doctor-appointments/doctor/{doctorId}',
      desc: 'Retrieve all appointments assigned to a specific doctor.',
      sampleBody: null
    },
    {
      group: 'Doctor Appointments',
      method: 'GET',
      path: '/api/doctor-appointments/member/{memberId}',
      desc: 'Retrieve all optical appointments booked by a registered member.',
      sampleBody: null
    },
    {
      group: 'Doctor Appointments',
      method: 'PUT',
      path: '/api/doctor-appointments/{id}/notes',
      desc: 'Update doctor consultation & clinical prescription notes.',
      sampleBody: JSON.stringify({
        notes: "Visual acuity OD 20/20, OS 20/25. Recommended anti-blue light coating."
      }, null, 2)
    },
    {
      group: 'Doctor Appointments',
      method: 'PUT',
      path: '/api/doctor-appointments/{id}/status',
      desc: 'Update appointment lifecycle status (SCHEDULED, CONFIRMED, COMPLETED, CANCELLED).',
      sampleBody: JSON.stringify({
        status: "COMPLETED"
      }, null, 2)
    },
    {
      group: 'Doctors',
      method: 'GET',
      path: '/api/doctors',
      desc: 'Fetch full directory of registered optometrists & ophthalmologists.',
      sampleBody: null
    },
    {
      group: 'Doctors',
      method: 'GET',
      path: '/api/doctors/{id}',
      desc: 'Get doctor by unique identifier.',
      sampleBody: null
    },
    {
      group: 'Doctors',
      method: 'POST',
      path: '/api/doctors',
      desc: 'Register a new eye specialist doctor record.',
      sampleBody: JSON.stringify({
        userId: 105,
        specialization: "Pediatric Eye Care",
        licenseNumber: "MED-PED-7712"
      }, null, 2)
    },
    {
      group: 'Doctors',
      method: 'PUT',
      path: '/api/doctors/{id}',
      desc: 'Update doctor specialization and license details.',
      sampleBody: JSON.stringify({
        userId: 101,
        specialization: "Corneal Surgery & Refractive Care",
        licenseNumber: "MED-OPHTH-8821"
      }, null, 2)
    },
    {
      group: 'Doctors',
      method: 'DELETE',
      path: '/api/doctors/{id}',
      desc: 'Remove doctor from clinical directory.',
      sampleBody: null
    },
    {
      group: 'Doctor Schedules',
      method: 'GET',
      path: '/api/doctor-schedules',
      desc: 'Retrieve all doctor schedule time slots across all practitioners.',
      sampleBody: null
    },
    {
      group: 'Doctor Schedules',
      method: 'GET',
      path: '/api/doctor-schedules/doctor/{doctorId}/available',
      desc: 'Fetch only unbooked (isBooked = false) slots for doctor appointment booking.',
      sampleBody: null
    },
    {
      group: 'Doctor Schedules',
      method: 'POST',
      path: '/api/doctor-schedules',
      desc: 'Create a new available consultation time slot.',
      sampleBody: JSON.stringify({
        doctorId: 1,
        availableDate: "2026-10-06",
        startTime: "09:00:00",
        endTime: "10:00:00",
        booked: false
      }, null, 2)
    },
    {
      group: 'Products & Eyewear',
      method: 'POST',
      path: '/add',
      desc: 'Save a new optical frame, sunglasses, or lens product to MySQL inventory.',
      sampleBody: JSON.stringify({
        name: "Titanium Air Rimless",
        category: "Prescription Frames",
        price: 260.00,
        stock_quantity: 15,
        description: "Minimalist featherweight prescription eyewear frame",
        pic: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
      }, null, 2)
    }
  ];

  const current = apiEndpoints[selectedEndpoint];

  const methodColors = {
    GET: '#10b981',
    POST: '#06b6d4',
    PUT: '#f59e0b',
    DELETE: '#f43f5e'
  };

  const handleTestEndpoint = async () => {
    setLoading(true);
    setTestResult(null);

    const targetUrl = current.path.replace('{id}', '1').replace('{doctorId}', '1').replace('{memberId}', '501');
    const options = {
      method: current.method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (current.sampleBody && current.method !== 'GET') {
      options.body = current.sampleBody;
    }

    try {
      const res = await fetch(targetUrl, options);
      const text = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
      setTestResult({
        status: res.status,
        statusText: res.statusText,
        data: parsed,
        targetUrl
      });
    } catch (err) {
      setTestResult({
        status: 'OFFLINE / PROXY_FALLBACK',
        statusText: 'Spring Boot Backend at http://localhost:8081 did not respond',
        error: err.message,
        note: 'Make sure the Spring Boot application (DemoApplication.java) is running on port 8081.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc' }}>
          Spring Boot API Inspector
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Interactive catalog of all REST controllers in <code style={{ color: 'var(--accent-cyan)' }}>com.VisionExpress.demo</code>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
        {/* Endpoint List Navigation */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '720px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', padding: '0.25rem 0.5rem' }}>
            All Controller Routes ({apiEndpoints.length})
          </div>
          {apiEndpoints.map((ep, idx) => {
            const isSelected = selectedEndpoint === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedEndpoint(idx);
                  setTestResult(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                  backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: `${methodColors[ep.method]}20`,
                    color: methodColors[ep.method],
                    border: `1px solid ${methodColors[ep.method]}40`,
                    width: '52px',
                    textAlign: 'center'
                  }}
                >
                  {ep.method}
                </span>
                <span style={{ fontSize: '0.8rem', color: isSelected ? '#fff' : 'var(--text-muted)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ep.path}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Endpoint Detail & Live Tester */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: `${methodColors[current.method]}25`,
                  color: methodColors[current.method],
                  border: `1px solid ${methodColors[current.method]}60`
                }}
              >
                {current.method}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                {current.path}
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.5 }}>
              {current.desc}
            </p>
          </div>

          {/* Request Payload preview */}
          {current.sampleBody && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-subtle)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Request Body (application/json)
              </div>
              <pre
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(10, 15, 29, 0.95)',
                  border: '1px solid var(--border-color)',
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  overflowX: 'auto'
                }}
              >
                {current.sampleBody}
              </pre>
            </div>
          )}

          {/* Test Trigger Button */}
          <div>
            <button
              onClick={handleTestEndpoint}
              disabled={loading}
              className="btn btn-primary"
              style={{ gap: '8px' }}
            >
              <Play size={16} />
              <span>{loading ? 'Executing Request...' : 'Send Test Request to Backend'}</span>
            </button>
          </div>

          {/* Live Response Result */}
          {testResult && (
            <div className="animate-fade-in" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <Terminal size={16} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
                  Execution Response Result:
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: testResult.status === 200 || testResult.status === 201 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: testResult.status === 200 || testResult.status === 201 ? '#6ee7b7' : '#fcd34d',
                    fontWeight: 700
                  }}
                >
                  Status: {testResult.status} {testResult.statusText}
                </span>
              </div>

              <pre
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(5, 8, 16, 0.95)',
                  border: '1px solid var(--border-color)',
                  color: '#6ee7b7',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  maxHeight: '260px',
                  overflowY: 'auto'
                }}
              >
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
