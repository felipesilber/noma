import { PrismaClient, Weekday, ActivityType } from '@prisma/client';

const prisma = new PrismaClient();

type InputPlace = {
  name: string;
  description: string | null;
  address: string;
  imageUrl: string | null;
  siteUrl: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
  priceInfo: string | null;
  category: string;
  openingHours: { dayOfWeek: Weekday | string; openTime: string; closeTime: string }[];
};

const DATA: InputPlace[] = [
  {
    name: 'Bullguer Pinheiros',
    description: 'Hamburgueria de smash burgers em ambiente casual.',
    address: 'Rua Fradique Coutinho, 1136 - Pinheiros, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5615,
    longitude: -46.6925,
    priceInfo: 'R$ 45-70 por pessoa',
    category: 'Hamburgueria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '12:00', closeTime: '23:00' },
      { dayOfWeek: 'TUE', openTime: '12:00', closeTime: '23:00' },
      { dayOfWeek: 'WED', openTime: '12:00', closeTime: '23:00' },
      { dayOfWeek: 'THU', openTime: '12:00', closeTime: '23:30' },
      { dayOfWeek: 'FRI', openTime: '12:00', closeTime: '00:30' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '00:30' },
      { dayOfWeek: 'SUN', openTime: '12:00', closeTime: '22:30' },
    ],
  },
  {
    name: 'Joakin’s Itaim',
    description: 'Hamburgueria clássica com lanches generosos e milk-shakes.',
    address: 'Rua Joaquim Floriano, 163 - Itaim Bibi, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5802,
    longitude: -46.6734,
    priceInfo: 'R$ 50-80 por pessoa',
    category: 'Hamburgueria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '11:30', closeTime: '23:00' },
      { dayOfWeek: 'TUE', openTime: '11:30', closeTime: '23:00' },
      { dayOfWeek: 'WED', openTime: '11:30', closeTime: '23:00' },
      { dayOfWeek: 'THU', openTime: '11:30', closeTime: '23:30' },
      { dayOfWeek: 'FRI', openTime: '11:30', closeTime: '00:30' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '00:30' },
      { dayOfWeek: 'SUN', openTime: '12:00', closeTime: '22:30' },
    ],
  },
  {
    name: 'Vila Burger Vila Madalena',
    description: 'Hamburgueria artesanal com pegada de bar de bairro.',
    address: 'Rua Aspicuelta, 250 - Vila Madalena, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5558,
    longitude: -46.6913,
    priceInfo: 'R$ 45-75 por pessoa',
    category: 'Hamburgueria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '17:00', closeTime: '23:00' },
      { dayOfWeek: 'TUE', openTime: '17:00', closeTime: '23:00' },
      { dayOfWeek: 'WED', openTime: '17:00', closeTime: '23:30' },
      { dayOfWeek: 'THU', openTime: '17:00', closeTime: '23:30' },
      { dayOfWeek: 'FRI', openTime: '17:00', closeTime: '01:00' },
      { dayOfWeek: 'SAT', openTime: '13:00', closeTime: '01:00' },
      { dayOfWeek: 'SUN', openTime: '13:00', closeTime: '22:30' },
    ],
  },
  {
    name: 'Bráz Pizzaria Higienópolis',
    description: 'Pizzaria tradicional com massa de longa fermentação.',
    address: 'Rua Sergipe, 406 - Higienópolis, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5487,
    longitude: -46.6548,
    priceInfo: 'R$ 70-120 por pessoa',
    category: 'Pizzaria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '18:00', closeTime: '23:30' },
      { dayOfWeek: 'TUE', openTime: '18:00', closeTime: '23:30' },
      { dayOfWeek: 'WED', openTime: '18:00', closeTime: '23:30' },
      { dayOfWeek: 'THU', openTime: '18:00', closeTime: '00:00' },
      { dayOfWeek: 'FRI', openTime: '18:00', closeTime: '00:30' },
      { dayOfWeek: 'SAT', openTime: '18:00', closeTime: '00:30' },
      { dayOfWeek: 'SUN', openTime: '18:00', closeTime: '23:30' },
    ],
  },
  {
    name: 'Carlos Pizza Vila Madalena',
    description: 'Pizzaria com pegada napolitana e ambiente descolado.',
    address: 'Rua Harmonia, 501 - Vila Madalena, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5582,
    longitude: -46.6904,
    priceInfo: 'R$ 60-110 por pessoa',
    category: 'Pizzaria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '18:00', closeTime: '23:30' },
      { dayOfWeek: 'TUE', openTime: '18:00', closeTime: '23:30' },
      { dayOfWeek: 'WED', openTime: '18:00', closeTime: '23:30' },
      { dayOfWeek: 'THU', openTime: '18:00', closeTime: '00:00' },
      { dayOfWeek: 'FRI', openTime: '18:00', closeTime: '00:30' },
      { dayOfWeek: 'SAT', openTime: '18:00', closeTime: '00:30' },
      { dayOfWeek: 'SUN', openTime: '18:00', closeTime: '23:30' },
    ],
  },
  {
    name: 'Pizzaria Da Vila Moema',
    description: 'Pizzaria de forno a lenha com ambiente familiar.',
    address: 'Alameda dos Nhambiquaras, 1200 - Moema, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.6083,
    longitude: -46.6641,
    priceInfo: 'R$ 60-100 por pessoa',
    category: 'Pizzaria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '18:00', closeTime: '23:00' },
      { dayOfWeek: 'TUE', openTime: '18:00', closeTime: '23:00' },
      { dayOfWeek: 'WED', openTime: '18:00', closeTime: '23:00' },
      { dayOfWeek: 'THU', openTime: '18:00', closeTime: '23:30' },
      { dayOfWeek: 'FRI', openTime: '18:00', closeTime: '00:30' },
      { dayOfWeek: 'SAT', openTime: '18:00', closeTime: '00:30' },
      { dayOfWeek: 'SUN', openTime: '18:00', closeTime: '23:00' },
    ],
  },
  {
    name: 'Famiglia Italiana Jardins',
    description: 'Trattoria italiana com massas artesanais e clima aconchegante.',
    address: 'Rua Haddock Lobo, 900 - Jardins, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5619,
    longitude: -46.6662,
    priceInfo: 'R$ 90-150 por pessoa',
    category: 'Italiana',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'MON', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'TUE', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'WED', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'THU', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '19:00', closeTime: '23:30' },
      { dayOfWeek: 'FRI', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '19:00', closeTime: '00:00' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '16:00' },
      { dayOfWeek: 'SAT', openTime: '19:00', closeTime: '00:00' },
      { dayOfWeek: 'SUN', openTime: '12:00', closeTime: '17:00' },
    ],
  },
  {
    name: 'Trattoria da Vila Pinheiros',
    description: 'Cozinha italiana clássica com pratos generosos.',
    address: 'Rua dos Pinheiros, 900 - Pinheiros, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5651,
    longitude: -46.6793,
    priceInfo: 'R$ 80-140 por pessoa',
    category: 'Italiana',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'MON', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'TUE', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'WED', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'THU', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '19:00', closeTime: '23:30' },
      { dayOfWeek: 'FRI', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '19:00', closeTime: '00:00' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '16:00' },
      { dayOfWeek: 'SAT', openTime: '19:00', closeTime: '00:00' },
      { dayOfWeek: 'SUN', openTime: '12:00', closeTime: '17:00' },
    ],
  },
  {
    name: 'Cantina Moema',
    description: 'Cantina italiana tradicional, ambiente familiar.',
    address: 'Alameda dos Arapanés, 900 - Moema, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.6052,
    longitude: -46.6667,
    priceInfo: 'R$ 70-130 por pessoa',
    category: 'Italiana',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'MON', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'TUE', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'WED', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'THU', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '19:00', closeTime: '23:30' },
      { dayOfWeek: 'FRI', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '19:00', closeTime: '23:30' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '16:00' },
      { dayOfWeek: 'SAT', openTime: '19:00', closeTime: '23:30' },
      { dayOfWeek: 'SUN', openTime: '12:00', closeTime: '17:00' },
    ],
  },
  {
    name: 'Padaria Vila Mariana',
    description: 'Padaria de bairro com pães, lanches e café da manhã.',
    address: 'Rua Domingos de Morais, 2200 - Vila Mariana, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5953,
    longitude: -46.6364,
    priceInfo: 'R$ 20-40 por pessoa',
    category: 'Padaria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'TUE', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'WED', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'THU', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'FRI', openTime: '06:00', closeTime: '23:00' },
      { dayOfWeek: 'SAT', openTime: '06:00', closeTime: '23:00' },
      { dayOfWeek: 'SUN', openTime: '07:00', closeTime: '22:00' },
    ],
  },
  {
    name: 'Padaria Pinheiros',
    description: 'Padaria com vitrine de doces e pães artesanais.',
    address: 'Rua Teodoro Sampaio, 1500 - Pinheiros, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5611,
    longitude: -46.6807,
    priceInfo: 'R$ 20-40 por pessoa',
    category: 'Padaria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'TUE', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'WED', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'THU', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'FRI', openTime: '06:00', closeTime: '23:00' },
      { dayOfWeek: 'SAT', openTime: '06:00', closeTime: '23:00' },
      { dayOfWeek: 'SUN', openTime: '07:00', closeTime: '22:00' },
    ],
  },
  {
    name: 'Padaria Moema',
    description: 'Padaria com café da manhã e lanches rápidos.',
    address: 'Alameda dos Maracatins, 900 - Moema, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.6091,
    longitude: -46.6602,
    priceInfo: 'R$ 20-35 por pessoa',
    category: 'Padaria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'TUE', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'WED', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'THU', openTime: '06:00', closeTime: '22:00' },
      { dayOfWeek: 'FRI', openTime: '06:00', closeTime: '23:00' },
      { dayOfWeek: 'SAT', openTime: '06:00', closeTime: '23:00' },
      { dayOfWeek: 'SUN', openTime: '07:00', closeTime: '22:00' },
    ],
  },
  {
    name: 'Green Garden Jardins',
    description: 'Restaurante vegetariano com buffet e opções veganas.',
    address: 'Alameda Santos, 1600 - Jardins, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5673,
    longitude: -46.6551,
    priceInfo: 'R$ 50-80 por pessoa',
    category: 'Vegetariana',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '11:30', closeTime: '15:00' },
    ],
  },
  {
    name: 'Veg & Co Pinheiros',
    description: 'Cozinha vegetariana contemporânea com bowls e pratos criativos.',
    address: 'Rua Artur de Azevedo, 900 - Pinheiros, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5655,
    longitude: -46.6801,
    priceInfo: 'R$ 50-90 por pessoa',
    category: 'Vegetariana',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '16:00' },
    ],
  },
  {
    name: 'Vila Vegana Vila Mariana',
    description: 'Restaurante vegano com pratos do dia e sobremesas.',
    address: 'Rua França Pinto, 700 - Vila Mariana, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5927,
    longitude: -46.6368,
    priceInfo: 'R$ 40-70 por pessoa',
    category: 'Vegetariana',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '16:00' },
    ],
  },
  {
    name: 'Doce & Cia Jardins',
    description: 'Doceria com tortas, bolos e cafés.',
    address: 'Rua Augusta, 2700 - Jardins, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5547,
    longitude: -46.659,
    priceInfo: 'R$ 25-50 por pessoa',
    category: 'Sobremesas',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '10:00', closeTime: '20:00' },
      { dayOfWeek: 'TUE', openTime: '10:00', closeTime: '20:00' },
      { dayOfWeek: 'WED', openTime: '10:00', closeTime: '20:00' },
      { dayOfWeek: 'THU', openTime: '10:00', closeTime: '20:00' },
      { dayOfWeek: 'FRI', openTime: '10:00', closeTime: '21:00' },
      { dayOfWeek: 'SAT', openTime: '10:00', closeTime: '21:00' },
      { dayOfWeek: 'SUN', openTime: '11:00', closeTime: '19:00' },
    ],
  },
  {
    name: 'Casa do Gelato Pinheiros',
    description: 'Gelateria com sabores tradicionais e autorais.',
    address: 'Rua dos Pinheiros, 500 - Pinheiros, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5641,
    longitude: -46.6775,
    priceInfo: 'R$ 20-40 por pessoa',
    category: 'Sobremesas',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '12:00', closeTime: '22:00' },
      { dayOfWeek: 'TUE', openTime: '12:00', closeTime: '22:00' },
      { dayOfWeek: 'WED', openTime: '12:00', closeTime: '22:00' },
      { dayOfWeek: 'THU', openTime: '12:00', closeTime: '22:00' },
      { dayOfWeek: 'FRI', openTime: '12:00', closeTime: '23:00' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '23:00' },
      { dayOfWeek: 'SUN', openTime: '12:00', closeTime: '22:00' },
    ],
  },
  {
    name: 'Sweet Spot Moema',
    description: 'Loja de brownies, cookies e sobremesas individuais.',
    address: 'Alameda dos Arapanés, 600 - Moema, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.6059,
    longitude: -46.665,
    priceInfo: 'R$ 20-35 por pessoa',
    category: 'Sobremesas',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '11:00', closeTime: '20:00' },
      { dayOfWeek: 'TUE', openTime: '11:00', closeTime: '20:00' },
      { dayOfWeek: 'WED', openTime: '11:00', closeTime: '20:00' },
      { dayOfWeek: 'THU', openTime: '11:00', closeTime: '20:00' },
      { dayOfWeek: 'FRI', openTime: '11:00', closeTime: '21:00' },
      { dayOfWeek: 'SAT', openTime: '11:00', closeTime: '21:00' },
      { dayOfWeek: 'SUN', openTime: '12:00', closeTime: '19:00' },
    ],
  },
  {
    name: 'Bar do Centro',
    description: 'Bar tradicional com chope gelado e petiscos.',
    address: 'Rua Araújo, 200 - República, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.542,
    longitude: -46.6422,
    priceInfo: 'R$ 40-80 por pessoa',
    category: 'Bar',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '17:00', closeTime: '23:30' },
      { dayOfWeek: 'TUE', openTime: '17:00', closeTime: '23:30' },
      { dayOfWeek: 'WED', openTime: '17:00', closeTime: '23:30' },
      { dayOfWeek: 'THU', openTime: '17:00', closeTime: '00:00' },
      { dayOfWeek: 'FRI', openTime: '17:00', closeTime: '01:00' },
      { dayOfWeek: 'SAT', openTime: '16:00', closeTime: '01:00' },
    ],
  },
  {
    name: 'Bar da Vila',
    description: 'Bar de esquina na Vila Madalena com música e caipirinhas.',
    address: 'Rua Mourato Coelho, 500 - Vila Madalena, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5561,
    longitude: -46.6899,
    priceInfo: 'R$ 50-90 por pessoa',
    category: 'Bar',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '17:00', closeTime: '23:30' },
      { dayOfWeek: 'TUE', openTime: '17:00', closeTime: '23:30' },
      { dayOfWeek: 'WED', openTime: '17:00', closeTime: '23:30' },
      { dayOfWeek: 'THU', openTime: '17:00', closeTime: '00:00' },
      { dayOfWeek: 'FRI', openTime: '17:00', closeTime: '01:30' },
      { dayOfWeek: 'SAT', openTime: '16:00', closeTime: '01:30' },
    ],
  },
  {
    name: 'Bar Itaim',
    description: 'Bar para happy hour com drinks autorais.',
    address: 'Rua João Cachoeira, 700 - Itaim Bibi, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5862,
    longitude: -46.6757,
    priceInfo: 'R$ 60-100 por pessoa',
    category: 'Bar',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '17:00', closeTime: '23:30' },
      { dayOfWeek: 'TUE', openTime: '17:00', closeTime: '23:30' },
      { dayOfWeek: 'WED', openTime: '17:00', closeTime: '23:30' },
      { dayOfWeek: 'THU', openTime: '17:00', closeTime: '00:00' },
      { dayOfWeek: 'FRI', openTime: '17:00', closeTime: '01:30' },
      { dayOfWeek: 'SAT', openTime: '16:00', closeTime: '01:30' },
    ],
  },
  {
    name: 'Café Paulista Consolação',
    description: 'Cafeteria com cafés especiais e lanches leves.',
    address: 'Rua da Consolação, 2500 - Consolação, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5521,
    longitude: -46.6565,
    priceInfo: 'R$ 20-35 por pessoa',
    category: 'Cafeteria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '08:00', closeTime: '20:00' },
      { dayOfWeek: 'TUE', openTime: '08:00', closeTime: '20:00' },
      { dayOfWeek: 'WED', openTime: '08:00', closeTime: '20:00' },
      { dayOfWeek: 'THU', openTime: '08:00', closeTime: '20:00' },
      { dayOfWeek: 'FRI', openTime: '08:00', closeTime: '21:00' },
      { dayOfWeek: 'SAT', openTime: '09:00', closeTime: '21:00' },
      { dayOfWeek: 'SUN', openTime: '09:00', closeTime: '19:00' },
    ],
  },
  {
    name: 'Café da Vila',
    description: 'Cafeteria pequena e aconchegante com brunch.',
    address: 'Rua Harmonia, 300 - Vila Madalena, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5572,
    longitude: -46.6911,
    priceInfo: 'R$ 25-45 por pessoa',
    category: 'Cafeteria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '09:00', closeTime: '19:00' },
      { dayOfWeek: 'TUE', openTime: '09:00', closeTime: '19:00' },
      { dayOfWeek: 'WED', openTime: '09:00', closeTime: '19:00' },
      { dayOfWeek: 'THU', openTime: '09:00', closeTime: '19:00' },
      { dayOfWeek: 'FRI', openTime: '09:00', closeTime: '20:00' },
      { dayOfWeek: 'SAT', openTime: '09:00', closeTime: '20:00' },
      { dayOfWeek: 'SUN', openTime: '09:00', closeTime: '18:00' },
    ],
  },
  {
    name: 'Cafeteria Moema',
    description: 'Cafés filtrados, espressos e bolos caseiros.',
    address: 'Alameda dos Jurupis, 800 - Moema, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.6061,
    longitude: -46.6617,
    priceInfo: 'R$ 20-40 por pessoa',
    category: 'Cafeteria',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '08:00', closeTime: '20:00' },
      { dayOfWeek: 'TUE', openTime: '08:00', closeTime: '20:00' },
      { dayOfWeek: 'WED', openTime: '08:00', closeTime: '20:00' },
      { dayOfWeek: 'THU', openTime: '08:00', closeTime: '20:00' },
      { dayOfWeek: 'FRI', openTime: '08:00', closeTime: '21:00' },
      { dayOfWeek: 'SAT', openTime: '09:00', closeTime: '21:00' },
      { dayOfWeek: 'SUN', openTime: '09:00', closeTime: '19:00' },
    ],
  },
  {
    name: 'Sabor Brasil Pinheiros',
    description: 'Restaurante de cozinha brasileira com PF e especiais do dia.',
    address: 'Rua Cardeal Arcoverde, 2000 - Pinheiros, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5639,
    longitude: -46.6819,
    priceInfo: 'R$ 35-60 por pessoa',
    category: 'Brasileira',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '11:00', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '11:00', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '11:00', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '11:00', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '11:00', closeTime: '15:00' },
      { dayOfWeek: 'SAT', openTime: '11:30', closeTime: '15:30' },
    ],
  },
  {
    name: 'Casa Nordestina Vila Mariana',
    description: 'Comida nordestina com baião, carne de sol e sobremesas típicas.',
    address: 'Rua Domingos de Morais, 3000 - Vila Mariana, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.6005,
    longitude: -46.6352,
    priceInfo: 'R$ 50-80 por pessoa',
    category: 'Brasileira',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '11:30', closeTime: '15:00' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '16:00' },
      { dayOfWeek: 'SUN', openTime: '12:00', closeTime: '16:00' },
    ],
  },
  {
    name: 'Cantinho Mineiro Centro',
    description: 'Pratos típicos mineiros com fogão a lenha.',
    address: 'Rua 7 de Abril, 300 - República, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5462,
    longitude: -46.6421,
    priceInfo: 'R$ 40-70 por pessoa',
    category: 'Brasileira',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '11:00', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '11:00', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '11:00', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '11:00', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '11:00', closeTime: '15:00' },
      { dayOfWeek: 'SAT', openTime: '11:30', closeTime: '15:30' },
    ],
  },
  {
    name: 'Sushi Vila Madalena',
    description: 'Restaurante japonês com combinados e temakis.',
    address: 'Rua Wisard, 300 - Vila Madalena, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5568,
    longitude: -46.689,
    priceInfo: 'R$ 70-130 por pessoa',
    category: 'Japonesa',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'MON', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'TUE', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'WED', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'THU', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '19:00', closeTime: '23:30' },
      { dayOfWeek: 'FRI', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '19:00', closeTime: '00:00' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '16:00' },
      { dayOfWeek: 'SAT', openTime: '19:00', closeTime: '00:00' },
      { dayOfWeek: 'SUN', openTime: '12:00', closeTime: '16:00' },
    ],
  },
  {
    name: 'Sushi Itaim',
    description: 'Japonês moderno com opções à la carte e rodízio.',
    address: 'Rua Jesuíno Arruda, 900 - Itaim Bibi, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5821,
    longitude: -46.6721,
    priceInfo: 'R$ 90-160 por pessoa',
    category: 'Japonesa',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'MON', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'TUE', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'WED', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'THU', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '19:00', closeTime: '23:30' },
      { dayOfWeek: 'FRI', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '19:00', closeTime: '00:00' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '16:00' },
      { dayOfWeek: 'SAT', openTime: '19:00', closeTime: '00:00' },
      { dayOfWeek: 'SUN', openTime: '12:00', closeTime: '16:00' },
    ],
  },
  {
    name: 'Sushi Paulista Bela Vista',
    description: 'Restaurante japonês próximo à Paulista, com combinados variados.',
    address: 'Rua Treze de Maio, 600 - Bela Vista, São Paulo - SP',
    imageUrl: null,
    siteUrl: null,
    phone: null,
    latitude: -23.5652,
    longitude: -46.6441,
    priceInfo: 'R$ 70-130 por pessoa',
    category: 'Japonesa',
    openingHours: [
      { dayOfWeek: 'MON', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'MON', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'TUE', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'TUE', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'WED', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'WED', openTime: '19:00', closeTime: '23:00' },
      { dayOfWeek: 'THU', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'THU', openTime: '19:00', closeTime: '23:30' },
      { dayOfWeek: 'FRI', openTime: '12:00', closeTime: '15:00' },
      { dayOfWeek: 'FRI', openTime: '19:00', closeTime: '00:00' },
      { dayOfWeek: 'SAT', openTime: '12:00', closeTime: '16:00' },
      { dayOfWeek: 'SAT', openTime: '19:00', closeTime: '00:00' },
      { dayOfWeek: 'SUN', openTime: '12:00', closeTime: '16:00' },
    ],
  },
];

