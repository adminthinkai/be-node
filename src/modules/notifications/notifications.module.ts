import { Module } from "@nestjs/common";
import { NotificationsService} from "./notifications.service";
import { NotificationsController} from "./notifications.controller";
import { TokenModule } from "../token/token.module";
import { ValidationModule } from "../validation/validation.module";

@Module({
  imports: [
    TokenModule,
    ValidationModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
  ],
  exports: [
    NotificationsService,
  ],
})
export class NotificationsModule {}
