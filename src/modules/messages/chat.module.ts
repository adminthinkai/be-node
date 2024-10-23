import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TokenModule } from '../token/token.module';
import { ValidationModule } from '../validation/validation.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TokenModule, ValidationModule, FileModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
