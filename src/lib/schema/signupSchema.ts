import { z } from 'zod';

export const signupSchema = z.object({
	username: z.string().min(3),
	password: z
		.string()
		.min(8)
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {
			message:
				'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
		}),
	confirmPassword: z.string().min(8)
});

export type signupSchemaType = typeof signupSchema;
