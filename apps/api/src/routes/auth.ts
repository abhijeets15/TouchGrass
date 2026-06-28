import { Router } from 'express';
import { z } from 'zod';
import * as authService from '../services/authService';
import { requireAuth, type AuthedRequest } from '../middleware/requireAuth';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(2).max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

function handleError(res: import('express').Response, err: unknown) {
  const e = err as Error & { status?: number };
  const status = e.status ?? 500;
  const message = status === 500 ? 'Internal server error' : e.message;
  res.status(status).json({
    error: message,
    code: status === 409 ? 'EMAIL_EXISTS' : status === 401 ? 'AUTH_FAILED' : undefined,
  });
}

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' });
    return;
  }
  try {
    const result = await authService.register(parsed.data);
    res.status(201).json(result);
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid email or password' });
    return;
  }
  try {
    const result = await authService.login(parsed.data);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/refresh', async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Refresh token required' });
    return;
  }
  try {
    const tokens = await authService.refreshSession(parsed.data.refreshToken);
    res.json(tokens);
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const user = await authService.getUserById(req.userId!);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/logout', requireAuth, async (req: AuthedRequest, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Refresh token required' });
    return;
  }
  try {
    await authService.logout(parsed.data.refreshToken);
    res.json({ ok: true });
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/forgot-password', async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Invalid email' });
    return;
  }
  try {
    await authService.requestPasswordReset(parsed.data.email);
    // Always return success for security (don't reveal if email exists)
    res.json({ ok: true, message: 'If an account exists with this email, a password reset token has been generated' });
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/reset-password', async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' });
    return;
  }
  try {
    await authService.resetPassword(parsed.data.token, parsed.data.password);
    res.json({ ok: true, message: 'Password has been reset successfully' });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
