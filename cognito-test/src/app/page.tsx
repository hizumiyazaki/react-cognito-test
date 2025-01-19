'use client';
import ImageCardList from '@/app/components/ImageCardList';

export default function Home() {
  return (
    <main className="grid grid-cols-3 gap-4 p-4">
      <ImageCardList />
    </main>
  );
}
