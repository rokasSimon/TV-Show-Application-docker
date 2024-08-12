import { useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Trash, PlusSquareFill } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import { formatRoute, Routes } from "../apiRoutes";
import { useAuthState } from "../AuthProvider";
import { useAxiosContext } from "../AxiosInstanceProvider";
import { Genre } from "../Models/GenreModels";
import { Series, UpdateSeriesDTO } from "../Models/SeriesModels";
import './CSS/GenreList.css';

type UpdateSeriesParams = {
    genreId: string,
    seriesId: string,
}

function UpdateSeriesPage(props: any) {
    const authAxios = useAxiosContext();
    const auth = useAuthState();
    const navigate = useNavigate();
    const params = useParams<UpdateSeriesParams>();

    const [isLoading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState<string>();
    const [description, setDescription] = useState<string | null>(null);
    const [imagePath, setImagePath] = useState<string | null>(null);
    const [directors, setDirectors] = useState<string[]>([]);
    const [starringCast, setStarringCast] = useState<string[]>([]);

    useEffect(() => {

        if (!params.genreId || !params.seriesId) {
            navigate('/error');
            return;
        }

        const fetchData = async () => {
            const seriesRoute = formatRoute(Routes.GetSeriesById, params.genreId!, params.seriesId!);

            try {

                const seriesResponse = await authAxios.get<Series>(seriesRoute);

                if (seriesResponse.status != 200) {
                    throw Error('Could not fetch series');
                }

                const s = seriesResponse.data;
                setLoading(false);
                setName(s.name);
                setDescription(s.description);
                setImagePath(s.coverImagePath);
                setDirectors(s.directors);
                setStarringCast(s.starringCast);

            } catch (e) {
                console.error(e);

                return Promise.reject(e);
            }
        };

        fetchData();

    }, []);

    const handleSubmit = async () => {

        const route = formatRoute(Routes.UpdateSeries, params.genreId!, params.seriesId!);
        const request: UpdateSeriesDTO = {
            coverImagePath: imagePath,
            description: description,
            directors: directors,
            starringCast: starringCast,
        };

        try {

            const response = await authAxios.patch(route, request);

            if (response.status !== 200) {
                throw Error("Could not update series");
            }

            navigate(`/genre/${params.genreId!}/series/${params.seriesId}`);

        } catch (e) {
            console.error(e);

            return Promise.reject(e);
        }
    };

    const handleAddDirector = () => {
        setDirectors([...directors, '']);
    };

    const handleRemoveDirector = (idx: number) => () => {
        setDirectors(directors.filter(
            (d, i) => idx !== i
        ));
    }

    const handleDirectorValueChange = (idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDirectors = directors.map((d, i) => {
            if (idx !== i) return d;

            return event.target.value;
        });

        setDirectors(newDirectors);
    };

    const handleAddCast = () => {
        setStarringCast([...starringCast, '']);
    };

    const handleRemoveCast = (idx: number) => () => {
        setStarringCast(starringCast.filter(
            (c, i) => idx !== i
        ));
    };

    const handleCastValueChange = (idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newCast = starringCast.map((c, i) => {
            if (idx !== i) return c;

            return event.target.value;
        });

        setStarringCast(newCast);
    };

    let body;
    if (isLoading) {
        body = <Spinner animation="border" />;
    } else {
        body = <Container>
            <Row lg={4}>
                <Col lg={4}>
                    <h1 className="text-center m-3">Update Series</h1>
                    <form className="mw-100">
                        <div className="form-group mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" name="name" id="name" readOnly value={name} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <input type="text" className="form-control" name="description" id="description" value={description || ''} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="imagePath" className="form-label">Image URL</label>
                            <input type="text" className="form-control" name="imagePath" id="imagePath" value={imagePath || ''} onChange={e => setImagePath(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="directors" className="form-label">Directors</label>
                            {directors.map((director, idx) => (
                                <div key={idx} className="array-input-row">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={"Director's full name"}
                                        value={director}
                                        onChange={handleDirectorValueChange(idx)}
                                    />
                                    <div onClick={handleRemoveDirector(idx)}>
                                        <Trash size={32} />
                                    </div>
                                </div>
                            ))}
                            <div onClick={handleAddDirector}>
                                <PlusSquareFill size={32} />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="starringCast" className="form-label">Starring Cast</label>
                            {starringCast.map((cast, idx) => (
                                <div key={idx} className="array-input-row">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={"Actor's full name"}
                                        value={cast}
                                        onChange={handleCastValueChange(idx)}
                                    />
                                    <div onClick={handleRemoveCast(idx)}>
                                        <Trash size={32} />
                                    </div>
                                </div>
                            ))}
                            <div onClick={handleAddCast}>
                                <PlusSquareFill size={32} />
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={e => handleSubmit()}>Update</button>
                    </form>
                </Col>
            </Row>
        </Container>
    }

    return (
        <div>
            {body}
        </div>
    );
}

export default UpdateSeriesPage;