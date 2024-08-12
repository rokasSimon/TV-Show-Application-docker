import { useEffect, useState } from "react";
import { Badge, Button, Card, CardImg, Col, ListGroup, ListGroupItem, Modal, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatRoute, Routes } from "../apiRoutes";
import { Role } from "../AuthenticationTypes";
import { useAuthState } from "../AuthProvider";
import { useAxiosContext } from "../AxiosInstanceProvider";
import { Genre, UpdateGenreDTO } from "../Models/GenreModels";
import { Series } from "../Models/SeriesModels";
import './CSS/GenreList.css';
import './CSS/Series.css';
import placeholderImage from '../Images/placeholder_img.jpg';
import { capText } from "../Utils";
import { Trash } from "react-bootstrap-icons";

type GenreViewParams = {
    genreId: string
}

function GenreView(props: any) {
    const authAxios = useAxiosContext();
    const auth = useAuthState();
    const [isLoading, setIsLoading] = useState(true);
    const [genre, setGenre] = useState<Genre | null>(null);
    const params = useParams<GenreViewParams>();

    useEffect(() => {

        if (!params.genreId) return;

        const genreId = parseInt(params.genreId);
        if (isNaN(genreId)) return;

        const fetchGenre = async (id: number) => {
            const route = formatRoute(Routes.GetGenre, id.toString());

            try {
                const response = await authAxios.get<Genre>(route);

                setGenre(response.data);
                setIsLoading(false);
            } catch (e) {
                console.error(e);
            }
        };

        fetchGenre(genreId);

    }, []);

    let body;
    if (!auth.user) {
        body = undefined;
    } else if (isLoading) {
        body = <Spinner animation="border" />
    } else if (auth.user.Role == Role.Admin) {
        body = <GenreAdminView genre={genre!} />
    } else {
        body = <GenreBasicView genre={genre!} />
    }

    return (
        <div>
            {body}
        </div>
    );
}

type GenreProps = {
    genre: Genre
}

function GenreBasicView({ genre }: GenreProps) {
    return (
        <div>
            <Col>
                <Row>
                    <div className="d-flex flex-row">
                        <div className="me-auto">
                            <h1>{genre.name}</h1>
                        </div>
                    </div>
                    <hr className="hr" />
                </Row>
                <Row>
                    <div className="jumbotron mt-3">
                        {genre.description}
                    </div>
                    <hr className="hr" />
                </Row>
                <SeriesList genre={genre} />
            </Col>
            
            {/*<h1>{genre.name}</h1>*/}
            {/*<hr className="hr" />*/}
            {/*<div className="jumbotron mt-3">*/}
            {/*    {genre.description}*/}
            {/*</div>*/}
            {/*<hr className="hr" />*/}
            {/*<h2>Series</h2>*/}
            {/*<div className="card-grid">*/}
            {/*    {genre.series.map((series, index) => {*/}
            {/*        return (*/}
            {/*            <SeriesItem key={index} fetchRoute={series} />*/}
            {/*        );*/}
            {/*    })}*/}
            {/*    {genre.series.length == 0 && <p className="text-center fw-light">No series in this genre</p>}*/}
            {/*</div>*/}
        </div>    
    );
}

