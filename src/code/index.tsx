import { useSetState } from 'ahooks';
import { v4 as uuidv4 } from 'uuid';
import FileSaver from 'file-saver';
import { Button, List, message, PageHeader, Popconfirm, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import E from './E';
import M from './M';
interface IRecord {
  id: string;
  name: string;
  code: string;
  [k: string]: any;
}
interface State {
  list: IRecord[];
  open: boolean;
  record?: IRecord;
}
const Code = () => {
  const [state, setState] = useSetState<State>({
    list: [],
    open: false,
    record: undefined,
  });

  const backHome = () => window.history.back();

  const openModal = () => setState({ open: true });

  const download = (list: any[]) => {
    const blob = new Blob([JSON.stringify(list)], {
      type: 'text/plain;charset=utf-8',
    });

    FileSaver.saveAs(blob, `code-${new Date().valueOf()}.json`);
  };

  const add = (name: string) => {
    if (!name) {
      message.error('名称不能为空');

      return;
    }

    const record = { id: uuidv4(), name, code: '' };

    setState({ list: [...state.list, record], open: false, record: undefined });

    message.success('已添加');
  };

  const update = (id: string, data: Record<string, any>) => {
    setState({
      list: state.list.map((item) => {
        if (item.id === id) {
          return { ...item, ...data };
        }

        return item;
      }),
    });

    message.success('已更新');
  };

  const edit = (item: IRecord) => setState({ record: item });

  const del = (id: string) => {
    setState({
      list: state.list.filter((item) => item.id !== id),
      record: undefined,
    });

    message.success('已删除');
  };

  const renderItem = (item: IRecord) => (
    <List.Item
      actions={[
        <Button size="small" onClick={() => edit(item)}>
          编辑
        </Button>,
        <Popconfirm
          title="确定要删除"
          onConfirm={() => del(item.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button size="small">删除</Button>
        </Popconfirm>,
      ]}
    >
      {item.name}
    </List.Item>
  );

  const uploadProps: UploadProps = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload(file) {
      const fileReader = new FileReader();

      fileReader.readAsText(file, 'utf-8');
      fileReader.onload = () => {
        setState({ list: JSON.parse(fileReader.result as string) });
      };
    },
  };

  const modalProps = {
    open: state.open,
    onCancel: () => setState({ open: false }),
    onOk: add,
  };

  const editorProps = {
    ...(state.record as IRecord),
    onChange: update,
  };

  return (
    <div className="page">
      <PageHeader
        ghost={false}
        onBack={backHome}
        title="code"
        subTitle={
          <Button
            size="small"
            type="link"
            onClick={() =>
              download([
                {
                  id: '95e058ba-6743-4b48-8ac7-304183e5ee94',
                  name: '示例',
                  code: '// 示例',
                },
              ])
            }
          >
            模板
          </Button>
        }
        extra={[
          <Button
            disabled={state.list.length === 0}
            size="small"
            type="primary"
            onClick={openModal}
          >
            新增
          </Button>,
          state.list.length ? (
            <Button
              size="small"
              type="link"
              onClick={() => download(state.list)}
            >
              下载
            </Button>
          ) : (
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} />
            </Upload>
          ),
        ]}
      />
      <List
        size="small"
        rowKey={(r) => r.id}
        dataSource={state.list}
        renderItem={renderItem}
      />
      {state.record && <E {...editorProps} />}
      {state.open && <M {...modalProps} />}
    </div>
  );
};

export default Code;
