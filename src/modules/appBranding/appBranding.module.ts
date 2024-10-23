import { Module } from "@nestjs/common";
import { AppBrandingService} from "./appBranding.service";
import { AppBrandingController} from "./appBranding.controller";
import { TokenModule } from "../token/token.module";
import { ValidationModule } from "../validation/validation.module";
import { AzureModule } from "src/integration/azure/azure.module";

@Module({
  imports: [
    TokenModule,
    ValidationModule,
    AzureModule
  ],
  controllers: [AppBrandingController],
  providers: [
    AppBrandingService,
  ],
  exports: [
    AppBrandingService,
  ],
})
export class AppBrandingModule {}
