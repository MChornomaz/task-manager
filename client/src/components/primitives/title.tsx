import { ChangeEvent, useEffect, useState } from 'react';

import { useComponentVisible } from '../../hooks/useComponentVisible';
import { BasicTitle } from './styled/basic-title';
import { TitleContainer } from './styled/title-container';
import { TitleInput } from './styled/title-input';

type Props = {
  fontSize: 'x-large' | 'large' | 'medium';
  bold?: boolean;
  title: string;
  width?: number;
  onChange: (value: string) => void;
};

export const Title = ({ onChange, title, fontSize, bold, width }: Props) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const [value, setValue] = useState(title);

  useEffect(() => setValue(title), [title]);

  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <TitleContainer className="title-container" ref={ref}>
      {isComponentVisible ? (
        <TitleInput
          className="title-input"
          value={value}
          onChange={onEdit}
          onBlur={() => setIsComponentVisible(false)}
          fontSize={fontSize}
          bold={bold}
          autoFocus={isComponentVisible}
          width={width ?? 250}
        />
      ) : (
        <BasicTitle
          className="title-content"
          onClick={() => setIsComponentVisible(true)}
        >
          {value}
        </BasicTitle>
      )}
    </TitleContainer>
  );
};
