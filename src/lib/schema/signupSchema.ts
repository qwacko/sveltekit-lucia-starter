import { z } from 'zod';

export const signupSchemaRaw = z.object({
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

export const signupSchema = signupSchemaRaw.refine(
	(data) => data.password === data.confirmPassword,
	{
		message: 'Passwords must match',
		path: ['confirmPassword']
	}
);

export const updatePasswordSchema = signupSchemaRaw
	.pick({ password: true, confirmPassword: true })
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords must match',
		path: ['confirmPassword']
	});

export type signupSchemaType = typeof signupSchema;
