import type { DraggableProvided } from "@hello-pangea/dnd";
import React, { ChangeEvent, useContext } from "react";

import type { Card } from "../../common/types";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";
import { SocketContext } from "../../context/socket";
import { CardEvent } from "../../common/enums";

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  listId: string
};

export const CardItem = ({ card, isDragging, provided, listId }: Props) => {

  const socket = useContext(SocketContext)

  const updateCardTitleHandler = (value: string) => {
    if (value.trim().length > 0) {
      socket.emit(CardEvent.RENAME, { listId, cardId: card.id, name: value })
    }
  }

  const updateCardDescriptionHandler = (value: string) => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, { listId, cardId: card.id, description: value })
  }

  const deleteCardHandler = () => {
    socket.emit(CardEvent.DELETE, listId, card.id)
  }

  const copyCardHandler = () => {
    socket.emit(CardEvent.CLONE, listId, card.id)
  }


  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={updateCardTitleHandler}
          title={card.name}
          fontSize="large"
          bold={true}
        />
        <Text text={card.description} onChange={updateCardDescriptionHandler} />
        <Footer>
          <DeleteButton onClick={deleteCardHandler} />
          <Splitter />
          <CopyButton onClick={copyCardHandler} />
        </Footer>
      </Content>
    </Container>
  );
};
