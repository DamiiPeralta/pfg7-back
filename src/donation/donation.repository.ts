import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from './donation.entity';
import { Credentials } from 'src/credentials/credentials.entity';
import { User } from 'src/user/user.entity';
import { CreateDonationDto } from './donation.dto';

@Injectable()
export class DonationRepository {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getDonations(): Promise<Partial<Donation[]>> {
    try {
      console.log('before')
      const donations = await this.donationRepository.find({
        relations: ['user'],
        select: {
          donation_id: true,
          amount: true,
          date: true,
          user: {
            name: true,
            user_id: true,
            credentials: {
              email: true,
              nickname: true,
            }
          }
        },
      });
    //console.log(JSON.parse(JSON.stringify(donations)));
    return donations;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve donations');
    }
  }

  async findDonationsById(id: string): Promise<Donation> {
    try {
      const donation = await this.donationRepository.findOne({
        where: { donation_id: id },
        relations: ['users', 'credentials'],
      });
      if (!donation) {
        throw new NotFoundException(`Donation with ID ${id} not found`);
      }
      return donation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the donation');
    }
  }
  async findDonationsByUserId(id: string): Promise<Donation[]> {
    try {
        const user = await this.usersRepository.findOne({
          where: { user_id: id },
          relations: ['donations'],
        })
      const donations = user.donations;
      if (!donations) {
        throw new NotFoundException(`Donations form user ID ${id} not found`);
      }
      return donations;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the user');
    }
  }

  async createDonation(createDonationDto: CreateDonationDto): Promise<Donation> {
    const { amount, date, user_id } = createDonationDto;

    const user = await this.usersRepository.findOne({
        where: { user_id: user_id },
    })
    if(!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const donationToCreate: Donation = new Donation();
    donationToCreate.amount = amount;
    donationToCreate.date = date;
    donationToCreate.user = user;

    try {
      const newDonation = this.donationRepository.create(donationToCreate);
      return await this.donationRepository.save(newDonation);
    } catch (error) {
      throw new BadRequestException('Failed to create donation');
    }
  }

}
