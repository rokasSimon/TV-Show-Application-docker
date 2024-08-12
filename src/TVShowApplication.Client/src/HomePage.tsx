import { Col, Row } from "react-bootstrap";

function HomePage() {
    return (
        <Col>
            <Row xs={1} className="jumbotron mt-3">
                <h1>TV Show Application</h1>
                <p>Welcome to the home page!</p>
            </Row>
        </Col>
    );
}

export default HomePage;