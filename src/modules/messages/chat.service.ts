import { Injectable } from '@nestjs/common';
import { MessageExceptions } from './enum/exceptions.enum';
import { ValidationService } from 'src/modules/validation/validation.service';
import { ChatsMessages } from 'src/models/entities';
import { CreateMessageDto } from './dtos/create-message.dto';
import { GetManyMessagesDto } from './dtos/get-many-messages.dto';
import { AzureOpenAI } from 'openai';
import { ChatRole } from 'src/models/enum/ChatRole';
const fs = require('fs');
import axios from 'axios';
const mammoth = require('mammoth');
import { FileService } from '../file/file.service';
import Tesseract from 'tesseract.js';
import { getPngText } from 'src/functions/getPngText';
import { getPdfText } from 'src/functions/getPdfText';
import { getPptxText } from 'src/functions/getPptxText';
import { splitTextIntoChunks } from 'src/functions/splitTextIntoChunks';
import { assembleChunks } from 'src/functions/handleOverlap';

@Injectable()
export class ChatService {
  private client = new AzureOpenAI({
    endpoint: process.env.OPENAI_ENDPOINT,
    apiKey: process.env.OPENAI_API_KEY,
    apiVersion: process.env.OPENAI_API_VERSION,
    deployment: process.env.OPENAI_DEPLOYMENT,
  });

  constructor(
    private readonly validationService: ValidationService,
    private readonly fileService: FileService,
  ) {}

  async createChat() {
    const files: any = await this.fileService.getAllFiles();
    let combinedData = '';

    files.rows.forEach((el) => console.log(el.mimetype));

    await Promise.all(
      files.rows.map(async (file) => {
        if (file.mimetype === 'text/plain') {
          const response = await axios.get(file.url);
          const data = response.data;
          combinedData += data + '\n';
        } else if (
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpeg'
        ) {
          const data = await getPngText(file.url);
          combinedData += data + '\n';
        } else if (file.mimetype === 'application/pdf') {
          const data = await getPdfText(file.url);
          combinedData += data + '\n';
        } else if (
          file.mimetype ===
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ) {
          const data = await getPptxText(file.url);
          combinedData += data + '\n';
        } else {
          const match = file?.name.match(/\.(.*)/);
          const substring = match ? match[1] : null;
          if (substring !== 'docx') {
            return;
          } else {
            const response = await axios.get(file.url, {
              responseType: 'arraybuffer',
            });
            const arrayBuffer = response.data;
            const buffer = Buffer.from(arrayBuffer);
            const result = await mammoth.extractRawText({ buffer: buffer });
            const text = result.value;

            const data = text;
            combinedData += data + '\n';
          }
        }
      }),
    );

    await fs.writeFile('file.txt', combinedData, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Common file success generated');
      }
    });

    return 'Common file success generated';
  }

  async createMessage({ ...pureDto }: CreateMessageDto, userId: string) {
    await ChatsMessages.create({ ...pureDto, userId, role: ChatRole.USER });

    const answer = await this.getMessagesData(
      pureDto.message,
      pureDto.isInternal,
    );

    await ChatsMessages.create({
      message: answer.content,
      userId,
      role: answer.role,
    });

    return this.getLastMessage(userId);
  }

  async getMessages(userId: string, params: GetManyMessagesDto) {
    // const chatId = await this.getChatIdByUserId(userId)

    return await ChatsMessages.findAndCountAll({
      where: { userId },
      distinct: true,
      order: [
        [params.sortField || 'creationDate', params.sortDirection || 'DESC'],
      ],
      offset: params.page * params.size - params.size,
      limit: params.size,
    });
  }

  async getLastMessage(userId: string) {
    return await ChatsMessages.findOne({
      where: { userId },
      order: [['creationDate', 'DESC']],
    });
  }

  // async getChatIdByUserId(userId: string) {
  //   const chat: any = await this.validationService.getModelWithThrow({
  //     modelCtor: Chat,
  //     message: MessageExceptions.NOT_FOUND,
  //     criteria: { userId },
  //   });

  //   const chatId = chat.id
  //   return chatId
  // }

  async deleteMessageById(id: string) {
    const message: any = await this.validationService.getModelWithThrow({
      modelCtor: ChatsMessages,
      message: MessageExceptions.NOT_FOUND,
      criteria: { id },
    });

    await message.destroy();

    return { id };
  }

  async getMessagesData(message: string, isInternal?: boolean): Promise<any> {
    if (isInternal) {
      const fileContent = fs.readFileSync('./file.txt', 'utf-8');

      const chunks = splitTextIntoChunks(fileContent, 1000000, 1000);

      let fullOutput = await Promise.all(
        chunks.map(async (el, index) => {
          const response = await this.client.chat.completions.create({
            messages: [
              {
                role: ChatRole.USER,
                content: `Analyze the following text: \n\n${el}]}`,
              },
              {
                role: ChatRole.USER,
                content: `${message} and if you dont find any information about this question please say: no info`,
              },
            ],
            model: '',
          });

          for (const choice of response.choices) {
            return choice.message.content; // Combine the outputs
          }
        }),
      );

      let resultText = '';
      fullOutput.forEach((el) => {
        if (el !== 'No info.' && el !== 'No info' && el !== 'no info') {
          resultText += ' ' + el;
        }
      });
      if (resultText === '') {
        resultText = 'Information in these files not found';
      }
      return { content: resultText };
    } else {
      const result = await this.client.chat.completions.create({
        messages: [
          {
            role: ChatRole.USER,
            content: message,
          },
        ],
        model: '',
      });

      for (const choice of result.choices) {
        return choice.message;
      }
    }
  }

  async clearChat(userId: string) {
    return await ChatsMessages.destroy({ where: { userId } });
  }
}
