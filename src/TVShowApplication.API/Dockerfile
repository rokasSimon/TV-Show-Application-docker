ARG SDK_VERSION=8.0-alpine
ARG RUNTIME_VERSION=8.0-alpine

FROM mcr.microsoft.com/dotnet/sdk:${SDK_VERSION} AS build
WORKDIR /

COPY *.sln ./
COPY ./src/TVShowApplication.API/*.csproj ./src/TVShowApplication.API/
COPY ./src/TVShowApplication.Core/*.csproj ./src/TVShowApplication.Core/
COPY ./src/TVShowApplication.Infrastructure/*.csproj ./src/TVShowApplication.Infrastructure/
COPY ./src/TVShowApplication.Migrations/*.csproj ./src/TVShowApplication.Migrations/
RUN dotnet restore
COPY . .

WORKDIR /src/TVShowApplication.API
RUN dotnet publish TVShowApplication.API.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:${RUNTIME_VERSION} AS runtime
WORKDIR /app

ENV \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8

RUN apk add --no-cache \
    icu-data-full \
    icu-libs

COPY --from=build /app ./

ENTRYPOINT [ "dotnet", "TVShowApplication.API.dll" ]