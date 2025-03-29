import React from 'react';
import MainPlayout from './component_page/layout/mainlayout.jsx';
import HomePage from './component_page/page/homepage.jsx';
import CreatePlayer from './component_page/page/createPlayer.jsx'; 
import GetJob from './component_page/page/getJob.jsx'; 
import QuestionForm from './component_page/page/questionForm.jsx';
import ThongBao from './component_page/page/thongBao.jsx'; 
import './style/global.css';

const router = [
  {
    layout: MainPlayout,
    data: [
      {
        path: '/',
        element: <HomePage />,
        showHeader: true,
      },
      {
        path: '/create-player',
        element: <CreatePlayer />,
        showHeader: true,
      },
      {
        path: '/getjobs',
        element: <GetJob />,
        showHeader: true,
      },
      {
        path: '/question-form',
        element: <QuestionForm />,
        showHeader: true,
      },
      {
        path: '/thong-bao',
        element: <ThongBao />,
        showHeader: true,
      },
    ]
  }
];
export default router;