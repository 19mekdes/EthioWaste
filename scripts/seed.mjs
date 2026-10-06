import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Smart Waste Platform Database Seeding...');

  // 0. Clean existing tables safely in order
  await prisma.rewardTransaction.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.collectionTask.updateMany({ data: { recyclingRecordId: null } });
  await prisma.recyclingRecord.deleteMany();
  await prisma.collectionTask.deleteMany();
  await prisma.collectionRequest.deleteMany();
  await prisma.pickupSchedule.deleteMany();
  await prisma.wasteReport.deleteMany();
  await prisma.recyclingOrganization.deleteMany();
  await prisma.recyclingCenter.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Users for ALL FOUR primary roles
  const citizen1 = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'citizen@ecobin.org',
      password: hashedPassword,
      role: 'CITIZEN',
      ecoPoints: 450,
      phone: '+251 911 234 567',
      address: 'Bole Medhanealem, Addis Ababa',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  });

  const citizen2 = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      password: hashedPassword,
      role: 'CITIZEN',
      ecoPoints: 720,
      phone: '+251 912 345 678',
      address: 'Kazanchis, Addis Ababa',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const collector1 = await prisma.user.create({
    data: {
      name: 'Marcus Vance',
      email: 'collector@ecobin.org',
      password: hashedPassword,
      role: 'COLLECTOR',
      ecoPoints: 120,
      phone: '+251 913 456 789',
      address: 'Meskel Square Sector, Addis Ababa',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  });

  const collector2 = await prisma.user.create({
    data: {
      name: 'David Chen',
      email: 'david.collector@ecobin.org',
      password: hashedPassword,
      role: 'COLLECTOR',
      ecoPoints: 80,
      phone: '+251 914 567 890',
      address: 'Piassa Depot, Addis Ababa',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
  });

  const recyclingUser = await prisma.user.create({
    data: {
      name: 'Addis Green Re-Process Org',
      email: 'recycling@ecobin.org',
      password: hashedPassword,
      role: 'RECYCLING_ORGANIZATION',
      ecoPoints: 300,
      phone: '+251 915 678 901',
      address: 'Akaki Kality Industrial Zone, Addis Ababa',
      avatarUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=150&auto=format&fit=crop&q=80',
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Director Helena Vance',
      email: 'admin@ecobin.org',
      password: hashedPassword,
      role: 'MUNICIPAL_ADMIN',
      ecoPoints: 1500,
      phone: '+251 916 789 012',
      address: 'City Administration HQ, Addis Ababa',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  console.log('✅ Users created for CITIZEN, COLLECTOR, RECYCLING_ORGANIZATION, and MUNICIPAL_ADMIN');

  // 2. Create Recycling Organization Profile
  const recyclingOrg = await prisma.recyclingOrganization.create({
    data: {
      userId: recyclingUser.id,
      name: 'Addis Green Re-Process & Circular Tech Org',
      description: 'Certified municipal recycling partner specializing in industrial plastic, cardboard, and e-waste processing.',
      address: 'Akaki Kality Sub-city, Street 4, Addis Ababa',
      city: 'Addis Ababa',
      latitude: 8.8951,
      longitude: 38.7845,
      contactPhone: '+251 114 340 912',
      contactEmail: 'contact@addisgreenreprocess.org',
      acceptedMaterials: 'PLASTIC,PAPER,CARDBOARD,ELECTRONIC,GLASS,METAL',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Recycling Organization Profile created');

  // 3. Create Waste Reports
  const report1 = await prisma.wasteReport.create({
    data: {
      title: 'Overflowing Plastic & Paper Bin at Bole Medhanealem Plaza',
      description: 'Public waste bin overflowing onto pedestrian walkway with plastic bottles and cardboard.',
      category: 'PLASTIC',
      severity: 'HIGH',
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
      status: 'PENDING',
      latitude: 8.9950,
      longitude: 38.7860,
      address: 'Bole Medhanealem Plaza, Addis Ababa',
      reporterId: citizen1.id,
    },
  });

  const report2 = await prisma.wasteReport.create({
    data: {
      title: 'Illegal Electronic Waste Dumping near Metro Track',
      description: 'Multiple discarded computer monitors, circuit boards, and cables stacked near track access.',
      category: 'ELECTRONIC',
      severity: 'CRITICAL',
      imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
      status: 'IN_PROGRESS',
      latitude: 9.0100,
      longitude: 38.7610,
      address: 'Kazanchis Metro Station, Addis Ababa',
      isIllegalDumping: true,
      reporterId: citizen2.id,
      assignedToId: collector1.id,
    },
  });

  const report3 = await prisma.wasteReport.create({
    data: {
      title: 'Organic Market Produce Waste Accumulation',
      description: 'Spoiled vegetable boxes left behind local market center.',
      category: 'ORGANIC',
      severity: 'MEDIUM',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      cleanupImageUrl: 'https://images.unsplash.com/photo-1611284446314-60a55ac7deab?w=800&auto=format&fit=crop&q=80',
      status: 'COMPLETED',
      latitude: 9.0300,
      longitude: 38.7400,
      address: 'Merkato Produce Hub, Addis Ababa',
      reporterId: citizen1.id,
      assignedToId: collector1.id,
      resolvedAt: new Date(),
    },
  });

  console.log('✅ Waste Reports created');

  // 4. Create Collection Requests & Collection Tasks
  const req1 = await prisma.collectionRequest.create({
    data: {
      citizenId: citizen1.id,
      wasteType: 'CARDBOARD',
      estimatedQuantity: '150 kg packaging boxes',
      description: 'Bulk commercial cardboard packaging from retail store renovation.',
      address: 'Bole Atlas Road, Addis Ababa',
      latitude: 8.9910,
      longitude: 38.7820,
      preferredDate: new Date(Date.now() + 86400000 * 2),
      preferredTimeSlot: 'Morning (9:00 AM - 12:00 PM)',
      priority: 'HIGH',
      status: 'ASSIGNED',
      assignedCollectorId: collector1.id,
    },
  });

  const task1 = await prisma.collectionTask.create({
    data: {
      requestId: req1.id,
      collectorId: collector1.id,
      address: req1.address,
      latitude: req1.latitude,
      longitude: req1.longitude,
      scheduledDate: req1.preferredDate,
      status: 'IN_PROGRESS',
      notes: 'Scheduled for morning pickup. Requires flatbed van.',
    },
  });

  await prisma.collectionRequest.update({
    where: { id: req1.id },
    data: { collectionTaskId: task1.id },
  });

  console.log('✅ Collection Request & Task created');

  // 5. Create Recycling Records
  const recRecord = await prisma.recyclingRecord.create({
    data: {
      organizationId: recyclingOrg.id,
      material: 'CARDBOARD',
      quantity: 150,
      unit: 'kg',
      status: 'PROCESSING',
      notes: 'Received from Collector Marcus Vance. Undergoing pulp extraction.',
    },
  });

  await prisma.collectionTask.update({
    where: { id: task1.id },
    data: { recyclingRecordId: recRecord.id },
  });

  console.log('✅ Recycling Record created');

  // 6. Create Recycling Centers (Public drop-off hubs)
  await prisma.recyclingCenter.createMany({
    data: [
      {
        name: 'Addis Central Eco-Hub & E-Waste Facility',
        description: 'Primary drop-off hub for electronics, batteries, plastics, and metals.',
        address: 'Bole Medhanealem Road, Addis Ababa',
        city: 'Addis Ababa',
        latitude: 8.9980,
        longitude: 38.7890,
        acceptedMaterials: 'ELECTRONIC,PLASTIC,METAL,HAZARDOUS',
        contactPhone: '+251 116 612 345',
        operatingHours: 'Mon-Sat: 8:00 AM - 6:00 PM',
      },
      {
        name: 'GreenLife Compost & Organic Waste Center',
        description: 'Community facility converting food and organic waste into agricultural compost.',
        address: 'Meskel Flower Area, Addis Ababa',
        city: 'Addis Ababa',
        latitude: 8.9850,
        longitude: 38.7650,
        acceptedMaterials: 'ORGANIC,PAPER,CARDBOARD',
        contactPhone: '+251 115 543 210',
        operatingHours: 'Mon-Sun: 7:30 AM - 5:30 PM',
      },
      {
        name: 'Piassa Glass & Redemption Depot',
        description: 'Dedicated glass bottle, jar, and aluminum container redemption center.',
        address: 'Churchill Avenue, Piassa, Addis Ababa',
        city: 'Addis Ababa',
        latitude: 9.0320,
        longitude: 38.7510,
        acceptedMaterials: 'GLASS,METAL,PLASTIC',
        contactPhone: '+251 111 234 890',
        operatingHours: 'Tue-Sat: 8:30 AM - 5:00 PM',
      },
    ],
  });

  console.log('✅ Public Recycling Centers created');

  // 7. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: citizen1.id,
        title: 'Report Verified',
        message: 'Your waste report "Overflowing Plastic & Paper Bin" was reviewed and verified by Municipal Admin.',
        type: 'INFO',
        isRead: true,
      },
      {
        userId: citizen1.id,
        title: 'Collector Assigned',
        message: 'Collector Marcus Vance has been assigned to your bulk cardboard collection request.',
        type: 'TASK',
        isRead: false,
      },
      {
        userId: collector1.id,
        title: 'New Route Assigned',
        message: 'You have a new cardboard pickup task scheduled at Bole Atlas Road.',
        type: 'TASK',
        isRead: false,
      },
      {
        userId: recyclingUser.id,
        title: 'New Recyclable Handoff',
        message: 'Collector Marcus Vance dispatched 150 kg of Cardboard to your processing center.',
        type: 'INFO',
        isRead: false,
      },
    ],
  });

  console.log('✅ Internal Notifications created');

  // 8. Create Complaints & Feedback
  await prisma.complaint.create({
    data: {
      citizenId: citizen2.id,
      category: 'Delayed Pickup',
      description: 'Scheduled waste collection was delayed by over 3 hours without prior alert.',
      status: 'IN_REVIEW',
      adminResponse: 'Under review by City Dispatch Supervisor. Collector alerted.',
    },
  });

  await prisma.feedback.create({
    data: {
      citizenId: citizen1.id,
      rating: 5,
      comment: 'Excellent prompt cleanup of the market organic waste bin!',
    },
  });

  console.log('✅ Complaints & Feedback created');

  // 9. Create Reward Transactions
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
        description: 'Completed Bulk Cardboard Collection',
      },
      {
        userId: citizen2.id,
        amount: 200,
        type: 'EARNED',
        description: 'Validated E-Waste Illegal Dumping Report',
      },
    ],
  });

  console.log('✅ Reward Transactions created');
  console.log('🎉 Smart Waste Platform seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
