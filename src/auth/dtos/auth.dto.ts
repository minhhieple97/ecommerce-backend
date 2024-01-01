import { IsString, IsEmail, MinLength, IsInt } from 'class-validator';


export class SignUpDto {
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
