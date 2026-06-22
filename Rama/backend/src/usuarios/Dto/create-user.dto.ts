import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  apellidos!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 50)
  password!: string;

  @Length(8, 8)
  telefono!: string;

  @IsOptional()
  @Length(13, 13)
  dpi?: string;

  @IsOptional()
  @IsString()
  foto_url?: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;
}