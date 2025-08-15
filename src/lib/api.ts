import axios from 'axios';
import { Game } from '@/types/game';

export class GameAPI {
  private static readonly BASE_URL = 'https://feeds.gamepix.com/v2/json';
  private static readonly SID = '37523';

  static async fetchGames(page = 1, pagination = 24): Promise<Game[]> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}?sid=${this.SID}&pagination=${pagination}&page=${page}`
      );
      
      const gameItems = response.data?.items ?? [];
      
      return gameItems.map((item: any) => ({
        id: item.id,
        title: item.title,
        banner_image: item.banner_image,
        url: item.url,
      }));
    } catch (error) {
      console.error('Failed to fetch games:', error);
      throw new Error('Failed to load games');
    }
  }
}