import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

@Injectable()
export class SupabaseStorageService {
  private client: SupabaseClient;
  private bucket: string;

  constructor() {
    const url = process.env.SUPABASE_URL as string;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    this.bucket = process.env.STORAGE_BUCKET || 'product-images';
    this.client = createClient(url, key ?? '');
  }

  async uploadProductImage(file: Express.Multer.File): Promise<string> {
    const original = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const ext = original.includes('.') ? original.split('.').pop() : 'bin';
    const path = `products/${randomUUID()}.${ext}`;
    const { error } = await this.client.storage.from(this.bucket).upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
    if (error) {
      throw new InternalServerErrorException('Failed to upload image');
    }
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
