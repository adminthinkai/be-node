import {
  Controller,
  Body,
  UseGuards,
  Get,
  Patch,
  HttpStatus,
  ParseFilePipeBuilder,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AppBrandingService } from "./appBranding.service";
import { AccessTokenGuard } from "src/guards/access-token-guard.service";
import { UpdateAppBrandingDto } from "./dtos/update-branding.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { UploadLogoDto } from "./dtos/upload-logo.dto";

@Controller("app")
export class AppBrandingController {
  constructor(private readonly appBrandingService: AppBrandingService) {}

  @UseGuards(AccessTokenGuard)
  @Patch('/upload-logo')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'logo',
        maxCount: 1,
      },
    ])
  )
  uploadLogo(
    @Body() { id }: UploadLogoDto,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
      })
    )
    files: {
      ['logo']: Express.Multer.File[];
    }
  ) {
    return this.appBrandingService.uploadLogo(id, files['logo']?.at(0));
  }

  @UseGuards(AccessTokenGuard)
  @Get("/get-app-branding")
  getAppBranding() {
    return this.appBrandingService.getAppBranding();
  }

  @UseGuards(AccessTokenGuard)
  @Patch("/update-app-branding")
  updateAppBranding(@Body() dto: UpdateAppBrandingDto) {
    return this.appBrandingService.updateAppBranding(dto);
  }

}
