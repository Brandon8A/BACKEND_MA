import {
  IsOptional,
  IsString,
  Length,
  IsDateString,
} from 'class-validator';

export class UpdateProfileDto {

  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @Length(8, 8)
  telefono?: string;

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