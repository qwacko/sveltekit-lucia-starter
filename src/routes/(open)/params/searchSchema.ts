import { z } from 'zod';

const animalOptions = ['cat', 'dog', 'bird', 'fish'] as const;

export const searchSchema = z.object({
	animal: z.enum(animalOptions).default('cat').catch('cat'),
	count: z.number().min(0).default(0).catch(0),
	owner: z
		.object({
			gender: z.enum(['male', 'female']).catch('male'),
			name: z.string().default('No Name')
		})
		.catch({ gender: 'male', name: 'No Name' })
});
