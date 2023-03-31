import { z } from 'zod';

export const removeUserSchema = z.object({ id: z.string() });
