// prisma/seed.ts
import { PrismaClient, PriceLevel } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // --- Categorias com estilo (emoji + cores) ---
  const categorySeed = [
    {
      name: 'Hamburgueria',
      emoji: '🍔',
      colorHex: '#FF5722',
      textColorHex: '#FFFFFF',
    }, // laranja forte
    { name: 'Bar', emoji: '🍻', colorHex: '#9C27B0', textColorHex: '#FFFFFF' }, // roxo vivo
    {
      name: 'Cafeteria',
      emoji: '☕',
      colorHex: '#3F51B5',
      textColorHex: '#FFFFFF',
    }, // azul intenso
    {
      name: 'Pizzaria',
      emoji: '🍕',
      colorHex: '#F44336',
      textColorHex: '#FFFFFF',
    }, // vermelho vivo
    {
      name: 'Sushi',
      emoji: '🍣',
      colorHex: '#FF9800',
      textColorHex: '#000000',
    }, // laranja amarelado
    {
      name: 'Churrascaria',
      emoji: '🥩',
      colorHex: '#E91E63',
      textColorHex: '#FFFFFF',
    }, // pink forte
    {
      name: 'Italiano',
      emoji: '🍝',
      colorHex: '#4CAF50',
      textColorHex: '#FFFFFF',
    }, // verde vibrante
    {
      name: 'Mexicano',
      emoji: '🌮',
      colorHex: '#CDDC39',
      textColorHex: '#000000',
    }, // verde limão
    {
      name: 'Vegano',
      emoji: '🥗',
      colorHex: '#00BCD4',
      textColorHex: '#FFFFFF',
    }, // azul turquesa
    {
      name: 'Padaria',
      emoji: '🥐',
      colorHex: '#FFC107',
      textColorHex: '#000000',
    }, // amarelo forte
  ];

  const catMap: Record<string, number> = {};
  for (const c of categorySeed) {
    const row = await prisma.category.upsert({
      where: { name: c.name },
      update: {
        emoji: c.emoji,
        colorHex: c.colorHex,
        textColorHex: c.textColorHex,
      },
      create: {
        name: c.name,
        emoji: c.emoji,
        colorHex: c.colorHex,
        textColorHex: c.textColorHex,
      },
    });
    catMap[row.name] = row.id;
  }

  // --- Places (mantidos do seu seed) ---
  const places: Array<{
    name: string;
    address: string;
    siteUrl?: string | null;
    phone?: string | null;
    priceLevel: PriceLevel;
    priceRange?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    category: string;
    imageUrl?: string | null;
    photos: string[];
    tags: string[];
    opening: {
      statusNow?: boolean | null;
      closesAt?: string | null;
      opensAt?: string | null;
      monday?: string | null;
      tuesday?: string | null;
      wednesday?: string | null;
      thursday?: string | null;
      friday?: string | null;
      saturday?: string | null;
      sunday?: string | null;
    };
  }> = [
    {
      name: 'Bar do Seu Osvaldo',
      address: 'Rua Americana, 123, Vila Buarque, São Paulo',
      siteUrl: 'https://exemplo.com/osvaldo',
      phone: '(11) 98765-4321',
      priceLevel: PriceLevel.THREE,
      priceRange: 'R$ 40 - 60',
      latitude: -23.5489,
      longitude: -46.6388,
      category: 'Hamburgueria',
      imageUrl: 'https://picsum.photos/id/163/600/400',
      photos: ['https://picsum.photos/id/164/600/400'],
      tags: ['Hambúrguer', 'Custo-benefício'],
      opening: {
        statusNow: true,
        closesAt: '23h',
        monday: '18h - 23h',
        tuesday: '18h - 23h',
        wednesday: '18h - 23h',
        thursday: '12h - 15h, 18h - 23h',
        friday: '12h - 15h, 18h - 00h',
        saturday: '12h - 00h',
        sunday: 'Fechado',
      },
    },
    {
      name: 'Bramble Bar',
      address: 'Av. Paulista, 1000, São Paulo',
      siteUrl: 'https://exemplo.com/bramble',
      phone: '(11) 90000-0001',
      priceLevel: PriceLevel.TWO,
      priceRange: 'R$ 30 - 70',
      latitude: -23.5614,
      longitude: -46.6559,
      category: 'Bar',
      imageUrl: 'https://picsum.photos/id/165/600/400',
      photos: ['https://picsum.photos/id/166/600/400'],
      tags: ['Drinks', 'Autorais'],
      opening: {
        statusNow: true,
        closesAt: '02h',
        monday: 'Fechado',
        tuesday: '18h - 02h',
        wednesday: '18h - 02h',
        thursday: '18h - 02h',
        friday: '18h - 03h',
        saturday: '18h - 03h',
        sunday: '18h - 00h',
      },
    },
    {
      name: 'Café Aurora',
      address: 'Rua Augusta, 2500, São Paulo',
      siteUrl: 'https://exemplo.com/aurora',
      phone: '(11) 90000-0002',
      priceLevel: PriceLevel.ONE,
      priceRange: 'R$ 15 - 35',
      latitude: -23.555,
      longitude: -46.649,
      category: 'Cafeteria',
      imageUrl: 'https://picsum.photos/id/167/600/400',
      photos: ['https://picsum.photos/id/168/600/400'],
      tags: ['Café especial', 'Brunch'],
      opening: {
        statusNow: true,
        closesAt: '20h',
        monday: '08h - 20h',
        tuesday: '08h - 20h',
        wednesday: '08h - 20h',
        thursday: '08h - 20h',
        friday: '08h - 20h',
        saturday: '09h - 18h',
        sunday: '09h - 16h',
      },
    },
    {
      name: 'Bella Pizza',
      address: 'Rua da Consolação, 321, São Paulo',
      siteUrl: 'https://exemplo.com/bellapizza',
      phone: '(11) 90000-0003',
      priceLevel: PriceLevel.TWO,
      priceRange: 'R$ 40 - 80',
      latitude: -23.554,
      longitude: -46.661,
      category: 'Pizzaria',
      imageUrl: 'https://picsum.photos/id/169/600/400',
      photos: ['https://picsum.photos/id/170/600/400'],
      tags: ['Forno a lenha', 'Família'],
      opening: {
        statusNow: true,
        closesAt: '23h',
        monday: '18h - 23h',
        tuesday: '18h - 23h',
        wednesday: '18h - 23h',
        thursday: '18h - 23h',
        friday: '18h - 00h',
        saturday: '18h - 00h',
        sunday: '18h - 23h',
      },
    },
    {
      name: 'Sushi Nami',
      address: 'Rua Haddock Lobo, 120, São Paulo',
      siteUrl: 'https://exemplo.com/sushinami',
      phone: '(11) 90000-0004',
      priceLevel: PriceLevel.THREE,
      priceRange: 'R$ 80 - 140',
      latitude: -23.561,
      longitude: -46.668,
      category: 'Sushi',
      imageUrl: 'https://picsum.photos/id/171/600/400',
      photos: ['https://picsum.photos/id/172/600/400'],
      tags: ['Rodízio', 'A la carte'],
      opening: {
        statusNow: false,
        opensAt: '18h',
        monday: '18h - 23h',
        tuesday: '18h - 23h',
        wednesday: '18h - 23h',
        thursday: '18h - 23h',
        friday: '18h - 00h',
        saturday: '12h - 16h, 18h - 00h',
        sunday: '12h - 16h, 18h - 22h',
      },
    },
    {
      name: 'Fogo & Brasa',
      address: 'Av. Ipiranga, 200, São Paulo',
      siteUrl: 'https://exemplo.com/fogoebrasa',
      phone: '(11) 90000-0005',
      priceLevel: PriceLevel.FOUR,
      priceRange: 'R$ 120 - 250',
      latitude: -23.545,
      longitude: -46.638,
      category: 'Churrascaria',
      imageUrl: 'https://picsum.photos/id/173/600/400',
      photos: ['https://picsum.photos/id/174/600/400'],
      tags: ['Carnes', 'Rodízio'],
      opening: {
        statusNow: true,
        closesAt: '23h',
        monday: '12h - 15h, 18h - 23h',
        tuesday: '12h - 15h, 18h - 23h',
        wednesday: '12h - 15h, 18h - 23h',
        thursday: '12h - 15h, 18h - 23h',
        friday: '12h - 15h, 18h - 23h',
        saturday: '12h - 23h',
        sunday: '12h - 22h',
      },
    },
    {
      name: 'Trattoria Roma',
      address: 'Rua Frei Caneca, 555, São Paulo',
      siteUrl: 'https://exemplo.com/roma',
      phone: '(11) 90000-0006',
      priceLevel: PriceLevel.THREE,
      priceRange: 'R$ 70 - 130',
      latitude: -23.555,
      longitude: -46.652,
      category: 'Italiano',
      imageUrl: 'https://picsum.photos/id/175/600/400',
      photos: ['https://picsum.photos/id/176/600/400'],
      tags: ['Massas', 'Vinho'],
      opening: {
        statusNow: true,
        closesAt: '23h',
        monday: '12h - 15h, 18h - 23h',
        tuesday: '12h - 15h, 18h - 23h',
        wednesday: '12h - 15h, 18h - 23h',
        thursday: '12h - 15h, 18h - 23h',
        friday: '12h - 15h, 18h - 23h',
        saturday: '12h - 23h',
        sunday: '12h - 22h',
      },
    },
    {
      name: 'La Frontera',
      address: 'Rua dos Pinheiros, 400, São Paulo',
      siteUrl: 'https://exemplo.com/frontera',
      phone: '(11) 90000-0007',
      priceLevel: PriceLevel.TWO,
      priceRange: 'R$ 40 - 90',
      latitude: -23.567,
      longitude: -46.676,
      category: 'Mexicano',
      imageUrl: 'https://picsum.photos/id/177/600/400',
      photos: ['https://picsum.photos/id/178/600/400'],
      tags: ['Tacos', 'Apimentado'],
      opening: {
        statusNow: true,
        closesAt: '23h',
        monday: '18h - 23h',
        tuesday: '18h - 23h',
        wednesday: '18h - 23h',
        thursday: '18h - 23h',
        friday: '18h - 00h',
        saturday: '12h - 00h',
        sunday: '12h - 22h',
      },
    },
    {
      name: 'Verde Vida',
      address: 'Rua Cardeal Arcoverde, 800, São Paulo',
      siteUrl: 'https://exemplo.com/verdevida',
      phone: '(11) 90000-0008',
      priceLevel: PriceLevel.TWO,
      priceRange: 'R$ 35 - 75',
      latitude: -23.5675,
      longitude: -46.684,
      category: 'Vegano',
      imageUrl: 'https://picsum.photos/id/179/600/400',
      photos: ['https://picsum.photos/id/180/600/400'],
      tags: ['Vegano', 'Orgânico'],
      opening: {
        statusNow: false,
        opensAt: '11h',
        monday: '11h - 20h',
        tuesday: '11h - 20h',
        wednesday: '11h - 20h',
        thursday: '11h - 20h',
        friday: '11h - 21h',
        saturday: '11h - 21h',
        sunday: 'Fechado',
      },
    },
    {
      name: 'Padaria Santa Clara',
      address: 'Rua Teodoro Sampaio, 900, São Paulo',
      siteUrl: 'https://exemplo.com/santaclara',
      phone: '(11) 90000-0009',
      priceLevel: PriceLevel.ONE,
      priceRange: 'R$ 10 - 30',
      latitude: -23.566,
      longitude: -46.6805,
      category: 'Padaria',
      imageUrl: 'https://picsum.photos/id/181/600/400',
      photos: ['https://picsum.photos/id/182/600/400'],
      tags: ['Pães', 'Café da manhã'],
      opening: {
        statusNow: true,
        closesAt: '22h',
        monday: '06h - 22h',
        tuesday: '06h - 22h',
        wednesday: '06h - 22h',
        thursday: '06h - 22h',
        friday: '06h - 22h',
        saturday: '06h - 22h',
        sunday: '06h - 18h',
      },
    },
  ];

  const created: string[] = [];
  for (const p of places) {
    const exists = await prisma.place.findFirst({
      where: { name: p.name, address: p.address },
      select: { id: true },
    });
    if (exists) continue;

    const place = await prisma.place.create({
      data: {
        name: p.name,
        address: p.address,
        siteUrl: p.siteUrl,
        phone: p.phone,
        priceLevel: p.priceLevel,
        priceRange: p.priceRange,
        latitude: p.latitude,
        longitude: p.longitude,
        categoryId: catMap[p.category],
        imageUrl: p.imageUrl,
        tags: {
          connectOrCreate: p.tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        photos: { create: p.photos.map((url) => ({ url })) },
        openingHours: { create: { ...p.opening } },
      },
    });

    created.push(`${place.id} - ${place.name}`);
  }

  if (created.length) console.table(created);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
