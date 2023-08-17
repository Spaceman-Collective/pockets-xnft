export interface Unit {
    mint: string;
    name: string;
    skill: string;
    bonus: {
      [skill: string]: number;
    };
  }