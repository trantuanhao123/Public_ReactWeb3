import CreatePlayer from './component_page/page/createPlayer.jsx';
import QuestionForm from './component_page/page/questionForm.jsx';
import ThongBao from './component_page/page/thongBao.jsx';
import GetJob from './component_page/page/getJob.jsx';

const routes = [
  {
    path: '/',
    element: (
      <>
        <CreatePlayer />
        <ThongBao />
      </>
    ),
  },
  {
    path: '/question',
    element:
        <>
          <QuestionForm />
          <ThongBao />
        </>
  },
  {
    path: '/getjobs',
    element: <GetJob />,
  },
];
export default routes;