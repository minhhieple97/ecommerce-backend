import { IsString, IsEmail, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

}
export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}