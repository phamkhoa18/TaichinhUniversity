import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  // If the user navigates to /admin, simply redirect them to /admin/dashboard
  redirect('/admin/dashboard');
}
