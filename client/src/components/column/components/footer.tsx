import { CreatorInput } from '../../primitives/creator-input';
import { FooterContainer } from '../styled/footer-container';

type Props = {
  onCreateCard: (name: string) => void;
};

const Footer = ({ onCreateCard }: Props) => {
  return (
    <FooterContainer className="column-footer-container">
      <CreatorInput onSubmit={onCreateCard} />
    </FooterContainer>
  );
};

export { Footer };
