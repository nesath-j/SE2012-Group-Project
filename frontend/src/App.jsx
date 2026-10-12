import Navbar from './components/Navbar';
import ProductCatalog from './components/ProductCatalog';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  

    try {
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);


  useEffect(() => {
  }, []);

  useEffect(() => {
    try {
    }

    try {
      }


  const handleAddToCart = (product) => {
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

      if (newQty <= 0) {
      }
  };

  };

  const handleClearCart = () => {
  };

  };

  };


  return (
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
          />

        {activeTab === 'catalog' && (
          <ProductCatalog
            onAddToCart={handleAddToCart}
          />
        )}

            }}
          />
        )}

          />
        )}

          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onClearCart={handleClearCart}
      />


    </div>
  );
}
