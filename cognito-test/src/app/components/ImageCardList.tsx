'use client';
import ImageCard from '@/app/components/ImageCard';
import { getS3Client, listObjects } from '@/lib/s3Client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ImageCardList = () => {
  const router = useRouter();
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    console.log('ImageCardList');
    const fetchUrls = async () => {
      const s3Client = await getS3Client();
      const presignedUrl = await listObjects(s3Client, 'thumbs/');
      setUrls(presignedUrl);
    };
    try {
      fetchUrls();
    } catch {
      router.push('/login');
      router.refresh();
    }
  }, [router]);

  return (
    <>
      {urls.map((url) => (
        <ImageCard key={url} imageUrl={url} alt="Image" />
      ))}
    </>
  );
};

export default ImageCardList;
