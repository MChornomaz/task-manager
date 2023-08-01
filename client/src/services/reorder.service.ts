import type { DraggableLocation } from '@hello-pangea/dnd';

import { Card, List } from '../common/types';

export const reorderService = {
  reorderLists(items: List[], startIndex: number, endIndex: number): List[] {
    const [removed] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, removed);

    return items;
  },

  reorderCards(
    lists: List[],
    source: DraggableLocation,
    destination: DraggableLocation,
  ): List[] {
    const current: Card[] =
      lists.find((list) => list.id === source.droppableId)?.cards || [];
    const next: Card[] =
      lists.find((list) => list.id === destination.droppableId)?.cards || [];
    const target: Card = current[source.index];

    const isMovingInSameList = source.droppableId === destination.droppableId;

    if (isMovingInSameList) {
      const [removed] = current.splice(source.index, 1);
      current.splice(destination.index, 0, removed);
      const reordered: Card[] = current;

      return lists.map((list) =>
        list.id === source.droppableId ? { ...list, cards: reordered } : list,
      );
    }

    const newLists = lists.map((list) => {
      if (list.id === source.droppableId) {
        return {
          ...list,
          cards: this.removeCardFromList(current, source.index),
        };
      }

      if (list.id === destination.droppableId) {
        return {
          ...list,
          cards: this.addCardToList(next, destination.index, target),
        };
      }

      return list;
    });

    return newLists;
  },

  removeCardFromList(cards: Card[], index: number): Card[] {
    return cards.slice(0, index).concat(cards.slice(index + 1));
  },

  addCardToList(cards: Card[], index: number, card: Card): Card[] {
    return cards.slice(0, index).concat(card).concat(cards.slice(index));
  },
};
