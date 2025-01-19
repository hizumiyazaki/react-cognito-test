'use client';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getCognitoCredentials } from '@/lib/cognitoClient';
import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';

export const getS3Client = async () => new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION,
  credentials: await getCognitoCredentials()
});

export const listObjects = async (client :S3Client, prefix: string): Promise<string[]> => {
  try {
    const objects = await client.send(
      new ListObjectsV2Command({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
        Prefix: prefix,
      })
    );

    if (!objects.Contents) {
      return [];
    }

    // 各オブジェクトのpresignedURLを取得
    const presignedUrls = await Promise.all(
      objects.Contents.map(async (object) => {
        if (!object.Key) return null;

        const command = new GetObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
          Key: object.Key,
        });

        return await getSignedUrl(client, command, {
          expiresIn: 3600,
        });
      })
    );

    // nullを除外して返す
    return presignedUrls.filter(Boolean) as string[];
  } catch (error) {
    console.error('Error listing objects:', error);
    throw error;
  }
};