function GenreAdminView({ genre }: GenreProps) {

    const auth = useAuthState();
    const authAxios = useAxiosContext();
    const params = useParams<GenreViewParams>();
    const navigate = useNavigate();

    const [isDeleting, setDeleting] = useState<boolean>(false);
    const handleShow = () => setDeleting(true);
    const handleClose = () => setDeleting(false);
    const handleDelete = async () => {

        if (genre.series.length != 0) return;

        const route = formatRoute(Routes.DeleteGenre, params.genreId!);

        try {

            const response = await authAxios.delete(route);

            navigate(`/genre`);

        } catch (e) {
            console.error(e);

            return Promise.reject(e);
        }
    }

    const [description, setDescription] = useState<string>(genre.description);
    const handleSave = async () => {

        const updateRequest: UpdateGenreDTO = {
            description: description
        };

        const route = formatRoute(Routes.UpdateGenre, genre.id.toString());
        try {

            const response = await authAxios.patch(route, updateRequest);

            if (response.status != 200) {
                throw Error('Failed to update genre');
            }

        } catch (e) {
            console.error(e);

            return Promise.reject(e);
        }
    };

    return (
        <div>
            <Col>
                <Modal className="text-light" backdrop={true} show={isDeleting} onHide={handleClose}>
                    <Modal.Header className="bg-dark">
                        <Modal.Title>Deleting {genre.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-dark">
                        <p>Are you sure you want to delete this genre?</p>
                    </Modal.Body>
                    <Modal.Footer className="bg-dark">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={e => handleDelete()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Row>
                    <div className="d-flex flex-row">
                        <div className="me-auto">
                            <h1>{genre.name}</h1>
                        </div>
                        {auth.user && auth.user.Role == Role.Admin && genre.series.length == 0 &&
                            <div className="mt-auto mb-auto" onClick={handleShow}>
                                <a href="#" className="text-light">
                                    <Trash size={32} />
                                </a>
                            </div>
                        }
                    </div>
                    <hr className="hr" />
                </Row>
                <Row>
                    <textarea className="form-control jumbotron mb-3" name="description" id="description" value={description} onChange={e => setDescription(e.target.value)} />
                </Row>
                <Row xl={4}>
                    <Button variant="success" className="mb-3" onClick={e => handleSave()}>Save Changes</Button>
                </Row>
                <Row>
                    <hr className="hr" />
                </Row>
                <SeriesList genre={genre} />
            </Col>
        </div>
    );
}

function SeriesList({ genre }: GenreProps) {
    return (
        <Row>
            <h4>Series</h4>
            <div className="card-grid">
                {genre.series.map((series, index) => {
                    return (
                        <SeriesItem key={index} fetchRoute={series} />
                    );
                })}
                {genre.series.length == 0 && <p className="text-center fw-light">No series in this genre</p>}
            </div>
        </Row>
    );
}

type SeriesItemProps = {
    fetchRoute: string
}

function SeriesItem({ fetchRoute }: SeriesItemProps) {
    const authAxios = useAxiosContext();

    const [series, setSeries] = useState<Series | null>(null);

    useEffect(() => {

        const fetchSeries = async () => {

            const route = `/api${fetchRoute}`;

            try {

                const response = await authAxios.get<Series>(route);

                if (response.status !== 200) {
                    throw Error('Could not fetch series');
                }

                setSeries(response.data);

            } catch (e) {
                console.error(e);

                return Promise.reject(e);
            }

        };

        fetchSeries();

    }, []);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.log('Replaced broken image');
        e.currentTarget.src = placeholderImage;
    };

    const cardDescription = series?.description
        ? capText(series.description, 100)
        : undefined;

    const directorBadge = <Badge className="card-badge" key={'start'} bg="primary">Directors</Badge>
    const directors = series != null && series.directors.length != 0
        ? series.directors.map((director, idx) => {
            return (<Badge className="card-badge" key={idx} bg="secondary">{director}</Badge>);
        })
        : [<Badge className="card-badge" key={'none'} bg="warning">No known directors</Badge>];
    const cardDirectors = [directorBadge, ...directors];

    const castBadge = <Badge className="card-badge" key={'start'} bg="primary">Cast</Badge>
    const starringCast = series != null && series.starringCast.length != 0
        ? series.starringCast.map((cast, idx) => {
            return (<Badge className="card-badge" key={idx} bg="secondary">{cast}</Badge>);
        })
        : [<Badge className="card-badge" key={'none'} bg="warning">No known cast</Badge>];
    const cardCast = [castBadge, ...starringCast];

    const body = series === null
        ? <Spinner animation="border" />
        :
        <Card className="card-item" bg="dark" text="white">
            <Card.Img className="capped-img" variant="top" src={series.coverImagePath
                ? series.coverImagePath
                : placeholderImage
            } onError={e => handleImageError(e)} />
            <Card.Body>
                <div style={{ marginBottom: '1em' }}>
                    <Card.Title>{series.name}</Card.Title>
                    <Card.Text>
                        {cardDescription}
                    </Card.Text>
                </div>
                <ListGroup className="card-badges">
                    <ListGroupItem className="bg-dark">{cardDirectors}</ListGroupItem>
                    <ListGroupItem className="bg-dark">{cardCast}</ListGroupItem>
                </ListGroup>
            </Card.Body>
        </Card>

    return (
        <div className="series-item">
            <Link to={fetchRoute}>
                {body}
            </Link>
        </div>
    );
}
export default GenreView;