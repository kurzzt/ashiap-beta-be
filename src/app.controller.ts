import { Body, Controller, Get, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TransformInterceptor } from 'utils/response.interceptor';
import { LoginDto } from './auth/login.dto';
import { Public } from 'src/auth/public.decorator';
import { ResponseMessage } from 'utils/response_message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
@UseInterceptors(TransformInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @ResponseMessage('Logged In')
  @Post('login')
  async login(
    @Body() body: LoginDto
  ) {
    return this.appService.signIn(body)
  }

  @Post('file')
  @ResponseMessage('File Uploaded')
  @UseInterceptors(FileInterceptor('file'))
  async globalUploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: new RegExp(/(jpg|jpeg|png)$/),
        })
        .addMaxSizeValidator({
          maxSize: 10000000 //bytes
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    ) file: Express.Multer.File
  ) {
    return this.appService.uploadSingleFile(file)
  }
}
