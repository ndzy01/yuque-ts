import { useRef } from 'react';
import { useMount, useSetState, useVirtualList } from 'ahooks';
import { Button, Drawer, Space, Tag } from 'antd';
import { useReq } from './http';

interface DocRecord {
  id: string;
  slug: string;
  title: string;
  docTitle?: string;
  docSlug?: string;
}

const Detail = ({ url }: { url: string }) => {
  const [state, setState] = useSetState<{
    open: Boolean;
  }>({ open: false });
  return (
    <>
      <Button onClick={() => setState({ open: true })}>查看</Button>
      <Drawer
        destroyOnClose
        title="详情"
        placement="right"
        onClose={() => setState({ open: false })}
        visible={state.open as any}
        width="100%"
      >
        <a href={url} target="_blank" rel="noreferrer">
          {url}
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
              <Tag>{ele.data.docTitle}</Tag>
              <Tag>{ele.data.title}</Tag>
              <Detail
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
  }>({ list: [], uid: '', loading: false });
  const { runAsync } = useReq();

  useMount(async () => {
    setState({ loading: true });
    try {
      const d1 = await runAsync({
        url: '/user',
        method: 'GET',
        data: {},
      });
      const d2 = await runAsync({
        url: `/users/${d1.data.data.id}/repos`,
        method: 'GET',
        data: {},
      });

      if (d2.data.data.length > 0) {
        let res: DocRecord[][] = [];

        for (let index = 0; index < d2.data.data.length; index++) {
          const ele = d2.data.data[index];
          const data = await runAsync({
            url: `/repos/${ele.id}/docs`,
            method: 'GET',
            data: {},
          });

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
      {state.list.length > 0 &&
        state.list.map((l, index) =>
          l.length ? (
            <List key={index} originalList={l} uid={state.uid} />
          ) : (
            <div key={index} style={{ border: '1px solid pink' }} />
          ),
        )}
    </div>
  );
}

export default App;
