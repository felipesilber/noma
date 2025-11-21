import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.client = new S3Client({
      region: this.region,
      credentials:
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
          : undefined,
    });

    this.bucket =
      process.env.AVATAR_BUCKET ||
      process.env.AWS_S3_BUCKET ||
      '';
  }

  async getAvatarUploadUrl(userId: number, contentType: string) {
    if (!this.bucket) {
      console.error('Bucket S3 não configurado. Defina AVATAR_BUCKET ou AWS_S3_BUCKET.');
      throw new Error(
        'Bucket S3 não configurado. Defina AVATAR_BUCKET ou AWS_S3_BUCKET.',
      );
    }

    const key = `avatars/user-${userId}-${Date.now()}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
      // Não usamos ACL aqui para evitar erros em buckets com ACL desativado
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: 300,
    });

    const fileUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

    return { uploadUrl, fileUrl };
  }
}


