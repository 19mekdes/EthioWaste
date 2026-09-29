import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting EcoBin Database Seeding...');

  // Clean existing tables
  await prisma.rewardTransaction.deleteMany();
  await prisma.pickupSchedule.deleteMany();
  await prisma.wasteReport.deleteMany();
  await prisma.recyclingCenter.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const citizen1 = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'citizen@ecobin.org',
      password: password123,
      role: 'CITIZEN',
      ecoPoints: 450,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  });

  const citizen2 = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      password: password123,
      role: 'CITIZEN',
      ecoPoints: 720,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const citizen3 = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      password:password123,
      role: 'CITIZEN',
      ecoPoints: 310,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const collector1 = await prisma.user.create({
    data: {
      name: 'Marcus Vance',
      email: 'collector@ecobin.org',
      password: password123,
      role: 'COLLECTOR',
      ecoPoints: 120,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  });

  const collector2 = await prisma.user.create({
    data: {
      name: 'David Chen',
      email: 'david.collector@ecobin.org',
      password:   password123,
      role: 'COLLECTOR',
      ecoPoints: 80,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Director Helena Vance',
      email: 'admin@ecobin.org',
      password: password123,
      role: 'MUNICIPAL_ADMIN',
      ecoPoints: 1500,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  console.log('✅ Users created: Citizen, Collector, Admin');

  // 2. Create Waste Reports
  const report1 = await prisma.wasteReport.create({
    data: {
      title: 'Overflowing Plastic Bin at Central Park Plaza',
      description: 'Public recycling bin overflowing with plastic bottles and beverage containers onto sidewalk.',
      category: 'PLASTIC',
      severity: 'HIGH',
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
      status: 'PENDING',
      latitude: 40.7829,
      longitude: -73.9654,
      address: '79th St Transverse, New York, NY 10024',
      reporterId: citizen1.id,
    },
  });

  const report2 = await prisma.wasteReport.create({
    data: {
      title: 'Illegal Electronic Waste Dumping behind Metro Station',
      description: 'Multiple discarded monitors, CPUs, and broken television sets stacked near rear exit.',
      category: 'E_WASTE',
      severity: 'CRITICAL',
      imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
      status: 'IN_PROGRESS',
      latitude: 40.7580,
      longitude: -73.9855,
      address: '42nd St & Broadway, New York, NY 10036',
      reporterId: citizen2.id,
      assignedToId: collector1.id,
    },
  });

  const report3 = await prisma.wasteReport.create({
    data: {
      title: 'Organic Market Waste Accumulation',
      description: 'Spoiled produce crates left outside local green market attracting pests.',
      category: 'ORGANIC',
      severity: 'MEDIUM',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      cleanupImageUrl: 'https://images.unsplash.com/photo-1611284446314-60a55ac7deab?w=800&auto=format&fit=crop&q=80',
      status: 'RESOLVED',
      latitude: 40.7360,
      longitude: -73.9901,
      address: 'Union Square West, New York, NY 10003',
      reporterId: citizen1.id,
      assignedToId: collector1.id,
      resolvedAt: new Date(),
    },
  });

  const report4 = await prisma.wasteReport.create({
    data: {
      title: 'Hazardous Chemical Containers near Waterfront Pier',
      description: 'Leaking industrial paint cans and solvent containers left unmonitored.',
      category: 'HAZARDOUS',
      severity: 'CRITICAL',
      imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&auto=format&fit=crop&q=80',
      status: 'PENDING',
      latitude: 40.7410,
      longitude: -74.0080,
      address: 'Hudson River Greenway Pier 57, NY',
      reporterId: citizen3.id,
    },
  });

  console.log('✅ Waste Reports created');

  // 3. Create Recycling Centers
  await prisma.recyclingCenter.createMany({
    data: [
      {
        name: 'Metro Eco-Hub & E-Waste Facility',
        address: '520 W 28th St, New York, NY 10001',
        latitude: 40.7516,
        longitude: -74.0012,
        acceptedMaterials: 'E-Waste,Plastics,Batteries,Metals',
        contactPhone: '+1 (212) 555-0192',
        operatingHours: 'Mon-Sat: 7:00 AM - 7:00 PM',
      },
      {
        name: 'GreenLife Community Compost & Organics Center',
        address: '142 Columbia St, Brooklyn, NY 11231',
        latitude: 40.6865,
        longitude: -74.0018,
        acceptedMaterials: 'Organic,Food Waste,Yard Trimmings,Cardboard',
        contactPhone: '+1 (718) 555-0431',
        operatingHours: 'Mon-Sun: 8:00 AM - 5:00 PM',
      },
      {
        name: 'Harbor Clean Glass & Bottle Redemption Depot',
        address: '350 Avenue C, New York, NY 10009',
        latitude: 40.7322,
        longitude: -73.9745,
        acceptedMaterials: 'Glass,Plastics,Aluminum Cans',
        contactPhone: '+1 (212) 555-0814',
        operatingHours: 'Tue-Sat: 9:00 AM - 6:00 PM',
      },
      {
        name: 'Upper East Safe Hazardous Waste Drop Point',
        address: '1720 York Ave, New York, NY 10128',
        latitude: 40.7788,
        longitude: -73.9458,
        acceptedMaterials: 'Hazardous,Batteries,Paint,Lightbulbs',
        contactPhone: '+1 (212) 555-0929',
        operatingHours: 'Mon, Wed, Fri: 10:00 AM - 4:00 PM',
      },
    ],
  });

  console.log('✅ Recycling Centers created');

  // 4. Create Pickup Schedules
  await prisma.pickupSchedule.create({
    data: {
      citizenId: citizen1.id,
      wasteType: 'BULK',
      address: '350 W 57th St, Apt 14B, New York, NY',
      latitude: 40.7680,
      longitude: -73.9850,
      scheduledDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      preferredTimeSlot: 'Morning (9:00 AM - 12:00 PM)',
      notes: 'Disposing of old wooden bookshelf and mattresses.',
      status: 'SCHEDULED',
    },
  });

  await prisma.pickupSchedule.create({
    data: {
      citizenId: citizen2.id,
      wasteType: 'E_WASTE',
      address: '88 Greenwich St, New York, NY',
      latitude: 40.7070,
      longitude: -74.0130,
      scheduledDate: new Date(Date.now() + 86400000 * 4), // 4 days from now
      preferredTimeSlot: 'Afternoon (1:00 PM - 4:00 PM)',
      notes: 'Large microwave and stereo speakers ready at side gate.',
      status: 'SCHEDULED',
    },
  });

  console.log('✅ Pickup Schedules created');

  // 5. Create Reward Transactions
  await prisma.rewardTransaction.createMany({
    data: [
      {
        userId: citizen1.id,
        amount: 50,
        type: 'EARNED',
        description: 'Validated Report: Overflowing Plastic Bin',
      },
      {
        userId: citizen1.id,
        amount: 100,
        type: 'EARNED',
        description: 'Completed Bulk Recycling Pickup',
      },
      {
        userId: citizen1.id,
        amount: -100,
        type: 'REDEEMED',
        description: 'Redeemed: $10 Public Transit Pass Voucher',
      },
      {
        userId: citizen2.id,
        amount: 200,
        type: 'EARNED',
        description: 'Validated E-Waste Report & Drop-off',
      },
    ],
  });

  console.log('✅ Reward Transactions created');
  console.log('🎉 EcoBin database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
