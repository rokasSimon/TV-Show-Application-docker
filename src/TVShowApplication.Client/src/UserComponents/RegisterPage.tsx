import { useState } from "react";
import { Container } from "react-bootstrap";
import { register, useAuthDispatch } from "../AuthProvider";

function RegisterPage(props: any) {
    const authDispatch = useAuthDispatch();

    let [email, setEmail] = useState<string | null>(null);
    let [password, setPassword] = useState<string | null>(null);
    let [roleSecret, setRoleSecret] = useState<string>('basic-user');

    let [successRegistering, setSuccessRegistering] = useState<boolean | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) return;

        const success = await register(authDispatch, { Email: email, Password: password, RoleSecret: roleSecret });
        setSuccessRegistering(success);
    };

    let responseMessage = undefined;
    if (successRegistering != null && successRegistering == true) {
        responseMessage =
            <div className="jumbotron m-2">
                <p className="text-success">Registration was a success! Try logging in.</p>
            </div>;
    } else if (successRegistering != null && successRegistering == false) {
        responseMessage =
            <div className="jumbotron m-2">
                <p className="text-danger">Failed registration! Try again.</p>
            </div>;
    }

    return (
        <Container className="justify-content-center">
            <h1 className="text-center m-3">Register</h1>
            <form method="post" className="mw-100" onSubmit={e => handleSubmit(e)}>
                <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="text" className="form-control" name="email" id="email" onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" id="password" onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="roleSecret" className="form-label">Role Secret</label>
                    <input type="text" className="form-control" name="roleSecret" id="roleSecret" onChange={e => setRoleSecret(e.target.value)} />
                </div>
                <input type="submit" className="btn btn-primary" />
            </form>
            {responseMessage}
        </Container>
    );
}

export default RegisterPage;