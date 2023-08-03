import type { Server, Socket } from 'socket.io'; 
import path from 'path';

import { CardEvent } from '../common/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';
import { ErrorLogger, Logger } from '../logger/logger';
import { FileLogger } from '../logger/log-file';
import { Database } from '../data/database';
import { ReorderService } from '../services/reorder.service';
import { List } from '../data/models/list';

export class CardHandler extends SocketHandler {
  //PATTERN:Observer    
  private logger: Logger;
  private fileLogger: FileLogger;
  private errorLogger: ErrorLogger;

  constructor(io: Server, db: Database, reorderService: ReorderService) {
    super(io, db, reorderService);
    this.logger = new Logger();
    this.fileLogger = new FileLogger(path.resolve(__dirname, '..', 'logger', 'log.json'));
    this.errorLogger = new ErrorLogger();
    this.logger.subscribe(this.fileLogger.logToFile.bind(this.fileLogger));
    this.logger.subscribeToErrors(this.errorLogger.logToConsole.bind(this.errorLogger));
  }

  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.RENAME, this.updateCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.updateCard.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.CLONE, this.cloneCard.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    const newCard = new Card(cardName, '');
    this.updateList(listId, list => list.setCards(list.cards.concat(newCard)));
    this.logger.log(`Card ${cardName} created`)
  }

  private updateCard({
    listId,
    cardId,
    name,
    description,
  }: {
    listId: string;
    cardId: string;
    name: string;
    description: string;
  }): void {
    this.updateList(listId, list => {
      const selectedCard = list.cards.find((card: Card) => card.id === cardId);
      if (selectedCard) {
        if (name !== undefined) {
          selectedCard.updateCardName(name);
          this.logger.log(`Card renamed: ${cardId} to ${name}`);
        }
        if (description !== undefined) {
          selectedCard.updateCardDescription(description);
          this.logger.log(`Card description changed: ${cardId}`);
        }

      } else {
        this.logger.logError(`Card with ID ${cardId} not found!`);
      }
    });
  }

  private deleteCard(listId: string, cardId: string) {
    this.updateList(listId, (list: List) => {
      const selectedCard = list.cards.find(card => card.id === cardId)
      if(selectedCard === undefined){
        this.logger.logError(`Card with ID ${cardId} not found!`);
      } else {
        list.cards = list.cards.filter((card: Card) => card.id !== cardId);
        this.logger.log(`Card with ID ${cardId} was deleted`);
      }
    });
  }

  private cloneCard(listId: string, cardId: string): void {
    this.updateList(listId, list => {
      const selectedCard = list.cards.find((card: Card) => card.id === cardId);
      if (selectedCard) {
        const cardCopy = selectedCard.clone();
        list.setCards(list.cards.concat(cardCopy));
        this.logger.log(`Card with ID ${cardId} was copied`);
      } else{
        this.logger.logError(`Card with ID ${cardId} not found!`);
      }
    });
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const reordered = this.reorderService.reorderCards({
      lists: this.db.getData(),
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
  }

  private updateList(listId: string, updateFn: (list: any) => void): void {
    const lists = this.db.getData();
    const selectedList = lists.find(list => list.id === listId);
    if (selectedList) {
      updateFn(selectedList);
      this.db.setData(lists);
      this.updateLists();
    } else {
      this.logger.logError(`List with ID ${listId} not found!`);
    }
  }
}
