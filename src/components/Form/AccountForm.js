import React from 'react';
import Form from '../../widgets/Form';
import { createSuggestedPassword } from '../../utils/auth';

export default class AccountForm extends Form {
  constructor(props) {
    super(props);
    const password = createSuggestedPassword();
    const data = this.props.data || {
      password,
      steem: '0.000 STEEM',
      vests: '0.000000 VESTS'
    };
    this.state = {
      data,
      valid: {},
    };
  }

  render() {
    const { data } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <div className="block">
          <div className={this.getClasses('name', 'form-group')}>
            <label className="label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              name="name"
              data-validator="isNotUsername"
              onChange={this.onChange}
              defaultValue={data.name}
              maxLength="16"
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="text"
              className="form-control"
              name="password"
              onChange={this.onChange}
              defaultValue={data.password}
            />
            <small>Write down your password and keep it somewhere very safe and secure.</small>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="steem">Steem</label>
            <input
              id="steem"
              type="text"
              className="form-control"
              name="steem"
              onChange={this.onChange}
              defaultValue={data.steem}
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="vests">Vests</label>
            <input
              id="vests"
              type="text"
              className="form-control"
              name="vests"
              onChange={this.onChange}
              defaultValue={data.vests}
            />
          </div>
        </div>
        <div className="form-group py-3 text-center">
          <button
            type="submit"
            className="btn btn-success"
            disabled={this.props.isLoading}
          >
            Continue
          </button>
        </div>
      </form>
    );
  }
}
