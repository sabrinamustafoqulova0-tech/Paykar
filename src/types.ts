export interface Subcategory {
  id: number
  slug: string
  name: string
}

export interface Category {
  id: number
  slug: string
  name: string
  icon: string
  subcategories: Subcategory[]
}

export interface Product {
  id: number
  name: string
  slug: string
  categoryId: number
  subcategoryId: number
  brand: string
  price: number
  oldPrice?: number
  discount?: number
  rating: number
  reviewCount: number
  isNew: boolean
  inStock: boolean
  images: string[]
  description: string
  specifications: Record<string, string>
}

export interface Review {
  id: number
  productId: number
  userName: string
  rating: number
  text: string
  date: string
  isVerified: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}
