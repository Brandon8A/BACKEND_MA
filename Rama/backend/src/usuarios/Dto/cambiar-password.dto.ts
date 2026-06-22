import {
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CambiarPasswordDto {

  @IsNotEmpty()
  passwordActual!: string;

  @IsNotEmpty()
  @MinLength(6)
  passwordNueva!: string;

}