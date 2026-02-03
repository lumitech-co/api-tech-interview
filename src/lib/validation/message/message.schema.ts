import { z } from "zod";

const defaultMessageSchema = z.object({
    id: z.number(),
    text: z.string(),
    createdAt: z.date(),
});

const createMessageBodySchema = z.object({
    text: z.string(),
});

type CreateMessageInput = z.infer<typeof createMessageBodySchema>;

const createMessageResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        message: defaultMessageSchema,
    }),
});

type CreateMessageResponse = z.infer<typeof createMessageResponseSchema>;

const fetchMessagesResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        messages: z.array(defaultMessageSchema),
    }),
});

type FetchMessagesResponse = z.infer<typeof fetchMessagesResponseSchema>;

const fetchMessagesQuerySchema = z
    .object({
        search: z.string(),
    })
    .partial();

type FetchMessagesQueryInput = z.infer<typeof fetchMessagesQuerySchema>;

export {
    createMessageBodySchema,
    createMessageResponseSchema,
    fetchMessagesQuerySchema,
    fetchMessagesResponseSchema,
};

export type {
    CreateMessageInput,
    CreateMessageResponse,
    FetchMessagesResponse,
    FetchMessagesQueryInput,
};
