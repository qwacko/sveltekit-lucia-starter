import { z } from 'zod';

export const updatePasswordSchema = z.object({
	id: z.string(),
	password: z
		.string()
		.min(8)
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {
			message:
				'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
		}),
	confirmPassword: z.string().min(8)
});

export type updatePasswordSchemaType = typeof updatePasswordSchema;
