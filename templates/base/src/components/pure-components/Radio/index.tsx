import classNames from 'classnames';
import { forwardRef,type ReactNode } from 'react';
import { Form } from 'react-bootstrap';

import styles from './styles.module.scss';

export interface RadioProps {
  label?: ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
  name?: string;
  value?: string | number;
  inline?: boolean;
  feedback?: string;
  isValid?: boolean;
  isInvalid?: boolean;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ 
    label,
    checked,
    disabled,
    onChange,
    className,
    id,
    name,
    value,
    inline,
    feedback,
    isValid,
    isInvalid,
    ...props 
  }, ref) => {
    return (
      <Form.Group className={classNames(styles.radioGroup, { [styles.inline]: inline })}>
        <Form.Check
          type="radio"
          id={id}
          ref={ref}
          label={label}
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.checked) {
              onChange?.(true);
            }
          }}
          className={classNames(styles.radio, className)}
          name={name}
          value={value}
          isInvalid={isInvalid}
          isValid={isValid}
          feedback={feedback}
          {...props}
        />
      </Form.Group>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
