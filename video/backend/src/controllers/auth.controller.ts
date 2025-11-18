import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { validateRegisterInput, validateLoginInput } from '../utils/validation';
import { RegisterRequest, LoginRequest } from '../types/auth.types';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as RegisterRequest;

      // Validate input
      const validationError = validateRegisterInput(email, password);
      if (validationError) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: validationError,
          },
        });
        return;
      }

      // Register user
      const result = await authService.register(email, password);

      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        res.status(409).json({
          error: {
            code: 'USER_EXISTS',
            message: error.message,
          },
        });
        return;
      }

      console.error('Registration error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to register user',
        },
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as LoginRequest;

      // Validate input
      const validationError = validateLoginInput(email, password);
      if (validationError) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: validationError,
          },
        });
        return;
      }

      // Login user
      const result = await authService.login(email, password);

      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        res.status(401).json({
          error: {
            code: 'INVALID_CREDENTIALS',
            message: error.message,
          },
        });
        return;
      }

      console.error('Login error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to login',
        },
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // With JWT, logout is handled client-side by removing the token
    // Server-side logout would require token blacklisting (future feature)
    res.status(200).json({
      message: 'Logged out successfully',
    });
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          },
        });
        return;
      }

      res.status(200).json({
        user: {
          id: req.user.id,
          email: req.user.email,
          createdAt: req.user.createdAt,
        },
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get user information',
        },
      });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          },
        });
        return;
      }

      const user = await authService.getUserProfile(req.user.id);

      res.status(200).json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get profile',
        },
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          },
        });
        return;
      }

      const { firstName, lastName, bio } = req.body;
      const avatarFile = req.file;

      const updatedUser = await authService.updateUserProfile(req.user.id, {
        firstName,
        lastName,
        bio,
        avatarFile,
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
        },
      });
    }
  }
}

export default new AuthController();
