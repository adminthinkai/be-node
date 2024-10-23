import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Query,
  Delete,
  Req,
} from "@nestjs/common";
import { ClassService} from "./class.service";
import { AccessTokenGuard } from "src/guards/access-token-guard.service";
import { UpdateClassDto } from "./dtos/update-class.dto";
import { CreateClassDto } from "./dtos/create-class.dto";
import { GetManyClassesDto } from "./dtos/get-many-classes.dto";
import { DeleteClassDto } from "./dtos/delete-class.dto";
import { GetOneClassDto } from "./dtos/get-one-class.dto";
import { IReqWithUser } from "src/interfaces/IReqWithUser";
import { GenerateContentDto } from "./dtos/generate-content.dto copy";
import { GetClassHistoryDto } from "./dtos/get-class-history.dto copy";

@Controller("class")
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @UseGuards(AccessTokenGuard)
  @Post("/create-class")
  createClass(
    @Body() dto: CreateClassDto,
    @Req() { user }: IReqWithUser
    ) {
    return this.classService.createClass(dto, user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Post("/generate-content")
  generateContent(
    @Body() dto: GenerateContentDto,
    @Req() { user }: IReqWithUser
    ) {
    return this.classService.generateContent(dto, user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get("/get-classes-list")
  getClassesList(
    @Query() dto: GetManyClassesDto,
    @Req() { user }: IReqWithUser
    ) {
    return this.classService.getClassesList(dto, user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get("/get-class-history")
  getClassHistory(
    @Query() dto: GetClassHistoryDto,
    ) {
    return this.classService.getClassHistory(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get("/get-class-by-id")
  getClassById(@Query() dto: GetOneClassDto) {
    return this.classService.getClassByIdAndThrowIfNotExist(dto.id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch("/update-class")
  updateClass(@Body() dto: UpdateClassDto) {
    return this.classService.updateClassById(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete("/delete-class")
  deleteClass(@Query() dto: DeleteClassDto) {
    return this.classService.deleteClassById(dto.id);
  }
}
