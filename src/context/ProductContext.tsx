'use client'

import { createContext, useContext, useReducer } from 'react'

type Product = {
  _id: string
  name: string
  brand: string
  price: number
  description: string
  category: string
  images: string[]
  sizes: string[]
  colors: string[]
  stock: {
    [size: string]: {
      [color: string]: number
    }
  }
  createdAt: string
  updatedAt: string
}

type ProductState = {
  products: Product[]
  filters: {
    size: string
    color: string
    price: string
    category: string
  }
  loading: boolean
}

type ProductAction = 
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'UPDATE_FILTERS'; payload: Partial<ProductState['filters']> }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: ProductState = {
  products: [],
  filters: {
    size: 'all',
    color: 'all',
    price: 'all',
    category: 'all'
  },
  loading: false
}

const ProductContext = createContext<{
  state: ProductState
  dispatch: React.Dispatch<ProductAction>
} | undefined>(undefined)

function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload
      }
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload]
      }
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => 
          p._id === action.payload._id ? action.payload : p
        )
      }
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p._id !== action.payload)
      }
    default:
      return state
  }
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, initialState)

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}