import React from 'react';

const SignSuccess = ({ result }) =>
  <div>
    <h4 className="text-success">Success</h4>
    <p>The operation has been successfully broadcasted.</p>
    <p>
      Ref Block Num:<b> {result.ref_block_num}</b>
      , Ref Block Prefix:<b> {result.ref_block_prefix}</b>
    </p>
  </div>;

export default SignSuccess;
