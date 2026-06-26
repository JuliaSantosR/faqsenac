import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { UsersService } from './users.service';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: RequestWithUser) {
    return this.usersService.findById(req.user.sub);
  }
}
