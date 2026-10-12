import React, { useState } from 'react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onClearCart, 
  onNotify 
}) {

  if (!isOpen) return null;



      };
      onClearCart();
  };

  return (
          </div>
          </button>
        </div>

            </div>

            </p>

              </div>
              </div>
              </div>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%' }}
              onClick={() => {
                onClose();
              }}
            >
            </button>
          </div>
          </div>
        ) : (
          <>
                        >
                      </div>
                        </div>

                        </span>
                          <button 
                          >
                          </button>
                          <button 
                          >
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
                    </div>
                  </div>
                  <input 
                  />
                </div>
                </div>
                  </div>
                </div>
                </div>
              </div>

              <button 
                className="btn-primary" 
              >
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
