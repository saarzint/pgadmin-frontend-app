/**
 * API Client
 * Configured axios instance with interceptors
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import { ApiError } from './types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      withCredentials: API_CONFIG.withCredentials,
      headers: {
        'Content-Type': 'application/json',
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 500, // Accept all status codes below 500
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add authorization token if available
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.DEV) {
          console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
          });
        }

        return config;
      },
      (error: AxiosError) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response in development
        if (import.meta.env.DEV) {
          console.log('API Response:', {
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          status: error.response?.status,
        };

        if (error.response) {
          // Server responded with error
          const data = error.response.data as { message?: string; error?: string };
          apiError.message = data?.message || data?.error || 'Server error occurred';
          apiError.status = error.response.status;
          apiError.details = error.response.data;

          // Handle specific status codes
          switch (error.response.status) {
            case 401:
              // Unauthorized - clear token and redirect to login
              localStorage.removeItem('auth_token');
              apiError.message = 'Session expired. Please login again.';
              break;
            case 403:
              apiError.message = 'Access forbidden';
              break;
            case 404:
              apiError.message = 'Resource not found';
              break;
            case 500:
              apiError.message = 'Internal server error';
              break;
          }
        } else if (error.request) {
          // Request made but no response
          if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            apiError.message = 'Request timeout. The server is taking too long to respond.';
          } else if (error.message.includes('ConnectionTerminated') || error.message.includes('ECONNRESET')) {
            apiError.message = 'Connection was terminated by the server. This may be due to a long-running request. Please try again.';
          } else {
            apiError.message = 'No response from server. Please check your connection.';
          }
        } else {
          // Error setting up request
          apiError.message = error.message;
        }

        console.error('API Error:', apiError);
        return Promise.reject(apiError);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }

  // Helper methods for common HTTP methods
  public async get<T>(url: string, config?: Parameters<typeof this.client.get>[1]) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: Parameters<typeof this.client.post>[2]) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: Parameters<typeof this.client.put>[2]) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: unknown, config?: Parameters<typeof this.client.patch>[2]) {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: Parameters<typeof this.client.delete>[1]) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
