type Route = string;

const BASE_API_URI: string = "/api";

const Routes = {
    GetGenres: BASE_API_URI + "/genre",
    CreateGenre: BASE_API_URI + "/genre",
    GetGenre: BASE_API_URI + "/genre/{0}",
    UpdateGenre: BASE_API_URI + "/genre/{0}",
    DeleteGenre: BASE_API_URI + "/genre/{0}",

    GetSeries: BASE_API_URI + "/genre/{0}/series",
    CreateSeries: BASE_API_URI + "/genre/{0}/series",
    GetSeriesById: BASE_API_URI + "/genre/{0}/series/{1}",
    UpdateSeries: BASE_API_URI + "/genre/{0}/series/{1}",
    DeleteSeries: BASE_API_URI + "/genre/{0}/series/{1}",

    GetReviews: BASE_API_URI + "/genre/{0}/series/{1}/review",
    CreateReview: BASE_API_URI + "/genre/{0}/series/{1}/review",
    GetReview: BASE_API_URI + "/genre/{0}/series/{1}/review/{2}",
    UpdateReview: BASE_API_URI + "/genre/{0}/series/{1}/review/{2}",
    DeleteReview: BASE_API_URI + "/genre/{0}/series/{1}/review/{3}",

    GetUser: BASE_API_URI + "/user/{0}",

    SignUp: BASE_API_URI + "/user",
    GetToken: BASE_API_URI + "/user/token",
    RefreshToken: BASE_API_URI + "/user/token/refresh",
    RevokeToken: BASE_API_URI + "/user/token/revoke",
};

const formatRoute = (route: Route, ...parameters: string[]) => {
    return route.replace(/{(\d+)}/g, function (match, number) {
        return typeof parameters[number] != 'undefined'
            ? parameters[number]
            : match;
    });
};

export { Routes, formatRoute };