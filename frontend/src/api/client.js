// AgriStoreSmart — Axios API Client
// All backend calls in one place
// Navomesh 2026 | Problem 26010

import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
})

export const getChambers = () => API.get('/api/chambers')
export const getInventory = () => API.get('/api/inventory')
export const addBatch = (data) => API.post('/api/inventory/batch', data)
export const getAlerts = () => API.get('/api/alerts')
export const getAlertStats = () => API.get('/api/alerts/stats')
export const resolveAlert = (id) => API.post(`/api/alerts/${id}/resolve`)
export const getWeather = (city) => API.get(`/api/weather?city=${city || 'pune'}`)
export const getDispatch = () => API.get('/api/dispatch/recommend')
export const simulateSensor = () => API.post('/api/sensors/simulate')
export const getSensorHistory = (id) => API.get(`/api/sensors/history/${id}`)

export default API
