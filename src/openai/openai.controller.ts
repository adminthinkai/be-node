import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import OpenAI from 'openai';

import { IChatRequest, IChatResponse } from './interfaces';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private openaiService: OpenaiService) {}

  // @Post('/chat2')
  // @HttpCode(200)
  // async getChatOpenai2(@Body() request: IChatRequest): Promise<IChatResponse> {
  //   // const getMessages = (await this.openaiService.getMessagesData(
  //   //   request,
  //   // )) as OpenAI.ChatCompletion;

  //   return this.openaiService.getMessagesData2();
  // }

  @Post('/chat')
  @HttpCode(200)
  async getChatOpenai(@Body() request: IChatRequest): Promise<IChatResponse> {
    return this.openaiService.getMessagesData(request);
  }
}
