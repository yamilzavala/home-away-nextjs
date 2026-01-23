import * as z from 'zod'
import { ZodSchema } from 'zod'

export const profileSchema = z.object({
    firstName: z.string().min(1, {message: 'First Name Required'}),
    lastName: z.string().min(1, {message: 'Last Name Required'}),
    userName: z.string().min(1, {message: 'User Name Required'}),
})
