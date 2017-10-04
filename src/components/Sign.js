import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import steem from 'steem';
import changeCase from 'change-case';
import SignForm from './Form/Sign';
import SignSuccess from './Sign/Success';
import SignError from './Sign/Error';
import SignValidationErrors from './Sign/ValidationErrors';
import { getOperation, parseQuery, validate, normalize } from '../../helpers/operation';
import customOperations from '../../helpers/operations/custom-operations';
import SignPlaceholderDefault from './Sign/Placeholder/Default';
import SignPlaceholderComment from './Sign/Placeholder/Comment';
import SignPlaceholderNonFiltered from './Sign/Placeholder/NonFiltered';
import Loading from '../widgets/Loading';
import './Sign.less';

export default class Sign extends Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    location: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    params: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      type: this.props.params.type,
      query: this.props.location.query,
      normalizedQuery: null,
      step: 'loading',
      success: false,
      error: false,
    };
  }
  async componentWillMount() {
    const { type, query } = this.state;
    if (getOperation(type) === '') {
      this.props.router.push('/404');
    }
    const validationErrors = await validate(type, query);
    if (validationErrors.length > 0) {
      this.setState({ validationErrors, step: 'validationErrors' });
    } else {
      const normalizedQuery = await normalize(type, query);
      this.setState({ step: 'form', normalizedQuery });
    }
  }

  resetForm = () => {
    this.setState({
      step: 'form',
      error: false,
      success: false,
    });
  };

  sign = async (auth) => {
    this.setState({ step: 'loading' });

    const { type, query } = this.state;
    const params = await parseQuery(type, query, auth.username);

    /* Broadcast */
    const customOp = customOperations.find(o => o.operation === changeCase.snakeCase(type));
    const mappedType = customOp ? customOp.type : type;
    steem.broadcast[`${changeCase.camelCase(mappedType)}With`](auth.wif, params, (err, result) => {
      if (!err) {
        this.setState({ success: result });
      } else {
        this.setState({ error: err });
      }
      this.setState({ step: 'result' });
    });
  };

  render() {
    const { step, success, error, validationErrors, normalizedQuery, type } = this.state;
    const op = getOperation(type);
    let Placeholder = SignPlaceholderDefault;
    Placeholder = (type === 'comment') ? SignPlaceholderComment : Placeholder;
    Placeholder = (changeCase.snakeCase(type) === 'profile_update') ? SignPlaceholderNonFiltered : Placeholder;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2">
          {step === 'validationErrors' && <SignValidationErrors errors={validationErrors} />}
          {step === 'form' &&
            <div>
              <Placeholder type={type} query={normalizedQuery} params={op.params} />
              <div className="form-group my-4">
                <button
                  onClick={() => this.setState({ step: 'signin' })}
                  className="btn btn-success"
                >
                  <FormattedMessage id="continue" />
                </button>
              </div>
            </div>
          }
          {step === 'signin' && <SignForm roles={op.roles} sign={this.sign} />}
          {step === 'loading' && <Loading />}
          {step === 'result' && success && <SignSuccess result={success} cb={normalizedQuery.cb} />}
          {step === 'result' && error && <SignError error={error} resetForm={this.resetForm} />}
        </div>
      </div>
    );
  }
}
