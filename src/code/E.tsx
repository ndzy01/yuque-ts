import { useState, useEffect } from 'react';
import Editor, { useMonaco, loader } from '@monaco-editor/react';
import { Button, Space } from 'antd';

loader.config({
  paths: {
    vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs',
  },
});

const E = (props: {
  id: string;
  name: string;
  code: string;
  [k: string]: any;
}) => {
  const [code, setCode] = useState(props.code);
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco?.languages.typescript.typescriptDefaults.setEagerModelSync(true);
    }
  }, [monaco]);

  useEffect(() => {
    setCode(props.code);
  }, [props.code]);
  return (
    <div>
      <div className="center my-8">
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => props.onChange(props.id, { code, name: props.name })}
          >
            更新
          </Button>
          <b>{props.name}</b>
        </Space>
      </div>
      <Editor
        height="80vh"
        defaultLanguage="typescript"
        value={code}
        onChange={(c) => setCode(c || '')}
        options={{ selectOnLineNumbers: true }}
        theme="vs-dark"
      />
    </div>
  );
};

export default E;
