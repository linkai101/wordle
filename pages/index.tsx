"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const date = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
  const [month, day, year] = date.split('/');
  
  const router = useRouter();
  
  useEffect(() => {
    router.replace(`/${year}/${month}/${day}`);
  });
}