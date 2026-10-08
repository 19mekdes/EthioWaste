import { db } from '../db.js';

export async function getRecyclingCenters() {
  const centers = await db.recyclingCenter.findMany({
    orderBy: { name: 'asc' },
  });
  return centers;
}

export async function createRecyclingCenter(data: {
  name: string;
  description?: string;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  acceptedMaterials: string;
  contactPhone?: string;
  operatingHours?: string;
}) {
  const center = await db.recyclingCenter.create({
    data: {
      name: data.name.trim(),
      description: data.description?.trim() || null,
      address: data.address.trim(),
      city: data.city?.trim() || 'Addis Ababa',
      latitude: data.latitude ?? 8.9806,
      longitude: data.longitude ?? 38.7578,
      acceptedMaterials: data.acceptedMaterials.trim(),
      contactPhone: data.contactPhone?.trim() || null,
      operatingHours: data.operatingHours?.trim() || '8:00 AM - 6:00 PM',
      status: 'ACTIVE',
    },
  });
  return center;
}

export async function updateRecyclingCenter(id: string, data: any) {
  const updated = await db.recyclingCenter.update({
    where: { id },
    data,
  });
  return updated;
}

export async function deleteRecyclingCenter(id: string) {
  await db.recyclingCenter.delete({ where: { id } });
  return { success: true };
}
