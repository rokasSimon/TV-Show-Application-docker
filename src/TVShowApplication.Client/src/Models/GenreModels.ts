type Genre = {
    id: number,
    name: string,
    description: string,
    series: string[]
}

type CreateGenreDTO = {
    name: string,
    description: string
}

type UpdateGenreDTO = {
    description: string
}

export type { Genre, CreateGenreDTO, UpdateGenreDTO }