//type Role = "Admin" | "Poster" | "User";

enum Role {
    Admin = "Admin",
    Poster = "Poster",
    User = "User",
}

type LoginRequest = {
    Email: string,
    Password: string,
}

type RegisterRequest = {
    Email: string,
    Password: string,
    RoleSecret: string,
}

type RefreshTokenRequest = {
    AccessToken: string,
    RefreshToken: string,
}

type AuthenticatedResponse = {
    accessToken: string,
    refreshToken: string,
}

interface User {
    Id: number,
    Role: Role,
    Email: string,
    AccessToken: string,
    RefreshToken: string,
    AccessTokenExpiresAt: number,
    RefreshTokenExpiresAt: number,
}

type AccessTokenPayload = {
    Role: Role,
    Id: number,
    ExpiresAt: number,
    Issuer: string,
    Audience: string,
    RefreshTokenExpirationTime: number,
}

enum ContextStatus {
    Idle,
    Pending,
    Completed,
    Rejected,
}

export type { LoginRequest, RegisterRequest, RefreshTokenRequest, AuthenticatedResponse, User, AccessTokenPayload }
export { ContextStatus, Role }