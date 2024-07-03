/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException,Inject, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { signInDto } from '../users/dto/signIn.Dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { verifyUserDto } from '../users/dto/verifyUser.Dto';
import { Redis } from 'ioredis'; // Import ioredis
//import {REDIS_CLIENT}  from './'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: Redis; // Injecting Redis client

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}


   async signIn(user_data: signInDto): Promise<{ access_token: string; refresh_token: string }> {
     const user = await this.userRepository.findOne({
       where: { email: user_data.email },
     });

     if (!user || !await bcrypt.compare(user_data.password, user.password) || user.isVerified === false) {
       throw new UnauthorizedException();
     }

     const payload = { id: user.id, username: user.username, role: user.role };
     const access_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
     const refresh_token = await this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });

     await this.saveRefreshToken(user.id, refresh_token);

     return {
       access_token,
       refresh_token,
     };
   }

   async refreshToken(refreshTokenDto: string): Promise<{ access_token: string }> {
     const  refreshToken  = refreshTokenDto;

     try {
       const payload = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });

       const storedToken = await this.redisClient.get(`refresh_token:${payload.id}`);
       if (storedToken !== refreshToken) {
         throw new UnauthorizedException('Invalid refresh token');
       }

       const newAccessToken = await this.jwtService.signAsync({ id: payload.id, username: payload.username, role: payload.role }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });

       return { access_token: newAccessToken };
     } catch (error) {
       throw new UnauthorizedException('Invalid refresh token');
     }
   }

   async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
     await this.redisClient.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 days expiration
   }

   async revokeRefreshToken(userId: number): Promise<void> {
     await this.redisClient.del(`refresh_token:${userId}`);
   }


  // Registering a new user and sending an OTP for verification
  async registerUser(data: any): Promise<object> {
    try {
       // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10); // The second parameter is the salt round, adjust as needed

    // Create a new user object with the hashed password
    const userData = { ...data, password: hashedPassword };
      const savedUser = await this.userRepository.save(userData);

      const otp = this.generateOtp();
      await this.saveOtp(savedUser["email"], otp); // Save OTP to Redis
      await this.sendOtpEmail(savedUser['email'], otp);

      return savedUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException('Failed to create user');
    }
  }

  // Generate and send OTP to user email
  async generateAndSendOtp(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = this.generateOtp();
    await this.saveOtp(email, otp); // Save OTP to Redis
    await this.sendOtpEmail(email, otp);

    return { message: 'OTP sent successfully!' };
  }

  // Helper function to generate a random OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  }

  // Helper function to send OTP email
  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '202qasim202@gmail.com', // your Gmail address
        pass: 'icef vinn vehm sowu', // your Gmail password or app password
      },
    });

    const mailOptions = {
      from: '"Qasim Ali" <202qasim202@gmail.com>',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
      html: `<p>Your OTP code is <b>${otp}</b></p>`,
    };

    await transporter.sendMail(mailOptions);
  }

  // Verifying the OTP
  async verify(data: verifyUserDto): Promise<object> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Wrong email address!');
    }

    const storedOtp = await this.retrieveOtp(data.email);

    if (!storedOtp) {
      throw new UnauthorizedException('OTP expired!');
    }

    if (storedOtp === data.otp) {
      await this.redisClient.del(data.email); // Delete OTP from Redis after successful verification

      user.isVerified = true;
      await this.userRepository.save(user);

      const payload = { id: user.id, username: user.username, role: user.role };
      return {
      access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
    };


    } else {
      throw new UnauthorizedException('Invalid OTP');
    }
  }

  // Helper function to save OTP to Redis with expiry
  private async saveOtp(email: string, otp: string): Promise<void> {
    await this.redisClient.set(email, otp, 'EX', 120); // Set OTP with expiry of 120 seconds (2 minutes)
  }

  // Helper function to retrieve OTP from Redis
  private async retrieveOtp(email: string): Promise<string | null> {
    return await this.redisClient.get(email);
  }

  // Returning a user profile
  async getProfile(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    return user;
  }
}









//import { RefreshTokenDto } from '../users/dto/refresh-token.dto';
