export interface Game {
    id: string;
    title: string;
    banner_image: string;
    url: string;
  }
  
  export interface GameCardProps {
    game?: Game;
    isSpecial?: boolean;
    specialTitle?: string;
    specialUrl?: string;
  }