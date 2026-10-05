import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { Header } from '@/components/ui/Header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');


  let ecoPoints = user.ecoPoints;
  if (user.role === 'CITIZEN') {
    const fresh = await db.user.findUnique({
      where: { id: user.id },
      select: { ecoPoints: true },
    });
    if (fresh) ecoPoints = fresh.ecoPoints;
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <Header
        user={{
          id: user.id,
          name: user.name || 'User',
          email: user.email || '',
          role: user.role,
          ecoPoints,
          avatarUrl: user.avatarUrl || undefined,
        }}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
