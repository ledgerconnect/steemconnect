import React, { PropTypes } from 'react';
import { Badge } from 'antd';
import Avatar from '../../../widgets/Avatar';
import './TransferDelegate.less';

const SignPlaceholderDefault = ({
  query,
}) => <div className="Placeholder__operation-content">
  <div className="TransferInfo">
    <div className="TransferInfo__accounts">
      <div className="TransferInfo__account">
        <Avatar username={query.fromName} size="60" className="TransferInfo__avatar" />
        <br />
        <span className="TransferInfo__username">
          {query.fromName || 'You'}
        </span>
        <span className="TransferInfo__dots" />
      </div>
      <div className="TransferInfo__account">
        <span className="TransferInfo__dots" />
        <Avatar username={query.toName} size="60" className="TransferInfo__avatar" />
        {query.toReputation && <span className="TransferInfo__reputation"><Badge count={query.toReputation} style={{ backgroundColor: '#49a9ee' }} /></span>}
        <br />
        <span className="TransferInfo__username">
          {query.toName}
        </span>
      </div>
    </div>
    <strong>{query.amount}</strong>
    {query.memo && <span className="Placeholder__memo">{query.memo}</span>}
  </div>
</div>
;

SignPlaceholderDefault.propTypes = {
  query: PropTypes.shape(),
};

export default SignPlaceholderDefault;
