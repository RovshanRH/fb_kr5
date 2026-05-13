import { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// import MainPage from './MainPage';
const MainPage = lazy(() => import('./MainPage'));
// import AboutPage from './AboutPage';
const AboutPage = lazy(() => import('./AboutPage'));

class App extends Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                <Suspense fallback={<div>Загрузка...</div>}>
                    <Routes>
                        <Route path='/' element={<MainPage/>}></Route>
                        <Route path='/about' element={<AboutPage/>}></Route>
                    </Routes>

                </Suspense>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;