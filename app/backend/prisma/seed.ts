import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const userIds: number[] = [103, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101];
const placeIds: number[] = [
    113, 117, 120, 122, 123, 118, 116, 121, 114, 119,
    124, 125, 126, 127, 128, 115, 129, 130, 131, 132,
];
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomPrice(): string {
    const cents = randomInt(0, 99).toString().padStart(2, '0');
    return `${randomInt(30, 180)}.${cents}`;
}
function randomComment(i: number): string | null {
    const comments = [
        'Experiência excelente, recomendo!',
        'Comida muito boa e ambiente agradável.',
        'Bom custo-benefício, voltaria novamente.',
        'Poderia ser melhor em alguns pontos.',
        'Atendimento rápido e cordial.',
        'Achei o preço um pouco alto pelo que entrega.',
        'Surpreendeu positivamente!',
        'Demorou um pouco, mas a comida estava ótima.',
        'Ambiente barulhento, porém comida boa.',
        'Lugar aconchegante e bem localizado.',
    ];
    return Math.random() < 0.7 ? comments[i % comments.length] : null;
}
function randomPastDate(daysBack = 120): Date {
    const now = new Date();
    const offsetDays = randomInt(0, daysBack);
    const d = new Date(now);
    d.setDate(now.getDate() - offsetDays);
    d.setHours(randomInt(10, 22), randomInt(0, 59), randomInt(0, 59), 0);
    return d;
}
async function main() {
    const total = 30;
    const data = Array.from({ length: total }, (_, i) => {
        const userId = userIds[i % userIds.length];
        const placeId = placeIds[i % placeIds.length];
        const overall = randomInt(3, 5);
        return {
            userId,
            placeId,
            generalRating: overall,
            foodRating: Math.min(5, Math.max(1, overall + randomInt(-1, 1))),
            serviceRating: Math.min(5, Math.max(1, overall + randomInt(-1, 1))),
            environmentRating: Math.min(5, Math.max(1, overall + randomInt(-1, 1))),
            comment: randomComment(i),
            pricePaid: randomPrice(),
            numberOfPeople: randomInt(1, 4),
            createdAt: randomPastDate(),
        } as const;
    });
    const result = await prisma.review.createMany({ data });
    console.log(`Seed: inserted ${result.count} reviews.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
