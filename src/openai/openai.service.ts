import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const { AzureOpenAI } = require('openai');
const fs = require('fs');

import { IChatRequest, IChatResponse } from './interfaces';

@Injectable()
export class OpenaiService {
  //private client: any;
  endpoint = process.env.OPENAI_ENDPOINT;
  apiKey = process.env.OPENAI_API_KEY;
  apiVersion = process.env.OPENAI_API_VERSION;
  deployment = process.env.OPENAI_DEPLOYMENT;

  private client = new AzureOpenAI({
    endpoint: this.endpoint,
    apiKey: this.apiKey,
    apiVersion: this.apiVersion,
    deployment: this.deployment,
  });

  constructor(private configService: ConfigService) {}

  async getMessagesData(request: any): Promise<any> {
    const fileContent = fs.readFileSync('./file.txt', 'utf-8');

    const result = await this.client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Analyze the following document: \n\n${fileContent}`,
        },
        {
          role: 'user',
          content: request.message,
        },
      ],
      model: '',
    });

    for (const choice of result.choices) {
      return choice.message;
    }
  }

  // getChatOpenaiResponse(message: AzureOpenAI.ChatCompletion): IChatResponse {
  //   return {
  //     success: true,
  //     result: message?.choices?.length && message?.choices[0],
  //   };
  // }
}
