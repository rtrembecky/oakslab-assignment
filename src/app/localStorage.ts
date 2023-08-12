import { Storage } from "./types"

export const storageKey = "assignment_storage"

export const loadFromLocalStorage = (): Storage | null => {
  const value = localStorage.getItem(storageKey)
  return value != null ? JSON.parse(value) : null
}

export const saveToLocalStorage = (value: Storage) => {
  localStorage.setItem(storageKey, JSON.stringify(value))
}

export const clearLocalStorage = () => {
  localStorage.removeItem(storageKey)
}