async function ensureCategory(name: string) {
  const found = await prisma.category.findUnique({ where: { name } });
  if (found) return found;
  return prisma.category.create({ data: { name } });
}

async function upsertPlaceWithHours(input: InputPlace) {
  const category = await ensureCategory(input.category);

  // Find place by exact name + address to avoid duplicates
  const existing = await prisma.place.findFirst({
    where: { name: input.name, address: input.address },
  });

  const place =
    existing ??
    (await prisma.place.create({
      data: {
        name: input.name,
        description: input.description ?? undefined,
        address: input.address,
        imageUrl: input.imageUrl ?? undefined,
        siteUrl: input.siteUrl ?? undefined,
        phone: input.phone ?? undefined,
        latitude: input.latitude,
        longitude: input.longitude,
        priceInfo: input.priceInfo ?? undefined,
        category: { connect: { id: category.id } },
      },
    }));

  // If exists, update fields and category relation
  if (existing) {
    await prisma.place.update({
      where: { id: existing.id },
      data: {
        description: input.description ?? undefined,
        imageUrl: input.imageUrl ?? undefined,
        siteUrl: input.siteUrl ?? undefined,
        phone: input.phone ?? undefined,
        latitude: input.latitude,
        longitude: input.longitude,
        priceInfo: input.priceInfo ?? undefined,
        category: { connect: { id: category.id } },
      },
    });
  }

  // Replace opening hours for this place
  await prisma.openingHourRule.deleteMany({ where: { placeId: place.id } });
  if (input.openingHours?.length) {
    await prisma.openingHourRule.createMany({
      data: input.openingHours.map((oh) => ({
        placeId: place.id,
        dayOfWeek: (oh.dayOfWeek as Weekday),
        openTime: oh.openTime,
        closeTime: oh.closeTime,
      })),
    });
  }

  return place;
}

