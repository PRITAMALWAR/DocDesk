// Get the API base URL from environment variables
// If not set, use localhost as default (for development)
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5025'

// This function makes API calls to our backend
// path: the API endpoint (e.g., '/api/auth/login')
// options: method, body, token, headers
export const api = async (path, { method = 'GET', body, token, headers = {} } = {}) => {
  // Build the full URL
  let url = `${BASE}${path}`
  
  // For GET requests, add a timestamp to prevent caching
  // This ensures we always get fresh data
  if (method === 'GET') {
    // Check if URL already has query parameters
    const separator = url.includes('?') ? '&' : '?'
    // Add current timestamp to make each request unique
    url = `${url}${separator}_ts=${Date.now()}`
  }
  
  // Prepare headers for the request
  const requestHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache', // Don't cache requests
    'Pragma': 'no-cache',
    ...headers // Allow custom headers to be added
  }
  
  // Add authorization token if provided
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }
  
  // Make the API call
  const response = await fetch(url, {
    method: method,
    headers: requestHeaders,
    cache: 'no-store', // Don't store in cache
    body: body ? JSON.stringify(body) : undefined // Convert body to JSON if it exists
  })
  
  // Handle 304 Not Modified response (cached content)
  if (response.status === 304) {
    return undefined
  }
  
  // Check if request was successful
  if (!response.ok) {
    // Get error message from response
    const errorText = await response.text()
    throw new Error(errorText || 'Request failed')
  }
  
  // Check the content type of the response
  const contentType = response.headers.get('content-type') || ''
  
  // If it's JSON, parse it. Otherwise return as text
  if (contentType.includes('application/json')) {
    return await response.json()
  } else {
    return await response.text()
  }
}
