import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORY_TAGS: Record<string, string[]> = {
  Hamburgueria: ['Hambúrguer', 'Casual', 'Para ir com amigos'],
  Pizzaria: ['Pizza', 'Para compartilhar', 'Família'],
  Italiana: ['Massas', 'Conforto', 'Jantar especial'],
  Padaria: ['Café da manhã', 'Rápido', 'Para o dia a dia'],
  Vegetariana: ['Vegetariano', 'Saudável'],
  Japonesa: ['Japonês', 'Sushi', 'Jantar'],
  Sobremesas: ['Sobremesas', 'Doce'],
  Bar: ['Drinks', 'Bar', 'Happy hour'],
  Cafeteria: ['Café', 'Trabalho remoto'],
  Brasileira: ['Brasileira', 'PF', 'Conforto'],
};

const GENERIC_TAGS = [
  'Pet friendly',
  'Ao ar livre',
  'Música ao vivo',
  'Romântico',
  'Ideal para grupos',
  'Ambiente silencioso',
];

function pickRandom<T>(arr: T[], max: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  const count = Math.min(max, copy.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function buildTagsForPlace(categoryName?: string | null): string[] {
  const tags = new Set<string>();

  if (categoryName && CATEGORY_TAGS[categoryName]) {
    CATEGORY_TAGS[categoryName].forEach((t) => tags.add(t));
  }

  // Adiciona de 0 a 2 tags genéricas randômicas
  const extra = pickRandom(GENERIC_TAGS, 2);
  extra.forEach((t) => tags.add(t));

  return Array.from(tags);
}

async function main() {
  const places = await prisma.place.findMany({
    include: {
      category: { select: { name: true } },
      tags: { select: { name: true } },
    },
  });

  console.log(`Encontrados ${places.length} lugares para taguear.`);

  for (const place of places) {
    const existingTagNames = new Set(place.tags.map((t) => t.name));
    const newTagNames = buildTagsForPlace(place.category?.name);
    const toAttach = newTagNames.filter((name) => !existingTagNames.has(name));

    if (!toAttach.length) continue;

    await prisma.place.update({
      where: { id: place.id },
      data: {
        tags: {
          connectOrCreate: toAttach.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    });

    console.log(
      `Lugar ${place.id} - ${place.name}: adicionadas tags [${toAttach.join(
        ', ',
      )}]`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


