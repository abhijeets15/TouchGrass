import { createAuthClient } from '@vibecheck/api-client';
import { API_URL } from '../config';

export const authApi = createAuthClient(API_URL);
