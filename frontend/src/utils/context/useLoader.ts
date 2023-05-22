import { useState, useEffect, createContext } from 'react'

export const LoaderContext = createContext()

export const useLoader = () => {
  const [loading, setLoading] = useState(false)

  return [loading, setLoading]
}
