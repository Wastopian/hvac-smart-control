import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ApiError } from '@hvac/shared';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let statusCode = 500;
  let apiError: ApiError = {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  };

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    apiError = {
      code: 'VALIDATION_ERROR',
      message: 'Invalid input data',
      details: error.details
    };
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    apiError = {
      code: 'UNAUTHORIZED',
      message: 'Authentication required'
    };
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    apiError = {
      code: 'FORBIDDEN',
      message: 'Access denied'
    };
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    apiError = {
      code: 'NOT_FOUND',
      message: 'Resource not found'
    };
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    apiError = {
      code: error.code || 'CLIENT_ERROR',
      message: error.message || 'Client error'
    };
  }

  // Include stack trace in development
  if (isDevelopment) {
    apiError.stack = error.stack;
  }

  const response: ApiResponse = {
    success: false,
    error: apiError,
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] as string || 'unknown'
  };

  console.error('Error:', {
    error: error.message,
    stack: error.stack,
    requestId: response.requestId,
    path: req.path,
    method: req.method
  });

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    },
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] as string || 'unknown'
  };

  res.status(404).json(response);
};

// Custom error classes
export class ValidationError extends Error {
  public details: any;
  
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'ForbiddenError';
  }
} 