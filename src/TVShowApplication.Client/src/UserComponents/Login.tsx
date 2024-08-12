import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { login, useAuthDispatch } from "../AuthProvider";

function Login(props: any) {
    const authDispatch = useAuthDispatch();
    const navigate = useNavigate();

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await login(authDispatch, { Email: email, Password: password });

        navigate('/');
    };

    return (
        <Container>
            <Row lg={4}>
                <Col lg={4}>
                    <h1 className="text-center m-3">Login</h1>
                    <form method="post" className="mw-100" onSubmit={e => handleSubmit(e)}>
                        <div className="form-group mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="text" className="form-control" name="email" id="email" onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" id="password" onChange={e => setPassword(e.target.value)} />
                        </div>
                        <input type="submit" className="btn btn-primary" />
                    </form>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;