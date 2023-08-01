import type { DraggableLocation } from '@hello-pangea/dnd';

import { Card, List } from '../common/types';

function reorderLists<T>(items: T[], startIndex: number, endIndex: number): T[] {
  const [removed] = items.splice(startIndex, 1);
  return [
    ...items.slice(0, endIndex),
    removed,
    ...items.slice(endIndex)
  ];
}

function reorderCards(
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation,
): List[] {
  const currentList = lists.find((list) => list.id === source.droppableId);
  const current: Card[] = (currentList?.cards || []).slice();

  const nextList = lists.find((list) => list.id === destination.droppableId);
  const next: Card[] = (nextList?.cards || []).slice();

  const target: Card = current[source.index];

  const isMovingInSameList = source.droppableId === destination.droppableId;

  if (isMovingInSameList) {
    const reordered: Card[] = reorderLists(current, source.index, destination.index);

    return lists.map((list) =>
      list.id === source.droppableId ? { ...list, cards: reordered } : list,
    );
  }

  const newLists = lists.map((list) => {
    if (list.id === source.droppableId) {
      return {
        ...list,
        cards: removeCardFromList(current, source.index),
      };
    }

    if (list.id === destination.droppableId) {
      return {
        ...list,
        cards: addCardToList(next, destination.index, target),
      };
    }

    return list;
  });

  return newLists;
}

function removeCardFromList(cards: Card[], index: number): Card[] {
  return [...cards.slice(0, index), ...cards.slice(index + 1)];
}

function addCardToList(cards: Card[], index: number, card: Card): Card[] {
  return [...cards.slice(0, index), card, ...cards.slice(index)];
}

export const reorderService = {
  reorderLists,
  reorderCards,
};