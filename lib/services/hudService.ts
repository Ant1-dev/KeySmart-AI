// lib/services/hudService.ts
import axios from 'axios';
import { Counselor } from '../types';

export class HUDService {
  private baseURL = 'https://data.hud.gov/Housing_Counselor';

  async searchCounselors(
    city: string,
    state: string
  ): Promise<Counselor[]> {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          City: city,
          State: state
        }
      });

      // Transform HUD API response to our format
      const counselors: Counselor[] = response.data
        .slice(0, 10) // Limit to 10
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ({
          id: item.agcid || Math.random().toString(),
          name: item.nme || 'Housing Counselor',
          address: {
            street: item.adr1 || '',
            city: item.city || city,
            state: item.state || state,
            zip: item.zipcd || ''
          },
          phone: item.phone1 || '',
          website: item.weburl || undefined,
          email: item.email || undefined,
          services: this.parseServices(item.services),
          languages: item.languages ? item.languages.split(',') : ['English']
        }));

      return counselors;
    } catch (error) {
      console.error('HUD API Error:', error);
      // Return mock data if API fails
      return this.getMockCounselors(city, state);
    }
  }

  private parseServices(servicesString: string): string[] {
    if (!servicesString) return ['Pre-purchase counseling'];
    // Parse services from HUD format
    return servicesString.split(',').map(s => s.trim()).slice(0, 5);
  }

  private getMockCounselors(city: string, state: string): Counselor[] {
    return [
      {
        id: '1',
        name: `${city} Housing Services`,
        address: {
          street: '123 Main St',
          city: city,
          state: state,
          zip: '00000'
        },
        phone: '(555) 123-4567',
        website: 'https://example.org',
        services: [
          'Pre-purchase counseling',
          'Credit counseling',
          'Down payment assistance'
        ],
        languages: ['English', 'Spanish']
      }
    ];
  }
}

export const hudService = new HUDService();