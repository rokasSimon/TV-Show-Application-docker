import { Link } from "./Other"

type Review = {
    id: number,
    postDate: Date,
    text: string,
    rating: number,
    reviewedSeries: Link,
    reviewer: Link | null,
}

type CreateReviewDTO = {
    text: string,
    rating: number,
    series: number,
    user: number,
}

type UpdateReviewDTO = {
    text: string,
    rating: number,
}

export type { Review, CreateReviewDTO, UpdateReviewDTO }