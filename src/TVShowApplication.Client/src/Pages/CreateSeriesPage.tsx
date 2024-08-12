import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Trash, PlusSquareFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { formatRoute, Routes } from "../apiRoutes";
import { useAuthState } from "../AuthProvider";
import { useAxiosContext } from "../AxiosInstanceProvider";
import { Genre } from "../Models/GenreModels";
import { CreateSeriesDTO } from "../Models/SeriesModels";
import './CSS/GenreList.css';

function CreateSeriesPage(props: any) {
    const authAxios = useAxiosContext();
    const auth = useAuthState();
    const navigate = useNavigate();

    const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);

    const [name, setName] = useState<string>();
    const [description, setDescription] = useState<string | null>(null);
    const [imagePath, setImagePath] = useState<string | null>(null);
    const [directors, setDirectors] = useState<string[]>([]);
    const [starringCast, setStarringCast] = useState<string[]>([]);
    const [genreIds, setGenreIds] = useState<number[]>([]);

    useEffect(() => {

        const fetchGenres = async () => {
            const route = Routes.GetGenres;

            try {

                const response = await authAxios.get<Genre[]>(route);

                if (response.status != 200) {
                    throw Error('Could not fetch genres');
                }

                setAvailableGenres(response.data);

            } catch (e) {
                console.error(e);

                return Promise.reject(e);
            }
        };

        fetchGenres();

    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (genreIds.length < 1 || !name) {
            return;
        }

        const route = formatRoute(Routes.CreateSeries, genreIds[0].toString());
        const request: CreateSeriesDTO = {
            name: name!,
            description: description,
            directors: directors,
            starringCast: starringCast,
            coverImagePath: imagePath,
            poster: auth.user!.Id,
            genres: genreIds,
        };

        try {

            const response = await authAxios.post(route, request);

            if (response.status !== 201) {
                throw Error("Could not create series");
            }

            navigate(`/genre/${genreIds[0]}`);

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

    const handleAddGenre = () => {
        setGenreIds([...genreIds, availableGenres[0].id]);
    };

    const handleRemoveGenre = (idx: number) => () => {
        setGenreIds(genreIds.filter(
            (g, i) => idx !== i
        ));
    };

    const handleGenreValueChange = (idx: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newGenres = genreIds.map((g, i) => {
            if (idx !== i) return g;

            return parseInt(event.target.value);
        });

        setGenreIds(newGenres);
    };

    const genreOptions = availableGenres.map((genre, idx) => (
        <option key={idx} value={genre.id}>{genre.name}</option>
    ));

    return (
        <Container>
            <Row lg={4}>
                <Col lg={4}>
                    <h1 className="text-center m-3">Post Series</h1>
                    <form method="post" className="mw-100" onSubmit={e => handleSubmit(e)}>
                        <div className="form-group mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" name="name" id="name" onChange={e => setName(e.target.value)} />
                            {!name &&
                                <p className="text-muted">Name cannot be empty</p>
                            }
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <input type="text" className="form-control" name="description" id="description" onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="imagePath" className="form-label">Image URL</label>
                            <input type="text" className="form-control" name="imagePath" id="imagePath" onChange={e => setImagePath(e.target.value)} />
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
                        <div className="form-group mb-3">
                            <label htmlFor="genres" className="form-label">Genres</label>
                            {genreIds.map((genreId, idx) => (
                                <div key={idx} className="array-input-row">
                                    <select className="form-control" value={genreId} onChange={handleGenreValueChange(idx)}>
                                        {genreOptions}
                                    </select>
                                    <div onClick={handleRemoveGenre(idx)}>
                                        <Trash size={32} />
                                    </div>
                                </div>
                            ))}
                            <div onClick={handleAddGenre}>
                                <PlusSquareFill size={32} />
                            </div>
                            {genreIds.length == 0 &&
                                <p className="text-muted">Need at least 1 genre</p>
                            }
                        </div>
                        <input type="submit" className="btn btn-primary" />
                    </form>
                </Col>
            </Row>
        </Container>
    );
}

export default CreateSeriesPage;