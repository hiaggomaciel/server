import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
    app.get("/memories", async () => {
        const memories = await prisma.memory.findMany({
            orderBy: {
                createdAt: 'asc',
            }
        })
        return memories.map(memory => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                excerpt: memory.content.substring(0, 115).concat('...')
            }
        })
    })
    
    app.get("/memories/:id", async (request) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id,
            }
        })

        return memory
    })

    app.post("/memories/:id", async (request) => {
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false)
        })
        const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

        const memory = await prisma.memory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                userId: '66063d51-0526-41e4-8369-6861444f740c'
            }
        })

        return memory
    })

    app.put("/memories/:id", async () => {

    })

    app.delete("/memories/:id", async () => {

    })
}