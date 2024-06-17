import { IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateDonationDto {
  /**
   * The amount donated by the user. Must be a non-empty number.
   * @example 10.50
   */
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  /**
   * The donation date. Must be a non-empty string in the format "YYYY-MM-DD HH:MM:SS".
   * @example "2022-01-01 12:00:00"
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  date: string;

  /**
   * The ID of the user making the donation. Must be a non-empty string.
   * @example "UUIDexample"
   */
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}