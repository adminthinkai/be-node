import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AppBrandingExceptions } from "./enum/exceptions.enum";
import { ValidationService } from "src/modules/validation/validation.service";
import { AppBranding, File } from "src/models/entities";
import { UpdateAppBrandingDto } from "./dtos/update-branding.dto";
import { AzureService } from "src/integration/azure/azure.service";
import * as crypto from 'crypto';

@Injectable()
export class AppBrandingService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly azureService: AzureService,
  ) {}

  async uploadLogo(id: string, file: Express.Multer.File) {
    if (
      !file ||
      !['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype)
    ) {
      throw new HttpException(
        AppBrandingExceptions.INVALID_AVATAR_FORMAT, 
        HttpStatus.BAD_REQUEST
      );
    }

    const branding = await this.validationService.getModelWithThrow({
      modelCtor: AppBranding,
      message: AppBrandingExceptions.NOT_FOUND,
      criteria: { id },
      include: [
        {
          model: File,
          as: 'logo',
          attributes: ['id'],
        },
      ],
    });

    if (branding.logo) {
      const id = branding.logo.id;
      await File.destroy({where: {id}})
      // await this.azureService.deleteFile({ id });
    }

    const url = await this.azureService.uploadFile(file);

    const destination = `${crypto.randomBytes(20).toString('hex')}_${Date.now()}${file.originalname}`;

    const logo = await File.create({
      url,
      name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      appLogoId: id,
      key: destination
    });

    return logo;
  }

  async getAppBranding() {

    const appBranding = await AppBranding.findOne({
      include: [
        {
          model: File,
          as: 'logo',
        },
      ],
    });

    if (!appBranding){
      const newAppBranding = await AppBranding.create({})
      newAppBranding.dataValues.logo = null
      return newAppBranding
    } else {
      return appBranding
    }

  }

  async getAppBrandingById(id: string) {
    return AppBranding.findOne({
      where: { id },
    });
  }

  async updateAppBranding({ id, ...pureDto }: UpdateAppBrandingDto) {
    const app: any = await this.validationService.getModelWithThrow({
      modelCtor: AppBranding,
      message: AppBrandingExceptions.NOT_FOUND,
      criteria: { id },
    });

    return await app.update(pureDto);
  }
 
}
