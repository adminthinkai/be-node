import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileExceptions } from './enum/exceptions.enum';
import { ValidationService } from 'src/modules/validation/validation.service';
import { File } from 'src/models/entities';
import { UpdateFileDto } from './dtos/update-file.dto';
import { AzureService } from 'src/integration/azure/azure.service';
import * as crypto from 'crypto';
import { Op } from 'sequelize';
import { filterForFiles } from './filters';
import { GetManyFilesDto } from './dtos/get-many-files.dto';

@Injectable()
export class FileService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly azureService: AzureService,
  ) {}

  async uploadFiles(files: Express.Multer.File[]) {
    if (!files) {
      throw new HttpException(FileExceptions.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    // await Promise.all(
    //   files.map(async (file: Express.Multer.File) => {
    //     if (
    //       ![
    //         'text/plain',
    //         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    //         'application/msword',
    //         'application/x-iwork-pages-sffpages',
    //       ].includes(file.mimetype)
    //     ) {
    //       throw new HttpException(
    //         FileExceptions.INVALID_FILE_FORMAT,
    //         HttpStatus.BAD_REQUEST,
    //       );
    //     }
    //   }),
    // );

    return await Promise.allSettled(
      files.map(async (file: any) => {
        const url = await this.azureService.uploadFile(file);

        const destination = `${crypto.randomBytes(20).toString('hex')}_${Date.now()}${file.originalname}`;

        return await File.create({
          url,
          name: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          key: destination,
        });
      }),
    );

    // const allFiles: any = await File.findAndCountAll({
    //   where: { appLogoId: null },
    //   attributes: {
    //     exclude: ['appLogoId'],
    //   },
    // });

    // const maxSize = await File.max('size', { where: { appLogoId: null } });
    // const minSize = await File.min('size', { where: { appLogoId: null } });

    // allFiles.maxSize = maxSize
    // allFiles.minSize = minSize

    // return allFiles;
  }

  async getFileById(id: string) {
    return File.findOne({
      where: { id },
    });
  }

  async getFileList(params: GetManyFilesDto) {
    const whereCriteria = await filterForFiles({ ...params });

    const allFiles: any = await File.findAndCountAll({
      where: { [Op.and]: whereCriteria, appLogoId: null },
      attributes: {
        exclude: ['appLogoId'],
      },
      order: [
        [params.sortField || 'creationDate', params.sortDirection || 'DESC'],
      ],
      offset: params.page * params.size - params.size,
      limit: params.size,
      distinct: true,
    });

    const maxSize = await File.max('size', { where: { appLogoId: null } });
    const minSize = await File.min('size', { where: { appLogoId: null } });

    allFiles.maxSize = maxSize;
    allFiles.minSize = minSize;

    return allFiles;
  }

  async getAllFiles() {
    return await File.findAndCountAll();
  }

  async getFileOptions() {
    const maxSize = await File.max('size', { where: { appLogoId: null } });
    const minSize = await File.min('size', { where: { appLogoId: null } });

    return { maxSize, minSize };
  }

  async rename({ name, id }: UpdateFileDto) {
    const file = await this.validationService.getModelWithThrow({
      modelCtor: File,
      criteria: { id },
      message: FileExceptions.NOT_FOUND,
    });

    return file.update({ name });
  }

  async delete(id: string) {
    const file: any = await this.validationService.getModelWithThrow({
      modelCtor: File,
      message: FileExceptions.NOT_FOUND,
      criteria: { id },
    });

    await file.destroy();

    return { id };
  }

  async testChat() {
    return 'test';
  }
}
