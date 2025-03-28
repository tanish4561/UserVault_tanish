// Type definitions for API responses
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

export interface UsersResponse {
  page: number
  per_page: number
  total: number
  total_pages: number
  data: User[]
}

export interface ApiError {
  status: number
  message: string
}

// Base API URL
const API_BASE_URL = "https://reqres.in/api"

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: response.statusText || "An error occurred",
    }

    // Handle specific error codes
    if (response.status === 401) {
      error.message = "Unauthorized. Please login again."
      // Clear auth token on 401
      localStorage.removeItem("auth_token")
      document.cookie = "auth_token=; path=/; max-age=0"
    } else if (response.status === 404) {
      error.message = "Resource not found"
    }

    throw error
  }

  return (await response.json()) as T
}

// API service functions
export const userService = {
  // Get users with pagination
  async getUsers(page = 1): Promise<UsersResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users?page=${page}`)
      return await handleResponse<UsersResponse>(response)
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  },

  // Login user
  async login(email: string, password: string): Promise<{ token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      return await handleResponse<{ token: string }>(response)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  // Update user
  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
      return await handleResponse<User>(response)
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  },

  // Delete user
  async deleteUser(userId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
      })

      // DELETE requests to reqres.in return 204 No Content
      if (response.status !== 204 && !response.ok) {
        throw new Error("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      throw error
    }
  },
}

