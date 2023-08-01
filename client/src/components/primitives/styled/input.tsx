import styled from '@emotion/styled';

import { BORDER_RADIUS } from '../../../common/constants';

type Props = {
  fontSize: 'x-large' | 'large' | 'medium';
  width?: number;
  bold?: boolean;
};

const Input = styled.input<Props>`
  border-radius: ${BORDER_RADIUS}px;
  animation-duration: 0.01s;
  animation-name: mui-auto-fill-cancel;
  border-color: rgba(0, 0, 0, 0.87);
  border-style: none;
  border-width: 1px;
  height: 30px;
  width: ${({ width }) => (width ? width + 'px' : '250px')};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};

  &:focus {
    outline: solid 1px #4c9aff;
  }
`;

export { Input };
