ARG SDK_VERSION=8.0
ARG RUNTIME_VERSION=8.0

FROM mcr.microsoft.com/dotnet/sdk:${SDK_VERSION}-alpine AS build
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

FROM build AS migrations
WORKDIR /src/TVShowApplication.Migrations

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"
#RUN dotnet ef database update --project "../TVShowApplication.Infrastructure/TVShowApplication.Infrastructure.csproj"

ENTRYPOINT [ "dotnet", "ef", "database", "update", "--project", "../TVShowApplication.Infrastructure/TVShowApplication.Infrastructure.csproj" ]