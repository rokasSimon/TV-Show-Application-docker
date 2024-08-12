import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import HomePage from './HomePage';
import LoginPage from './UserComponents/Login';
import RegisterPage from './UserComponents/RegisterPage';
import GenreList from './Pages/GenreList';
import { AuthProvider } from './AuthProvider';
import { AxiosInstanceProvider } from './AxiosInstanceProvider';
import GenreView from './Pages/GenreView';
import CreateSeriesPage from './Pages/CreateSeriesPage';
import SeriesView from './Pages/SeriesView';
import UpdateSeriesPage from './Pages/UpdateSeriesPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <HomePage />
            },
            {
                path: '/user/login',
                element: <LoginPage />
            },
            {
                path: '/user/register',
                element: <RegisterPage />
            },
            {
                path: '/genre',
                element: <GenreList />
            },
            {
                path: '/genre/:genreId',
                element: <GenreView />
            },
            {
                path: '/series/create',
                element: <CreateSeriesPage />
            },
            {
                path: '/genre/:genreId/series/:seriesId',
                element: <SeriesView />
            },
            {
                path: '/genre/:genreId/series/:seriesId/edit',
                element: <UpdateSeriesPage />
            }
        ],
    }
]);

root.render(
    <AuthProvider>
        <AxiosInstanceProvider config={{
            baseURL: "http://tvshowapplication_api:5013"
        }}>
            <RouterProvider router={router} />
        </AxiosInstanceProvider>
    </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
