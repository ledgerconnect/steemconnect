import React, { PropTypes } from 'react';

const FieldSet = props =>
  (<fieldset className={'form-group'}>
    <input
      type="text" placeholder={props.name}
      defaultValue={props.defaultValue}
      className="form-control form-control-lg"
      onBlur={() => props.validate(props.name)}
      ref={c => (props.formFields[props.name] = c)} //eslint-disable-line
    />
    <div className="form-control-feedback">{props.error[props.name]}</div>
  </fieldset>);

FieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  formFields: PropTypes.shape({}),
  error: PropTypes.shape({}),
};

export default FieldSet;
