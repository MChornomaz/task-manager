import { AddIcon } from '../icons/add-icon';
import { Button } from './styled/button';

type Props = {
  onClick: () => void;
};

const AddButton = ({ onClick }: Props) => {
  return (
    <Button className="add-btn" onClick={onClick}>
      <AddIcon />
    </Button>
  );
};

export { AddButton };
