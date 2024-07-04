/* eslint-disable prettier/prettier */

import {UseInterceptors,BadRequestException,UploadedFile, Body, Controller, Get, Request, Post, HttpCode, UseGuards, Put, HttpStatus } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { signInDto } from '../users/dto/signIn.Dto';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';
import { ApiConsumes, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { registerUserDto } from '../users/dto/registerUser.Dto';
import { verifyUserDto } from '../users/dto/verifyUser.Dto';
import { RefreshTokenDto } from '../users/dto/RefreshToken.Dto';
import { resendOtpDto } from '../users/dto/resendOtp.Dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage,Multer } from 'multer';
import * as path from 'path';


const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

@HttpCode(HttpStatus.OK)
@Post('login')
signIn(@Body() user_data: signInDto){
    return this.authService.signIn(user_data);
  }
   
  @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
      return this.authService.refreshToken(refreshTokenDto);
    }

//     @Post('logout')
// async logout(@Body('userId') userId: number) {
//   await this.authService.revokeRefreshToken(userId);
//   return { message: 'Logged out successfully' };
// }


  @Post('register')
  @UseInterceptors(FileInterceptor('profilePicture', {
    storage: diskStorage({
      destination: './uploads/profile-pictures',
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const allowedExtensions = ['.jpg', '.jpeg'];

      if (!allowedExtensions.includes(ext)) {
        return cb(new BadRequestException('Only JPEG files are allowed'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES, // 1 MB limit
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        profilePicture: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async register(
    @Body() data: registerUserDto,
    @UploadedFile() file: Multer.File,
  ) {
    if (file) {
      data.profilePictureUrl = file.path; // Store the file path in the DTO
    }
    return this.authService.registerUser(data);
  }


  @Put('verify')
  verify(@Body() user_data: verifyUserDto) {
    return this.authService.verify(user_data);
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: resendOtpDto): Promise<{ message: string }> {
    return this.authService.generateAndSendOtp(body.email);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles([Role.Admin])
  @ApiBearerAuth('JWT')
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.username);
  }
}