type InputUser = {
  firebaseUid: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
};

const USERS: InputUser[] = [
  { firebaseUid: 'seed-uid-001', username: 'alice', email: 'alice@example.com' },
  { firebaseUid: 'seed-uid-002', username: 'bruno', email: 'bruno@example.com' },
  { firebaseUid: 'seed-uid-003', username: 'carol', email: 'carol@example.com' },
  { firebaseUid: 'seed-uid-004', username: 'diego', email: 'diego@example.com' },
  { firebaseUid: 'seed-uid-005', username: 'erika', email: 'erika@example.com' },
  { firebaseUid: 'seed-uid-006', username: 'felipe', email: 'felipe@example.com' },
  { firebaseUid: 'seed-uid-007', username: 'gabi', email: 'gabi@example.com' },
  { firebaseUid: 'seed-uid-008', username: 'henrique', email: 'henrique@example.com' },
  { firebaseUid: 'seed-uid-009', username: 'isabela', email: 'isabela@example.com' },
  { firebaseUid: 'seed-uid-010', username: 'joao', email: 'joao@example.com' },
];

async function ensureUser(u: InputUser) {
  const found = await prisma.user.findUnique({ where: { firebaseUid: u.firebaseUid } });
  if (found) return found;
  return prisma.user.create({
    data: {
      firebaseUid: u.firebaseUid,
      username: u.username,
      email: u.email,
      avatarUrl: u.avatarUrl ?? null,
    },
  });
}

