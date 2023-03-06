import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private jwtService: JwtService) {}

  private generateEmailVerificationToken(user: User) {
    const token = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '1h' },
    );
    return token;
  }
  async sendEmailVerification(user: User) {
    const testAccount = await nodemailer.createTestAccount();
    const token = this.generateEmailVerificationToken(user);
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Fred uptime 👻" <uptime@example.com>', // sender address
      to: `${user.email}`, // list of receivers
      subject: 'Hello, Email Verification Here ', // Subject line
      text: `Hello ${user.firstName} please click on the like below to verify your email\
      http://localhost:3000/users/${user.id}/verify/${token}`, // plain text body NOTEEEE using localhost temporarliy
    });

    // console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  verifyEmailToken(token: string) {
    return this.jwtService.verify(token);
  }
}
