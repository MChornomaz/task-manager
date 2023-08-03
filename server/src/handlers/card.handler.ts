import type { Socket } from 'socket.io';

import { CardEvent } from '../common/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';

export class CardHandler extends SocketHandler {
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
        }
        if (description !== undefined) {
          selectedCard.updateCardDescription(description);
        }
      }
      return list;
    });
  }

  private deleteCard(listId: string, cardId: string): void {
    this.updateList(listId, list => {
      list.cards = list.cards.filter((card: Card) => card.id !== cardId);
      return list;
    });
  }

  private cloneCard(listId: string, cardId: string): void {
    this.updateList(listId, list => {
      const selectedCard = list.cards.find((card: Card) => card.id === cardId);
      if (selectedCard) {
        const cardCopy = selectedCard.clone();
        list.setCards(list.cards.concat(cardCopy));
      }
      return list;
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
    }
  }
}
