import { Module } from "@nestjs/common";
import { AnalyticsService} from "./analytics.service";
import { AnalyticsController} from "./analytics.controller";
import { TokenModule } from "../token/token.module";
import { ValidationModule } from "../validation/validation.module";

@Module({
  imports: [
    TokenModule,
    ValidationModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
