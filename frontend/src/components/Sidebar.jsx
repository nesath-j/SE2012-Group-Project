import React from 'react';
import {
  LayoutDashboard,
} from 'lucide-react';

  const navItems = [
    {
      id: 'dashboard',
    },
    {
      id: 'appointments',
    },
    {
    },
    {
    },
    {
      id: 'products',
      label: 'Eyewear & Products',
    },
    {
      id: 'api-explorer',
  ];

  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1rem',
      }}
    >
      <div>
        </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: 'none',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>{item.label}</span>
                </div>
                    <span
                    >
                      {item.badge}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>
      </div>

      <div
        style={{
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
        }}
      >
        </div>
      </div>
    </aside>
  );
