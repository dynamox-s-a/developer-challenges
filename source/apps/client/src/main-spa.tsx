'use client';

import { Provider } from 'react-redux';
import { store } from 'store/store';
import { RouterProvider } from 'react-router-dom';
import router from 'routes/router';

const MainSPA = () => {
  return (
    <Provider store={store}>
      <link rel="icon" href="/favicon-light.png" sizes="any" media="(prefers-color-scheme: dark)"/>
      <link rel="icon" href="/favicon-dark.png" sizes="any" media="(prefers-color-scheme: light)"/>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default MainSPA;
