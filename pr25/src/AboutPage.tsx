import { Component } from 'react';
import { Link } from 'react-router-dom';

class AboutPage extends Component {
    render() {
        return (
            <div>
                <h1>О нас</h1>
                
                <h3><Link to="/">Главная страница</Link></h3>
            </div>
        );
    }
}

export default AboutPage;