import { colors } from '@atlaskit/theme';

import { CopyIcon } from '../icons/copy-icon';
import { Button } from './styled/button';

type Props = {
  onClick: () => void;
};

const CopyButton = ({ onClick }: Props) => {
  return (
    <Button className="copy-btn" onClick={onClick} color={colors.N30}>
      <CopyIcon />
    </Button>
  );
};

export { CopyButton };
