import React, { PropTypes } from 'react';

const FieldsetInput = props => (
  <fieldset className={'form-group'}>
    {props.label.length && <label htmlFor={props.name}>{props.label}</label>}
    <input
      type="text"
      className="form-control form-control-lg"
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      onBlur={() => props.validate(props.name)}
      ref={c => (props.formFields[props.name] = c)} //eslint-disable-line
    />
    <div className="form-control-danger">{props.error[props.name]}</div>
  </fieldset>);

FieldsetInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  formFields: PropTypes.shape({}),
  error: PropTypes.shape({}),
};

export default FieldsetInput;
