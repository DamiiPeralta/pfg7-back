import { Injectable } from '@nestjs/common';
import { DonationRepository } from './donation.repository';
import { CreateDonationDto } from './donation.dto';


@Injectable()
export class DonationService {
    constructor(
        private readonly donationsRepository: DonationRepository
    ){}

    async getAllDonations(){
        return await this.donationsRepository.getDonations();
    }

    async getDonationsByUserId(id: string){
        return await this.donationsRepository.findDonationsByUserId(id);
    }

    async createDonation(createDonationDto: CreateDonationDto){
        return await this.donationsRepository.createDonation(createDonationDto)
    }
}
