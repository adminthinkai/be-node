import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Query,
  Delete,
  HttpStatus,
  ParseFilePipeBuilder,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AccessTokenGuard } from 'src/guards/access-token-guard.service';
import { UpdateFileDto } from './dtos/update-file.dto';
import { DeleteFileDto } from './dtos/delete-file.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetManyFilesDto } from './dtos/get-many-files.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/upload-file')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'files[]',
        maxCount: 5,
      },
    ]),
  )
  uploadFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
      }),
    )
    files: {
      ['files[]']: Express.Multer.File[];
    },
  ) {
    return this.fileService.uploadFiles(files['files[]']);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/get-files')
  getFilesList(@Query() dto: GetManyFilesDto) {
    return this.fileService.getFileList(dto);
  }

  @Get('/test-chat')
  testChat() {
    return this.fileService.testChat();
  }

  @UseGuards(AccessTokenGuard)
  @Get('/get-file-options')
  getFileOptions() {
    return this.fileService.getFileOptions();
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/delete-file')
  deleteWorkOrderFile(@Query() { id }: DeleteFileDto) {
    return this.fileService.delete(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/rename-file')
  renameWorkOrderFile(@Body() { name, id }: UpdateFileDto) {
    return this.fileService.rename({ name, id });
  }
}
