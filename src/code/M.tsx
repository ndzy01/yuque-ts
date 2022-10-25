import { Button, Input, Modal } from 'antd';
import { useState } from 'react';

const M = (props: any) => {
  const [name, setName] = useState('');

  return (
    <Modal
      {...props}
      footer={<Button onClick={() => props.onOk(name)}>确定</Button>}
    >
      <Input
        style={{ width: '95%' }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Modal>
  );
};

export default M;
