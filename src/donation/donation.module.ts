import { Module } from '@nestjs/common';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { User } from 'src/user/user.entity';
import { DonationRepository } from './donation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Donation, User])],
  providers: [DonationService, DonationRepository],
  controllers: [DonationController],
})
export class DonationModule {}
