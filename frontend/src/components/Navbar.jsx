import React from 'react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onOpenCart, 
}) {
  return (
        {/* Brand Logo */}
          </div>
          <div>
            </div>
          </div>
        </div>

              <button 
                onClick={() => setActiveTab('catalog')}
              >
              </button>
              <button 
              >
              </button>
              <button 
              >
              </button>
              <button 
              >
              </button>
        </nav>

          <div 
          >
          </div>

          <button 
            onClick={onOpenCart}
                }} 
              >
            </button>
        </div>
      </div>
    </header>
  );
}
