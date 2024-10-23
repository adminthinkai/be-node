import {
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AccessTokenGuard } from "src/guards/access-token-guard.service";
import { AdminGuard } from "src/guards/admin-guard.service";
import { IReqWithUser } from "src/interfaces/IReqWithUser";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(AdminGuard)
  @Get("/get-analytics-admin")
  getAnalyticsForAdmin() {
    return this.analyticsService.getAnalyticsForAdmin();
  }

  @UseGuards(AccessTokenGuard)
  @Get("/get-analytics-user")
  getAnalyticsUser(@Req() { user }: IReqWithUser) {
    return this.analyticsService.getAnalyticsForUser(user.id);
  }

}
