import { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from './MainPage';
import AboutPage from './AboutPage';

class App extends Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                <Routes>
                    <Route path='/' element={<MainPage/>}></Route>
                    <Route path='/about' element={<AboutPage/>}></Route>

                </Routes>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;