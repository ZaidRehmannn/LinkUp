'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/feed');
    }
  }, [router]);

  return <>{children}</>;
}
