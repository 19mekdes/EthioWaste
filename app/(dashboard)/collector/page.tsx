import { redirect } from 'next/navigation';

export default function LegacyCollectorRedirect() {
  redirect('/dashboard/collector');
}
