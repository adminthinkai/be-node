import { Module } from "@nestjs/common";
import { FileService} from "./file.service";
import { FileController} from "./file.controller";
import { TokenModule } from "../token/token.module";
import { ValidationModule } from "../validation/validation.module";
import { AzureModule } from "src/integration/azure/azure.module";

@Module({
  imports: [
    TokenModule,
    ValidationModule,
    AzureModule
  ],
  controllers: [FileController],
  providers: [
    FileService,
  ],
  exports: [
    FileService,
  ],
})
export class FileModule {}
