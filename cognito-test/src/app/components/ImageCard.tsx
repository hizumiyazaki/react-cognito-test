'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import React from 'react';

interface ImageCardProps {
  imageUrl: string
  alt?: string
}

const ImageCard = ({ imageUrl, alt = 'Image' }: ImageCardProps)  => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={imageUrl}  alt={alt} className="w-full"/>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
};

export default ImageCard;
