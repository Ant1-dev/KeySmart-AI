import axios from 'axios';
import { Counselor } from '../types';

export class HUDService {
  private baseURL = 'https://data.hud.gov/Housing_Counselor';

  async searchCounselors(
    city: string,
    state: string
  ): Promise<Counselor[]> {
    try {
      // Try HUD API first
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          City: city,
          State: state
        },
        timeout: 5000 // 5 second timeout
      });

      // Transform HUD API response to our format
      if (response.data && Array.isArray(response.data)) {
        const counselors: Counselor[] = response.data
          .slice(0, 10)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any, index: number) => ({
            id: item.agcid || `counselor-${index}`,
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
            languages: item.languages ? item.languages.split(',').map((l: string) => l.trim()) : ['English']
          }));

        return counselors;
      }

      // If response is invalid, use mock data
      console.warn('HUD API returned invalid data, using mock counselors');
      return this.getMockCounselors(city, state);

    } catch (error) {
      console.warn('HUD API Error, using mock counselors:', error);
      // Return mock data if API fails
      return this.getMockCounselors(city, state);
    }
  }

  private parseServices(servicesString: string): string[] {
    if (!servicesString) return ['Pre-purchase counseling'];
    return servicesString.split(',').map(s => s.trim()).slice(0, 5);
  }

  private getMockCounselors(city: string, state: string): Counselor[] {
    // State-specific counselor data for demo
    const stateOrgs: { [key: string]: string } = {
      'FL': 'Florida',
      'CA': 'California',
      'TX': 'Texas',
      'NY': 'New York',
      'IL': 'Illinois',
      'PA': 'Pennsylvania',
      'OH': 'Ohio',
      'GA': 'Georgia',
      'NC': 'North Carolina',
      'MI': 'Michigan'
    };

    const stateName = stateOrgs[state] || state;

    return [
      {
        id: '1',
        name: `${city} Housing Development Corporation`,
        address: {
          street: '100 Community Way',
          city: city,
          state: state,
          zip: '00000'
        },
        phone: '(555) 123-4567',
        website: 'https://www.hud.gov/findacounselor',
        services: [
          'Pre-purchase counseling',
          'Credit counseling',
          'Down payment assistance programs',
          'Financial literacy education',
          'Mortgage application assistance'
        ],
        languages: ['English', 'Spanish']
      },
      {
        id: '2',
        name: `${stateName} Community Housing Foundation`,
        address: {
          street: '250 Main Street, Suite 300',
          city: city,
          state: state,
          zip: '00000'
        },
        phone: '(555) 234-5678',
        website: 'https://www.hud.gov/findacounselor',
        email: 'info@housing-foundation.org',
        services: [
          'First-time homebuyer workshops',
          'Budget and debt counseling',
          'Foreclosure prevention',
          'Rental counseling'
        ],
        languages: ['English', 'Spanish', 'Creole']
      },
      {
        id: '3',
        name: `Neighborhood Assistance Center of ${city}`,
        address: {
          street: '789 Oak Avenue',
          city: city,
          state: state,
          zip: '00000'
        },
        phone: '(555) 345-6789',
        website: 'https://www.hud.gov/findacounselor',
        services: [
          'Pre-purchase counseling',
          'Post-purchase counseling',
          'Home equity conversion counseling',
          'Financial capability coaching'
        ],
        languages: ['English']
      },
      {
        id: '4',
        name: `${stateName} Housing Services`,
        address: {
          street: '456 Elm Street',
          city: city,
          state: state,
          zip: '00000'
        },
        phone: '(555) 456-7890',
        website: 'https://www.hud.gov/findacounselor',
        email: 'counseling@housing-services.org',
        services: [
          'Homebuyer education classes',
          'Credit repair guidance',
          'Down payment assistance navigation',
          'Mortgage default counseling'
        ],
        languages: ['English', 'Spanish']
      },
      {
        id: '5',
        name: `United Housing Counseling Center`,
        address: {
          street: '321 Pine Road',
          city: city,
          state: state,
          zip: '00000'
        },
        phone: '(555) 567-8901',
        website: 'https://www.hud.gov/findacounselor',
        services: [
          'Pre-purchase counseling',
          'Financial management coaching',
          'Fair housing advocacy',
          'Homeless prevention services'
        ],
        languages: ['English', 'Spanish', 'Chinese']
      }
    ];
  }
}

export const hudService = new HUDService();