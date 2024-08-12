import { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { PlusSquare, PlusSquareFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Routes } from "../apiRoutes";
import { Role } from "../AuthenticationTypes";
import { useAuthState } from "../AuthProvider";
import { useAxiosContext } from "../AxiosInstanceProvider";
import { CreateGenreDTO, Genre } from "../Models/GenreModels";
import './CSS/GenreList.css';

function GenreList(props: any) {
    const authAxios = useAxiosContext();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isCreating, setCreating] = useState(false);
    const [genreName, setGenreName] = useState<string>();
    const [genreDescription, setGenreDescription] = useState<string>();

    const auth = useAuthState();

    const handleShow = () => setCreating(true);
    const handleClose = () => setCreating(false);
    const handleCreate = async () => {

        if (!genreName || !genreDescription) {
            alert('Name and description cannot be empty');
            return;
        }

        const genreToCreate: CreateGenreDTO = {
            name: genreName,
            description: genreDescription
        };

        const route = Routes.CreateGenre;
        try {
            const response = await authAxios.post<Genre>(route, genreToCreate);

            if (response.status != 201) {
                throw Error('Could not create Genre');
            }

            setGenres([...genres, response.data]);
            setGenreName('');
            setGenreDescription('');
            setCreating(false);

        } catch (e) {
            console.log(e);

            return Promise.reject(e);
        }
    }

    useEffect(() => {

        const fetchGenres = async () => {
            const route = Routes.GetGenres;

            try {
                const response = await authAxios.get<Genre[]>(route);

                setGenres(response.data);
                setIsLoading(false);
            } catch (e) {
                console.error(e);
            }

        };

        fetchGenres();

    }, []);

    let body = isLoading
        ? <Spinner animation="border" />
        : genres.map((genre, index) => {
            return (
                <Link key={index} to={`/genre/${genre.id}`} className="genre-item">{genre.name}</Link>
            );
        });

    return (
        <Col>
            <Modal className="text-light" backdrop={true} show={isCreating} onHide={handleClose}>
                <Modal.Header className="bg-dark">
                    <Modal.Title>Create new genre</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark">
                    <form>
                        <div className="form-group mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" name="name" id="name" onChange={e => setGenreName(e.target.value)} value={genreName} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea className="form-control" name="description" id="description" onChange={e => setGenreDescription(e.target.value)} value={genreDescription}></textarea>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer className="bg-dark">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={e => handleCreate()}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <div className="d-flex flex-row">
                    <div className="me-auto">
                        <h1>Available genres</h1>
                    </div>
                    {auth.user && auth.user.Role == Role.Admin &&
                        <div className="mt-auto mb-auto" onClick={handleShow}>
                            <a href="#" className="text-light">
                                <PlusSquare size={32} />
                            </a>
                        </div>
                    }
                </div>
            </Row>
            <Row>
                <hr className="hr" />
                <div className="genre-list">
                    {body}
                </div>
            </Row>
        </Col>
    );
}

export default GenreList;