import { colors } from '@atlaskit/theme';
import styled from '@emotion/styled';

import { BORDER_RADIUS, GRID } from '../../../common/constants';

type Props = {
  isDragging: boolean;
};

const Container = styled.a<Props>`
  border-radius: ${BORDER_RADIUS}px;
  border: 2px solid transparent;
  border-color: ${({ isDragging }) =>
    isDragging ? colors.N60A : 'transparent'};
  background-color: ${({ isDragging }) =>
    isDragging ? colors.Y50 : colors.N0};
  box-shadow: ${(props) =>
    props.isDragging ? `2px 2px 1px ${colors.N70}` : 'none'};
  box-sizing: border-box;
  padding: ${GRID}px;
  min-height: 40px;
  margin-bottom: ${GRID}px;
  user-select: none;

  color: ${colors.N900};

  &:hover,
  &:active {
    color: ${colors.N900};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${colors.N400A};
    box-shadow: none;
  }

  display: flex;
`;

export { Container };
