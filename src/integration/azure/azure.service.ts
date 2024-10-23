import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';

@Injectable()
export class AzureService implements OnModuleInit {
  protected readonly STORAGE_CONNECTION_STRING: string;
  protected readonly CONTAINER_NAME: string = 'upload-file-thinkai';
  protected readonly TIMEOUT = 30 * 60 * 1000;
  protected readonly UPLOAD_OPTIONS = {
    bufferSize: 4 * (1024 * 1024),
    maxBuffers: 20,
  };

  protected client: BlobServiceClient;

  constructor() {
    this.STORAGE_CONNECTION_STRING =
      process.env.AZURE_STORAGE_CONNECTION_STRING;
  }

  public onModuleInit(): void {
    this.client = BlobServiceClient.fromConnectionString(
      this.STORAGE_CONNECTION_STRING,
      {
        retryOptions: { maxTries: 5 },
        keepAliveOptions: { enable: false },
      },
    );
  }

  public async uploadFile(file: Express.Multer.File): Promise<any> {
    const blobClient = await this.getBlobClient(file.originalname);

    // let contentType = 'application/octet-stream';
    // if (
    //   file.originalname.endsWith('.jpg') ||
    //   file.originalname.endsWith('.jpeg')
    // ) {
    //   contentType = 'image/jpeg';
    // } else if (file.originalname.endsWith('.png')) {
    //   contentType = 'image/png';
    // } else if (file.originalname.endsWith('.gif')) {
    //   contentType = 'image/gif';
    // }

    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    };

    await blobClient.uploadData(file.buffer, uploadOptions);

    const url = blobClient.url;

    return url;
  }

  public async deleteFile(filename: string): Promise<any> {
    const blobClient = await this.getBlobClient(filename);
    await blobClient.deleteIfExists();
  }

  protected async getBlobClient(blobName: string): Promise<BlockBlobClient> {
    const containerClient = this.client.getContainerClient(this.CONTAINER_NAME);
    return containerClient.getBlockBlobClient(blobName);
  }
}
