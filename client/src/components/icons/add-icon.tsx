import styled from '@emotion/styled';

const Svg = styled.svg`
  color: #ffffff;
  width: 2em;
  height: 2em;
`;

const AddIcon = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M12 5l0 14"></path>
    <path d="M5 12l14 0"></path>
  </Svg>
);

export { AddIcon };
