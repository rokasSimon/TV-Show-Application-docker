import { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatRoute, Routes } from "../apiRoutes";
import { Role } from "../AuthenticationTypes";
import { useAuthState } from "../AuthProvider";
import { useAxiosContext } from "../AxiosInstanceProvider";
import { Series } from "../Models/SeriesModels";
import './CSS/Series.css';
import placeholderImage from '../Images/placeholder_img.jpg';
import { Genre } from "../Models/GenreModels";
import { GetUserDTO } from "../Models/UserModels";
import { CreateReviewDTO, Review, UpdateReviewDTO } from "../Models/ReviewModels";
import { PencilSquare, Trash, TrashFill } from "react-bootstrap-icons";

type SeriesViewParams = {
    genreId: string,
    seriesId: string
}

type GenreLink = {
    genreName: string,
    genreRoute: string,
}

function SeriesView(props: any) {
    const authAxios = useAxiosContext();
    const auth = useAuthState();

    const [isLoading, setIsLoading] = useState(true);
    const [series, setSeries] = useState<Series | null>(null);
    const [genreLinks, setGenreLinks] = useState<GenreLink[]>([]);

    const params = useParams<SeriesViewParams>();
    const navigate = useNavigate();

    useEffect(() => {

        if (!params.genreId || !params.seriesId) {
            navigate('/error');
            return;
        }

        const genreId = parseInt(params.genreId);
        const seriesId = parseInt(params.seriesId);
        if (isNaN(genreId) || isNaN(seriesId)) {
            navigate('/error');
            return;
        }

        const fetchSeries = async (genreId: number, seriesId: number) => {
            const route = formatRoute(Routes.GetSeriesById, genreId.toString(), seriesId.toString());

            try {
                const response = await authAxios.get<Series>(route);

                let links = [...genreLinks];
                for (const genreRoute of response.data.genres) {
                    const fetchRoute = `/api${genreRoute}`;

                    const genreResponse = await authAxios.get<Genre>(fetchRoute);
                    links = [...links, { genreName: genreResponse.data.name, genreRoute: genreRoute }];
                }

                setGenreLinks(links);
                setSeries(response.data);
                setIsLoading(false);
            } catch (e) {
                console.error(e);
            }
        };

        fetchSeries(genreId, seriesId);

    }, []);

    let body;
    if (!auth.user) {
        body = undefined;
    } else if (isLoading) {
        body = <Spinner animation="border" />
    } else {
        body = <SeriesBasicView series={series!} seriesGenres={genreLinks} />
    }

    return (
        <div>
            {body}
        </div>
    );
}

type SeriesProps = {
    series: Series,
    seriesGenres: GenreLink[],
}

function SeriesBasicView({ series, seriesGenres }: SeriesProps) {

    const auth = useAuthState();
    const authAxios = useAxiosContext();
    const navigate = useNavigate();
    const params = useParams<SeriesViewParams>();

    const [isDeleting, setDeleting] = useState<boolean>(false);
    const handleShow = () => setDeleting(true);
    const handleClose = () => setDeleting(false);
    const handleDelete = async () => {

        const route = formatRoute(Routes.DeleteSeries, params.genreId!, params.seriesId!);

        try {

            const response = await authAxios.delete(route);

            navigate(`/genre/${params.genreId!}`);

        } catch (e) {
            console.error(e);

            return Promise.reject(e);
        }
    }
    const handleGoToEdit = () => {
        navigate(`/genre/${params.genreId}/series/${params.seriesId}/edit`);
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.log('Replaced broken image');
        e.currentTarget.src = placeholderImage;
    };

    const directorItems = series.directors.map((director, idx) => {
        return (
            <li className="inline-item fw-light" key={idx}>{director}</li>
        );
    });

    const castItems = series.starringCast.map((actor, idx) => {
        return (
            <li className="inline-item fw-light" key={idx}>{actor}</li>
        );
    });

    const genreItems = seriesGenres.map((g, idx) => {
        return (
            <li className="inline-item fw-light" key={idx}>
                <Link to={g.genreRoute}>{g.genreName}</Link>
            </li>
        );
    });

    return (
        <div>
            <Col>
                <Row>
                    <h1>{series.name}</h1>
                    <hr className="hr" />
                </Row>
                <Row xl={16}>
                    <Col xl={4}>
                        <img className="large-img" src={series.coverImagePath ? series.coverImagePath : placeholderImage} onError={e => handleImageError(e)} />
                    </Col>
                    <Col xl={8}>
                        <Row>
                            <div className="d-flex flex-row mb-2">
                                <div className="align-self-center">
                                    <h4 className="mb-0 text-center">Synopsis</h4>
                                </div>
                                {auth.user && (auth.user.Role == Role.Admin || auth.user?.Role == Role.Poster) &&
                                    <div className="ms-auto">
                                        <button className="btn btn-success m-1" onClick={e => handleGoToEdit()}>
                                            <PencilSquare />
                                        </button>
                                        <button className="btn btn-danger m-1" onClick={handleShow}>
                                            <Trash />
                                        </button>
                                        <Modal className="text-light" backdrop={true} show={isDeleting} onHide={handleClose}>
                                            <Modal.Header className="bg-dark">
                                                <Modal.Title>Deleting {series.name}</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body className="bg-dark">
                                                <p>Are you sure you want to delete this series?</p>
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
                                    </div>
                                }
                            </div>
                            <hr className="hr" />
                            <div className="jumbotron mt-3">
                                {series.description}
                            </div>
                            <hr className="hr" />
                        </Row>
                        <Row>
                            <ul className="list-group list-group-dark mb-3">
                                <li className="list-group-item d-flex flex-row">
                                    <p className="user-select-none fw-bold mb-0">Directors</p>
                                    <ul className="no-bullet">
                                        {directorItems}
                                    </ul>
                                </li>
                                <li className="list-group-item d-flex flex-row">
                                    <p className="user-select-none fw-bold mb-0">Cast</p>
                                    <ul className="no-bullet">
                                        {castItems}
                                    </ul>
                                </li>
                                <li className="list-group-item d-flex flex-row">
                                    <p className="user-select-none fw-bold mb-0">Genres</p>
                                    <ul className="no-bullet">
                                        {genreItems}
                                    </ul>
                                </li>
                            </ul>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <hr className="hr mt-2" />
                </Row>
                <Row>
                    <ReviewSection series={series} />
                </Row>
            </Col>
        </div>    
    );
}

