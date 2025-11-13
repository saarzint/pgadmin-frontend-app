/**
 * Error Handler Utility
 * Centralized error handling and user-friendly error messages
 */

import { ApiError } from '../services/api/types';

export class ErrorHandler {
  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: unknown): string {
    if (this.isApiError(error)) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Type guard to check if error is ApiError
   */
  static isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as ApiError).message === 'string'
    );
  }

  /**
   * Log error to console in development
   */
  static log(error: unknown, context?: string): void {
    if (import.meta.env.DEV) {
      console.error(context ? `Error in ${context}:` : 'Error:', error);
    }
  }

  /**
   * Handle and display error with optional callback
   */
  static handle(
    error: unknown,
    options?: {
      context?: string;
      fallbackMessage?: string;
      onError?: (message: string) => void;
    }
  ): void {
    const message = this.getUserMessage(error) || options?.fallbackMessage || 'An error occurred';

    this.log(error, options?.context);

    if (options?.onError) {
      options.onError(message);
    }
  }
}

export default ErrorHandler;
