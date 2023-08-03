import type { Socket } from 'socket.io';

import { CardEvent } from '../common/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.RENAME, ({ listId, cardId, name, description })=> {
      this.updateCard({ listId, cardId, name, description })
    });
    socket.on(CardEvent.CHANGE_DESCRIPTION, ({ listId, cardId, name, description })=> {
      this.updateCard({ listId, cardId, name, description })
    });
  }

  public createCard(listId: string, cardName: string): void {
    const newCard = new Card(cardName, '');
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list,
    );

    this.db.setData(updatedLists);
    this.updateLists();
  }



  private updateCard({ listId, cardId, name, description }: 
    { listId: string, cardId: string, name: string, description: string }): void{
    const lists = this.db.getData();
    const selectedList = lists.find(list => list.id === listId);
    if (selectedList) {
      const selectedCard = selectedList.cards.find(card => card.id === cardId)
      if (selectedCard) {
        if(name !== undefined){
          selectedCard.updateCardName(name)
        }
        if(description !== undefined){
          selectedCard.updateCardDescription(description)
        }
        this.updateLists();
      }
    }
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
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
  }
}