type ReviewProps = {
    series: Series
}

function ReviewSection({ series }: ReviewProps) {

    const navigate = useNavigate();
    const auth = useAuthState();
    const authAxios = useAxiosContext();
    const params = useParams<SeriesViewParams>();

    const [successUpdating, setSuccessUpdating] = useState<boolean | null>(null);
    const [reviewToUpdate, setReviewToUpdate] = useState<Review | null>(null);
    const [rating, setRating] = useState<number>(1);
    const [text, setText] = useState<string>('');

    const [allReviews, setAllReviews] = useState<Review[]>([]);

    useEffect(() => {

        if (!auth.user) {
            navigate('/user/login');
            return;
        }

        const fetchReview = async () => {
            const userRoute = formatRoute(Routes.GetUser, auth.user!.Id.toString());
            const reviewRoute = formatRoute(Routes.GetReviews, params.genreId!, params.seriesId!);

            try {

                const reviewsResponse = await authAxios.get<Review[]>(reviewRoute);

                for (const review of reviewsResponse.data) {
                    review.postDate = new Date(String(review.postDate));
                }
                setAllReviews(reviewsResponse.data);

                const userDataResponse = await authAxios.get<GetUserDTO>(userRoute);
                const reviewId = getCurrentUserReviewIdFromSeries(series.id, userDataResponse.data.reviews);

                if (reviewId != null) {
                    const thisUserReview = reviewsResponse.data.filter(x => x.id == reviewId)[0];

                    setReviewToUpdate(thisUserReview);
                    setRating(thisUserReview.rating);
                    setText(thisUserReview.text);

                    setAllReviews(reviewsResponse.data.filter(x => x.id != reviewId));
                }

            } catch (e) {
                console.error(e);

                return Promise.reject(e);
            }
        };

        fetchReview();

    }, []);

    let reviewRange: number[] = [];
    for (let i = 1; i <= 10; i++) {
        reviewRange = [...reviewRange, i];
    }

    const ratingOptions = reviewRange.map((rating, idx) => {
        return (
            <option key={idx} value={rating}>{rating}</option>
        );
    });

    const handleSaveReview = async () => {
        try {
            if (reviewToUpdate) {

                const route = formatRoute(Routes.UpdateReview, params.genreId!, params.seriesId!, reviewToUpdate.id.toString());

                const request: UpdateReviewDTO = {
                    rating: rating,
                    text: text,
                };

                const response = await authAxios.patch(route, request);
                setSuccessUpdating(true);

            } else {

                const route = formatRoute(Routes.CreateReview, params.genreId!, params.seriesId!);

                const request: CreateReviewDTO = {
                    series: series.id,
                    user: auth.user!.Id,
                    rating: rating,
                    text: text,
                };

                const response = await authAxios.post(route, request);
                setSuccessUpdating(true);
            }
        } catch (e) {
            console.error(e);

            setSuccessUpdating(false);
        }
    };

    return (
        <div>
            <form>
                <h5>Your Review</h5>
                <div className="form-group mb-3">
                    <label htmlFor="rating" className="form-label">Rating</label>
                    <select className="form-control" value={rating} onChange={e => setRating(parseInt(e.target.value))} >
                        {ratingOptions}
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="text" className="form-label">Review Text</label>
                    <textarea className="form-control" name="text" id="text" value={text} onChange={e => setText(e.target.value)} />
                    {!text &&
                        <p className="text-muted user-select-none">Review cannot be empty</p>
                    }
                </div>
                <button type="button" className="btn btn-success" onClick={handleSaveReview}>Save</button>
                {successUpdating != null && successUpdating == true &&
                    <span className="text-success mx-1">Successfully updated</span>
                }
                {successUpdating != null && successUpdating == false &&
                    <span className="text-danger mx-1">Failed to update</span>
                }
            </form>
            <hr className="hr" />
            <h5 className="m-2">Other Reviews</h5>
            <Col xl={4} lg={6} md={8} sm={12}>
                {allReviews.map((review, idx) => {
                    return (
                        <Row key={idx} className="dark-border p-2 my-2">
                            <p className="text-muted user-select-none">{review.postDate.toLocaleDateString()}</p>
                            <p className="fw-bold">Rating: {review.rating}</p>
                            <p>{review.text}</p>
                        </Row>
                    );
                })}
            </Col>
        </div>
    );
}

function getCurrentUserReviewIdFromSeries(seriesId: number, reviewLinks: string[]): number | null {
    const ids = reviewLinks.map((link, i) => {
        const parts = link.split('/').filter(x => x);

        if (parts.length != 6) {
            throw Error('Bad review link');
        }

        const sId = parseInt(parts[3]);
        const rId = parseInt(parts[5]);

        return [sId, rId];
    });

    for (const [sId, rId] of ids) {
        if (sId == seriesId) return rId;
    }

    return null;
}

export default SeriesView;