async function seedUsers(): Promise<number[]> {
  const created: number[] = [];
  for (const u of USERS) {
    const user = await ensureUser(u);
    created.push(user.id);
  }
  return created;
}

async function seedFollows(userIds: number[]) {
  // Simple ring follow pattern: each user follows next two users
  const pairs: { followerId: number; followedId: number }[] = [];
  const n = userIds.length;
  for (let i = 0; i < n; i++) {
    const a = userIds[i];
    const b = userIds[(i + 1) % n];
    const c = userIds[(i + 2) % n];
    if (a !== b) pairs.push({ followerId: a, followedId: b });
    if (a !== c) pairs.push({ followerId: a, followedId: c });
  }
  if (pairs.length) {
    await prisma.follow.createMany({ data: pairs, skipDuplicates: true });
  }
}

async function upsertList(userId: number, name: string, description?: string) {
  return prisma.list.upsert({
    where: { userId_name: { userId, name } },
    update: { description },
    create: { userId, name, description },
  });
}

async function addListItems(listId: number, placeIds: number[]) {
  const items = placeIds.map((pid, idx) => ({ listId, placeId: pid, order: idx + 1 }));
  if (items.length) {
    await prisma.listItem.createMany({ data: items, skipDuplicates: true });
  }
}

function getRandomSubset<T>(arr: T[], maxItems: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  const count = Math.min(maxItems, copy.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCommentSeed(i: number): string | null {
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
  return Math.random() < 0.8 ? comments[i % comments.length] : null;
}

function randomPriceSeed(): string {
  const cents = randomBetween(0, 99).toString().padStart(2, '0');
  return `${randomBetween(30, 180)}.${cents}`;
}

function randomPastDateSeed(daysBack = 180): Date {
  const now = new Date();
  const offsetDays = randomBetween(0, daysBack);
  const d = new Date(now);
  d.setDate(now.getDate() - offsetDays);
  d.setHours(randomBetween(10, 22), randomBetween(0, 59), randomBetween(0, 59), 0);
  return d;
}

async function seedListsAndItems(userIds: number[], placeIds: number[]) {
  for (const userId of userIds) {
    const favoritos = await upsertList(userId, 'Favoritos', 'Meus lugares preferidos');
    const quero = await upsertList(userId, 'Quero conhecer', 'Lista de desejos');

    const favPlaces = getRandomSubset(placeIds, 5);
    const queroPlaces = getRandomSubset(placeIds, 6);

    await addListItems(favoritos.id, favPlaces);
    await addListItems(quero.id, queroPlaces);

    // Activity: CREATED_LIST for first creation only (upsert may "update")
    // We check if there is any activity for this list; if none, create.
    const existingActFav = await prisma.activity.findFirst({ where: { listId: favoritos.id, type: ActivityType.CREATED_LIST } });
    if (!existingActFav) {
      await prisma.activity.create({
        data: { type: ActivityType.CREATED_LIST, userId, listId: favoritos.id },
      });
    }
    const existingActQuero = await prisma.activity.findFirst({ where: { listId: quero.id, type: ActivityType.CREATED_LIST } });
    if (!existingActQuero) {
      await prisma.activity.create({
        data: { type: ActivityType.CREATED_LIST, userId, listId: quero.id },
      });
    }
  }
}

async function seedSavedAndFavorites(userIds: number[], placeIds: number[]) {
  const saved: { userId: number; placeId: number }[] = [];
  const favorites: { userId: number; placeId: number }[] = [];
  for (const uid of userIds) {
    const subsetSaved = getRandomSubset(placeIds, 6);
    const subsetFav = getRandomSubset(placeIds, 4);
    saved.push(...subsetSaved.map((p) => ({ userId: uid, placeId: p }))),
    favorites.push(...subsetFav.map((p) => ({ userId: uid, placeId: p })));
  }
  if (saved.length) await prisma.savedPlace.createMany({ data: saved, skipDuplicates: true });
  if (favorites.length) await prisma.favoritePlace.createMany({ data: favorites, skipDuplicates: true });

  // Activities for SAVED (limit to a few to avoid noise)
  const actSaved: { type: ActivityType; userId: number; placeId: number }[] = [];
  for (let i = 0; i < Math.min(25, saved.length); i++) {
    const s = saved[i];
    // Avoid duplicates by checking if exists
    const exists = await prisma.activity.findFirst({ where: { type: ActivityType.SAVED, userId: s.userId, placeId: s.placeId } });
    if (!exists) {
      actSaved.push({ type: ActivityType.SAVED, userId: s.userId, placeId: s.placeId });
    }
  }
  if (actSaved.length) {
    await prisma.activity.createMany({ data: actSaved });
  }
}

async function seedReviewsAndActivities(userIds: number[], placeIds: number[]) {
  // For determinism: 1 review per user on 3 random places
  for (const uid of userIds) {
    const chosen = getRandomSubset(placeIds, 3);
    let i = 0;
    for (const pid of chosen) {
      // Avoid duplicating review for same pair
      const already = await prisma.review.findFirst({ where: { userId: uid, placeId: pid } });
      if (already) continue;
      const overall = randomBetween(3, 5);
      const review = await prisma.review.create({
        data: {
          userId: uid,
          placeId: pid,
          generalRating: overall,
          foodRating: Math.min(5, Math.max(1, overall + randomBetween(-1, 1))),
          serviceRating: Math.min(5, Math.max(1, overall + randomBetween(-1, 1))),
          environmentRating: Math.min(5, Math.max(1, overall + randomBetween(-1, 1))),
          comment: randomCommentSeed(i),
          pricePaid: randomPriceSeed(),
          numberOfPeople: randomBetween(1, 4),
          createdAt: randomPastDateSeed(),
        },
      });
      // Activity linked to review (reviewId must be unique on activity)
      await prisma.activity.create({
        data: {
          type: ActivityType.REVIEWED,
          userId: uid,
          placeId: pid,
          reviewId: review.id,
        },
      });
      i++;
    }
  }

  // Some CHECKED_IN activities without reviews
  const checkins: { type: ActivityType; userId: number; placeId: number }[] = [];
  for (let k = 0; k < Math.min(20, userIds.length * 2); k++) {
    const uid = userIds[randomBetween(0, userIds.length - 1)];
    const pid = placeIds[randomBetween(0, placeIds.length - 1)];
    // Avoid duplicate check-ins for same user/place in our sample
    const exists = await prisma.activity.findFirst({ where: { type: ActivityType.CHECKED_IN, userId: uid, placeId: pid } });
    if (!exists) {
      checkins.push({ type: ActivityType.CHECKED_IN, userId: uid, placeId: pid });
    }
  }
  if (checkins.length) {
    await prisma.activity.createMany({ data: checkins });
  }
}

async function main() {
  const categories = Array.from(new Set(DATA.map((d) => d.category)));
  await Promise.all(categories.map((c) => ensureCategory(c)));

  for (const item of DATA) {
    await upsertPlaceWithHours(item);
  }

  // Seed users
  const userIds = await seedUsers();

  // Seed follows
  await seedFollows(userIds);

  // Gather place ids
  const places = await prisma.place.findMany({ select: { id: true } });
  const placeIds = places.map((p) => p.id);

  // Seed lists and items (+created_list activities)
  await seedListsAndItems(userIds, placeIds);

  // Seed saved/favorites (+saved activities subset)
  await seedSavedAndFavorites(userIds, placeIds);

  // Seed reviews (+review activities) and some check-ins
  await seedReviewsAndActivities(userIds, placeIds);

  const countPlaces = await prisma.place.count({ where: { name: { in: DATA.map((d) => d.name) } } });
  const countHours = await prisma.openingHourRule.count();
  const countUsers = await prisma.user.count({ where: { firebaseUid: { in: USERS.map((u) => u.firebaseUid) } } });
  const countFollows = await prisma.follow.count();
  const countLists = await prisma.list.count();
  const countListItems = await prisma.listItem.count();
  const countSaved = await prisma.savedPlace.count();
  const countFav = await prisma.favoritePlace.count();
  const countReviews = await prisma.review.count();
  const countActivities = await prisma.activity.count();

  console.log(`Seed concluído: ${categories.length} categorias asseguradas.`);
  console.log(`Lugares inseridos/atualizados: ${countPlaces}.`);
  console.log(`Regras de horários totais: ${countHours}.`);
  console.log(`Usuários assegurados: ${countUsers}.`);
  console.log(`Follows totais: ${countFollows}.`);
  console.log(`Listas: ${countLists}, Itens de listas: ${countListItems}.`);
  console.log(`SavedPlaces: ${countSaved}, FavoritePlaces: ${countFav}.`);
  console.log(`Reviews: ${countReviews}, Activities: ${countActivities}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
