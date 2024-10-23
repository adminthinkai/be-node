import { Module } from "@nestjs/common";
import { ClassService} from "./class.service";
import { ClassController} from "./class.controller";
import { TokenModule } from "../token/token.module";
import { ValidationModule } from "../validation/validation.module";
import { ChatModule } from "../messages/chat.module";
import { UserModule } from "../user/user.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    TokenModule,
    ValidationModule,
    ChatModule,
    UserModule,
    NotificationsModule
  ],
  controllers: [ClassController],
  providers: [
    ClassService,
  ],
  exports: [
    ClassService,
  ],
})
export class ClassModule {}
