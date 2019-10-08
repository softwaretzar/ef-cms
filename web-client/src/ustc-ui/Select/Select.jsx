import { connect } from '@cerebral/react';
import React from 'react';
import classNames from 'classnames';

export const Select = connect(props => {
  const {
    disabled,
    error,
    formatter,
    id,
    keys,
    label,
    name,
    onChange,
    values,
  } = props;
  const ariaDisabled = props['aria-disabled'];

  return (
    <div
      className={classNames('usa-form-group', error && 'usa-form-group--error')}
    >
      <label className="usa-label" htmlFor={id}>
        {label}
      </label>
      <select
        aria-disabled={ariaDisabled}
        className={classNames('usa-select', error && 'usa-select--error')}
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
      >
        <option value="">- Select -</option>
        {values.map(value => (
          <option key={keys(value)} value={keys(value)}>
            {formatter(value)}
          </option>
        ))}
      </select>
      {error && <div className="usa-error-message beneath">{error}</div>}
    </div>
  );
});
