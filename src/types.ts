export type UserRole = 'customer' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  profileImage: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  categoryName: string;
  slug: string;
  description: string;
  imageCount: number;
  coverImage?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  previewImage: string;
  originalImage: string;
  imageFormat: 'JPEG' | 'PNG' | 'WebP' | 'TIFF';
  imageWidth: number;
  imageHeight: number;
  fileSize: string; // e.g., "14.2 MB"
  isActive: boolean;
  createdAt: string;
  authorName: string;
  authorAvatar?: string;
  downloadsCount: number;
  orientation?: 'landscape' | 'portrait' | 'square';
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  product: Product;
  quantity: number;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productTitle: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  previewImage: string;
  originalImage: string;
  imageWidth: number;
  imageHeight: number;
  fileSize: string;
  imageFormat: string;
  downloadCount: number;
  lastDownloadedAt?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  totalAmount: number;
  orderStatus: 'COMPLETED_DEMO' | 'PROCESSING_DEMO' | 'CANCELLED';
  checkoutType: 'DEMO';
  items: OrderItem[];
  createdAt: string;
}

export interface DownloadRecord {
  id: number;
  userId: number;
  orderItemId: number;
  downloadCount: number;
  lastDownloadedAt: string;
  createdAt: string;
}
