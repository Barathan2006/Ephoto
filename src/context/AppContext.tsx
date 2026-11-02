import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Category, CartItem, Order, OrderItem, UserRole } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS } from '../data/initialData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentUser: User;
  users: User[];
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  activeTab: string;
  selectedProductId: number | null;
  selectedCategoryFilter: string;
  searchQuery: string;
  lastPlacedOrder: Order | null;
  toasts: ToastInfo[];
  cartTotal: number;
  cartCount: number;
  
  // Navigation & UI
  setActiveTab: (tab: string) => void;
  navigateTo: (tab: string, productId?: number) => void;
  setSelectedCategoryFilter: (category: string) => void;
  setSearchQuery: (query: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  
  // Auth & Roles
  switchUserRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  updateUserProfile: (username: string, email: string, profileImage?: string) => boolean;
  
  // Cart
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  
  // Orders & Downloads
  placeDemoOrder: () => Order | null;
  downloadImage: (orderId: number, orderItemId: number) => Promise<boolean>;
  
  // Admin Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'downloadsCount'>) => Product;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => boolean;
  toggleProductActive: (id: number) => void;
  addCategory: (category: Omit<Category, 'id' | 'imageCount'>) => Category;
  updateCategory: (id: number, category: Partial<Category>) => void;
  deleteCategory: (id: number) => { success: boolean; message: string };
  toggleUserActive: (userId: number) => void;
  updateOrderStatus: (orderId: number, status: 'COMPLETED_DEMO' | 'PROCESSING_DEMO' | 'CANCELLED') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with localStorage fallback
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ephoto_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('ephoto_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // default to barath_creator (customer)
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ephoto_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('ephoto_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ephoto_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ephoto_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeTab, setActiveTab] = useState<string>('explore');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ephoto_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ephoto_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ephoto_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ephoto_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('ephoto_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ephoto_orders', JSON.stringify(orders));
  }, [orders]);

  // Toast notifications
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation
  const navigateTo = (tab: string, productId?: number) => {
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth & Roles
  const switchUserRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      const adminUser = users.find((u) => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      showToast('Switched to Administrator role (Admin Dashboard unlocked)', 'info');
    } else {
      const customerUser = users.find((u) => u.role === 'customer') || INITIAL_USERS[1];
      setCurrentUser(customerUser);
      if (activeTab === 'admin') {
        setActiveTab('explore');
      }
      showToast('Switched to Customer role', 'info');
    }
  };

  const updateUserProfile = (username: string, email: string, profileImage?: string): boolean => {
    // Check email uniqueness among other users
    const exists = users.some((u) => u.id !== currentUser.id && u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showToast('This email address is already in use by another account.', 'error');
      return false;
    }

    const updatedUser: User = {
      ...currentUser,
      username,
      email,
      profileImage: profileImage || currentUser.profileImage,
    };

    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    showToast('Profile updated successfully!', 'success');
    return true;
  };

  // Cart Management
  const addToCart = (product: Product) => {
    if (!product.isActive) {
      showToast('This image is currently unavailable.', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        showToast(`"${product.title}" is already in your cart.`, 'info');
        return prev;
      }
      showToast(`Added "${product.title}" to cart.`, 'success');
      return [
        ...prev,
        {
          id: Date.now(),
          userId: currentUser.id,
          productId: product.id,
          product,
          quantity: 1,
          createdAt: new Date().toISOString(),
        },
      ];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const cartCount = cart.length;

  // Place Demo Order (Strictly No Payment Gateway)
  const placeDemoOrder = (): Order | null => {
    if (cart.length === 0) {
      showToast('Your cart is empty.', 'error');
      return null;
    }

    // Verify all products are active
    const unavailable = cart.filter((item) => !item.product.isActive);
    if (unavailable.length > 0) {
      showToast('One or more items in your cart are no longer active.', 'error');
      return null;
    }

    const orderNumber = `DEMO-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newItems: OrderItem[] = cart.map((item, index) => ({
      id: Date.now() + index,
      orderId: Date.now(),
      productId: item.productId,
      productTitle: item.product.title,
      unitPrice: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
      previewImage: item.product.previewImage,
      originalImage: item.product.originalImage,
      imageWidth: item.product.imageWidth,
      imageHeight: item.product.imageHeight,
      fileSize: item.product.fileSize,
      imageFormat: item.product.imageFormat,
      downloadCount: 0,
    }));

    const newOrder: Order = {
      id: Date.now(),
      orderNumber,
      userId: currentUser.id,
      userName: currentUser.username,
      userEmail: currentUser.email,
      totalAmount: cartTotal,
      orderStatus: 'COMPLETED_DEMO',
      checkoutType: 'DEMO',
      items: newItems,
      createdAt: new Date().toISOString(),
    };

    // Increment downloads count in products
    setProducts((prev) =>
      prev.map((p) => {
        const ordered = cart.find((c) => c.productId === p.id);
        return ordered ? { ...p, downloadsCount: p.downloadsCount + 1 } : p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setCart([]);
    setActiveTab('success');
    showToast(`Demo Order ${orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  // Download High-Res Original Image
  const downloadImage = async (orderId: number, orderItemId: number): Promise<boolean> => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      showToast('Order not found.', 'error');
      return false;
    }

    // Role check / ownership check
    if (currentUser.role !== 'admin' && order.userId !== currentUser.id) {
      showToast('Unauthorized: You do not own this order.', 'error');
      return false;
    }

    const item = order.items.find((i) => i.id === orderItemId);
    if (!item) {
      showToast('Image item not found in order.', 'error');
      return false;
    }

    try {
      showToast(`Preparing high-res download for "${item.productTitle}"...`, 'info');

      // Fetch the actual image blob
      const response = await fetch(item.originalImage, { mode: 'cors' });
      if (!response.ok) {
        throw new Error('Image source network response was not ok');
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanName = item.productTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const ext = item.imageFormat.toLowerCase() === 'png' ? 'png' : item.imageFormat.toLowerCase() === 'webp' ? 'webp' : 'jpg';
      link.download = `ephoto-original-${cleanName}-${item.imageWidth}x${item.imageHeight}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // Update download count in orders state
      const now = new Date().toISOString();
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              items: o.items.map((it) =>
                it.id === orderItemId
                  ? { ...it, downloadCount: (it.downloadCount || 0) + 1, lastDownloadedAt: now }
                  : it
              ),
            };
          }
          return o;
        })
      );

      showToast(`Downloaded original high-res asset: "${item.productTitle}"`, 'success');
      return true;
    } catch {
      // Fallback: direct window download trigger if CORS block
      const link = document.createElement('a');
      link.href = item.originalImage;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const cleanName = item.productTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `ephoto-${cleanName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const now = new Date().toISOString();
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              items: o.items.map((it) =>
                it.id === orderItemId
                  ? { ...it, downloadCount: (it.downloadCount || 0) + 1, lastDownloadedAt: now }
                  : it
              ),
            };
          }
          return o;
        })
      );
      showToast(`Downloaded original image: "${item.productTitle}"`, 'success');
      return true;
    }
  };

  // Admin: Product Management
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'downloadsCount'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      downloadsCount: 0,
      authorName: productData.authorName || currentUser.username,
      authorAvatar: currentUser.profileImage,
    };

    setProducts((prev) => [newProduct, ...prev]);
    // update category image count
    setCategories((prev) =>
      prev.map((cat) => (cat.id === newProduct.categoryId ? { ...cat, imageCount: cat.imageCount + 1 } : cat))
    );
    showToast(`Product "${newProduct.title}" added to marketplace catalog!`, 'success');
    return newProduct;
  };

  const updateProduct = (id: number, productData: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...productData } : p)));
    showToast('Product details updated successfully.', 'success');
  };

  const deleteProduct = (id: number): boolean => {
    const target = products.find((p) => p.id === id);
    if (!target) return false;

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCategories((prev) =>
      prev.map((cat) => (cat.id === target.categoryId ? { ...cat, imageCount: Math.max(0, cat.imageCount - 1) } : cat))
    );
    // Remove from cart if present
    setCart((prev) => prev.filter((item) => item.productId !== id));
    showToast(`Product "${target.title}" removed.`, 'info');
    return true;
  };

  const toggleProductActive = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newState = !p.isActive;
          showToast(`Product marked as ${newState ? 'Active' : 'Inactive'}.`, 'info');
          return { ...p, isActive: newState };
        }
        return p;
      })
    );
  };

  // Admin: Category Management
  const addCategory = (categoryData: Omit<Category, 'id' | 'imageCount'>): Category => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now(),
      imageCount: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
    showToast(`Category "${newCategory.categoryName}" created.`, 'success');
    return newCategory;
  };

  const updateCategory = (id: number, categoryData: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...categoryData } : c)));
    showToast('Category updated.', 'success');
  };

  const deleteCategory = (id: number): { success: boolean; message: string } => {
    const activeProductsInCategory = products.filter((p) => p.categoryId === id);
    if (activeProductsInCategory.length > 0) {
      const msg = `Cannot delete category: ${activeProductsInCategory.length} image(s) still belong to it. Please reassign or delete them first.`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted.', 'info');
    return { success: true, message: 'Category deleted successfully.' };
  };

  // Admin: User Management
  const toggleUserActive = (userId: number) => {
    if (userId === currentUser.id && currentUser.role === 'admin') {
      showToast('Cannot deactivate your own active administrator account.', 'error');
      return;
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const next = !u.isActive;
          showToast(`User ${u.username} ${next ? 'activated' : 'deactivated'}.`, 'info');
          return { ...u, isActive: next };
        }
        return u;
      })
    );
  };

  // Admin: Order Management
  const updateOrderStatus = (orderId: number, status: 'COMPLETED_DEMO' | 'PROCESSING_DEMO' | 'CANCELLED') => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o)));
    showToast(`Order status updated to ${status}.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        products,
        categories,
        cart,
        orders,
        activeTab,
        selectedProductId,
        selectedCategoryFilter,
        searchQuery,
        lastPlacedOrder,
        toasts,
        cartTotal,
        cartCount,
        setActiveTab,
        navigateTo,
        setSelectedCategoryFilter,
        setSearchQuery,
        showToast,
        dismissToast,
        switchUserRole,
        setCurrentUser,
        updateUserProfile,
        addToCart,
        removeFromCart,
        clearCart,
        placeDemoOrder,
        downloadImage,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleUserActive,
        updateOrderStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
