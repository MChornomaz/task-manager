import styled from '@emotion/styled';

import { BORDER_RADIUS } from '../../../common/constants';

const TextInput = styled.textarea`
  border-radius: ${BORDER_RADIUS}px;
  animation-duration: 0.01s;
  animation-name: mui-auto-fill-cancel;
  border-color: rgba(0, 0, 0, 0.87);
  border-style: none;
  border-width: 1px;
  height: 50px;
  width: 100%;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: solid 1px #4c9aff;
  }
`;

export { TextInput };
