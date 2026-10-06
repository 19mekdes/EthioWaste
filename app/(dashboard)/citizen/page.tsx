import { redirect } from 'next/navigation';

export default function LegacyCitizenRedirect() {
  redirect('/dashboard/citizen');
}
