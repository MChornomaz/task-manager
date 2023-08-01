import { colors } from '@atlaskit/theme';
import styled from '@emotion/styled';

import { BORDER_RADIUS } from '../../../common/constants';

const Button = styled.button`
  background-color: ${({ color }) => color || colors.B100};
  border-radius: ${BORDER_RADIUS}px;
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.1em;

  &:focus {
    outline: solid 1px #4c9aff;
  }
`;

export { Button };
