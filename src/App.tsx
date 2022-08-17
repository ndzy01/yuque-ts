import { useRef } from 'react';
import { useMount, useSetState, useVirtualList } from 'ahooks';
import { Button, Drawer, Space, Tag, Tooltip, Spin, Progress } from 'antd';
import { useReq } from './http';

interface DocRecord {
  id: string;
  slug: string;
  title: string;
  description?: string;
  docTitle?: string;
  docSlug?: string;
}

const Detail = ({ url, title }: { url: string; title: string }) => {
  const [state, setState] = useSetState<{
    open: Boolean;
  }>({ open: false });
  return (
    <>
      <Button size="small" onClick={() => setState({ open: true })}>
        查看
      </Button>
      <Drawer
        destroyOnClose
        title="详情"
        placement="right"
        onClose={() => setState({ open: false })}
        visible={state.open as any}
        width="100%"
      >
        <a href={url} target="_blank" rel="noreferrer">
          {title}
        </a>
        <iframe
          title={`${new Date().valueOf()}`}
          style={{
            width: '100%',
            height: 'calc(100% - 50px)',
            paddingLeft: 16,
          }}
          src={`${url}?view=doc_embed&from=asite&outline=1`}
        />
      </Drawer>
    </>
  );
};
const List = ({
  originalList,
  uid,
}: {
  originalList: DocRecord[];
  uid: string;
}) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [list] = useVirtualList(originalList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 60,
    overscan: 10,
  });
  return (
    <div
      ref={containerRef}
      style={{
        height: originalList.length < 10 ? originalList.length * 60 : 600,
        overflow: 'auto',
      }}
    >
      <div ref={wrapperRef}>
        {list.map((ele) => (
          <div
            key={ele.index}
            style={{
              height: 52,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #e8e8e8',
              margin: '4 0',
            }}
          >
            <Space>
              <Tag color="cyan">{ele.data.docTitle}</Tag>
              <Tooltip title={ele.data.description}>
                <Tag color="#108ee9">{ele.data.title}</Tag>
              </Tooltip>
              <Detail
                title={ele.data.title}
                url={`https://www.yuque.com/${uid}/${ele.data.docSlug}/${ele.data.slug}`}
              />
            </Space>
          </div>
        ))}
      </div>
    </div>
  );
};
function App() {
  const [state, setState] = useSetState<{
    list: DocRecord[][];
    uid: string;
    loading: Boolean;
    progress: number;
  }>({ list: [], uid: '', loading: false, progress: 0 });
  const { runAsync } = useReq();

  useMount(async () => {
    setState({ loading: true });
    try {
      const d1 = await runAsync({
        url: '/user',
        method: 'GET',
        data: {},
      });

      setState({ progress: 10 });

      const d2 = await runAsync({
        url: `/users/${d1.data.data.id}/repos`,
        method: 'GET',
        data: {},
      });

      setState({ progress: 20 });

      if (d2.data.data.length > 0) {
        let res: DocRecord[][] = [];
        const average = (0.8 / d2.data.data.length) * 100;
        let progress = 20;

        for (let index = 0; index < d2.data.data.length; index++) {
          progress += average;
          const ele = d2.data.data[index];
          const data = await runAsync({
            url: `/repos/${ele.id}/docs`,
            method: 'GET',
            data: {},
          });

          setState({ progress: Math.floor(progress) });

          res.push(
            (data.data?.data || []).map((item: DocRecord) => ({
              ...item,
              docTitle: ele.name,
              docSlug: ele.slug,
            })),
          );
        }

        setState({ list: res, uid: d1.data.data.id, loading: false });
      }
    } catch (error) {
      setState({ list: [], uid: '', loading: false });
    }
  });

  return (
    <div>
      {state.loading && (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ width: 300 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Spin size="large" />
            </div>
            <Progress percent={state.progress} status="active" />
          </div>
        </div>
      )}
      {state.list.length > 0 &&
        state.list.map((l, index) =>
          l.length ? (
            <div key={index}>
              <List originalList={l} uid={state.uid} />
            </div>
          ) : (
            <div key={index} style={{ border: '1px solid pink' }} />
          ),
        )}
    </div>
  );
}

export default App;
