export interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export interface StorageProvider {
  upload(file: Buffer, path: string, contentType: string): Promise<UploadResult>;
  delete(path: string): Promise<void>;
  getSignedUrl(path: string, expiresIn?: number): Promise<string>;
}
