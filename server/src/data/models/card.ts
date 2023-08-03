import { randomUUID } from 'crypto';

class Card {
  public id: string;

  public name: string;

  public description: string;

  public createdAt: Date;

  public constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.id = randomUUID();
  }

  public updateCardName(name: string) {
    this.name = name
  }

  public updateCardDescription(description: string) {
    this.description = description
  }

  //PATTERN: Prototype

  public clone(){
    return new Card(this.name, this.description)
  }
}

export { Card };
