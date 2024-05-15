import { z } from 'zod';

export const kvMouseSchema = z.object({
	id: z.string(),
	x: z.number(),
	y: z.number(),
	onScreen: z.boolean(),
	name: z.string(),
	time: z.number()
});
