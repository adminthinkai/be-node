import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Delete,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from 'src/guards/access-token-guard.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { IReqWithUser } from 'src/interfaces/IReqWithUser';
import { DeleteMessageDto } from './dtos/delete-message.dto';
import { GetManyMessagesDto } from './dtos/get-many-messages.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/create-message')
  createMessage(@Body() dto: CreateMessageDto, @Req() { user }: IReqWithUser) {
    return this.chatService.createMessage(dto, user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/create-chat')
  createChat() {
    return this.chatService.createChat();
  }

  @UseGuards(AccessTokenGuard)
  @Get('/get-messages')
  getMessages(@Req() { user }: IReqWithUser, @Query() dto: GetManyMessagesDto) {
    return this.chatService.getMessages(user.id, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/delete-message')
  deleteMessage(@Query() dto: DeleteMessageDto) {
    return this.chatService.deleteMessageById(dto.id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/clear-chat')
  clearChat(@Req() { user }: IReqWithUser) {
    return this.chatService.clearChat(user.id);
  }
}
