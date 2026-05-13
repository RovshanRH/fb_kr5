import { Component } from 'react';
import { Link } from 'react-router-dom';

class MainPage extends Component {
    render() {
        return (
            <div>
                <h1>Главная страница</h1>
                <h3><Link to="/about">О нас</Link></h3>
            </div>
        );
    }
}

export default MainPage;