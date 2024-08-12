import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AxiosInstanceProvider } from './AxiosInstanceProvider';

function App() {
    return (
        <div className="App d-flex flex-column">
            <TopNavbar />
            <Container className="bg-dark-ov flex-fill">
                <Outlet />
            </Container>
            <Footer />
        </div>
    );
}

export default App;
