// import { useMount, useSetState } from 'ahooks';
// import {
//   Button,
//   Drawer,
//   Space,
//   Tag,
//   Tooltip,
//   Spin,
//   Progress,
//   Collapse,
// } from 'antd';
// import { SyncOutlined, EyeOutlined } from '@ant-design/icons';
// import { sortBy } from 'lodash';
// import { useReq } from './http';

// interface DocRecord {
//   id: string;
//   slug: string;
//   title: string;
//   description?: string;
//   docTitle?: string;
//   docSlug?: string;
// }

// const { Panel } = Collapse;

// const Detail = ({ url, title }: { url: string; title: string }) => {
//   const [state, setState] = useSetState<{
//     open: Boolean;
//   }>({ open: false });
//   return (
//     <>
//       <Button size="small" type="link" onClick={() => setState({ open: true })}>
//         查看
//       </Button>
//       <Drawer
//         destroyOnClose
//         title="详情"
//         placement="right"
//         onClose={() => setState({ open: false })}
//         visible={state.open as any}
//         width="100%"
//       >
//         <a href={url} target="_blank" rel="noreferrer">
//           {title}
//         </a>
//         <iframe
//           title={`${new Date().valueOf()}`}
//           style={{
//             width: '100%',
//             height: 'calc(100% - 50px)',
//             paddingLeft: 16,
//           }}
//           src={`${url}?view=doc_embed&from=asite&outline=1`}
//         />
//       </Drawer>
//     </>
//   );
// };
// const List = ({
//   originalList,
//   uid,
// }: {
//   originalList: DocRecord[];
//   uid: string;
// }) => {
//   return (
//     <div>
//       {originalList.map((ele, index) => (
//         <div
//           key={index}
//           style={{
//             height: 52,
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             border: '1px solid #e8e8e8',
//             margin: '4 0',
//           }}
//         >
//           <Space>
//             <Tooltip title={ele.description}>
//               <Tag color="cyan">{ele.title}</Tag>
//             </Tooltip>
//             <Detail
//               title={ele.title}
//               url={`https://www.yuque.com/${uid}/${ele.docSlug}/${ele.slug}`}
//             />
//           </Space>
//         </div>
//       ))}
//     </div>
//   );
// };

// function App() {
//   const [state, setState] = useSetState<{
//     list: DocRecord[][];
//     uid: string;
//     loading: Boolean;
//     progress: number;
//   }>({ list: [], uid: '', loading: false, progress: 0 });
//   const { runAsync } = useReq();

//   const init = async () => {
//     setState({ loading: true, progress: 0 });
//     try {
//       const d1 = await runAsync({
//         url: '/user',
//         method: 'GET',
//         data: {},
//       });

//       setState({ progress: 10 });

//       const d2 = await runAsync({
//         url: `/users/${d1.data.data.id}/repos`,
//         method: 'GET',
//         data: {},
//       });

//       setState({ progress: 20 });

//       if (d2.data.data.length > 0) {
//         let res: DocRecord[][] = [];
//         const average = (0.8 / d2.data.data.length) * 100;
//         let progress = 20;

//         for (let index = 0; index < d2.data.data.length; index++) {
//           progress += average;
//           const ele = d2.data.data[index];
//           const data = await runAsync({
//             url: `/repos/${ele.id}/docs`,
//             method: 'GET',
//             data: {},
//           });

//           setState({ progress: Math.floor(progress) });

//           const doc = (data.data?.data || []).map((item: DocRecord) => ({
//             ...item,
//             docTitle: ele.name,
//             docSlug: ele.slug,
//           }));

//           res.push(sortBy(doc, 'created_at'));
//         }

//         setState({ list: res, uid: d1.data.data.id, loading: false });
//       }
//     } catch (error) {
//       setState({ list: [], uid: '', loading: false });
//     }
//   };

//   useMount(() => init());

//   return (
//     <div>
//       {state.loading && (
//         <div
//           style={{
//             height: '100vh',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//         >
//           <div style={{ width: 300 }}>
//             <div
//               style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}
//             >
//               <Spin size="large" />
//             </div>
//             <Progress percent={state.progress} status="active" />
//           </div>
//         </div>
//       )}
//       {!state.loading && (
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             margin: '8px 0',
//           }}
//         >
//           <Space>
//             <SyncOutlined onClick={init} />
//             <EyeOutlined
//               onClick={() => {
//                 window.open('https://www.yuque.com/u22409297/aqgf01/botzrc');
//               }}
//             />
//           </Space>
//         </div>
//       )}
//       {state.list.length > 0 && (
//         <Collapse>
//           {state.list.map((l, index) =>
//             l.length ? (
//               <Panel header={l[0].docTitle} key={index}>
//                 <List originalList={l} uid={state.uid} />
//               </Panel>
//             ) : null,
//           )}
//         </Collapse>
//       )}
//     </div>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Space } from 'antd';
import Link from './components/Link';
import Code from './code';

const App = () => {
  return (
    <BrowserRouter>
      <div className="center my-8">
        <Space>
          <Link name="主页" url="/"></Link>
          <Link name="Code" url="/code"></Link>
        </Space>
      </div>
      <Routes>
        <Route path="/" element={<>主页</>}></Route>
        <Route path="/code" element={<Code />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
