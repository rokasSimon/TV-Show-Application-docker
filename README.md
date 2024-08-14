# TV Show Application (with docker)

This repository is basically a slightly reworked version of [this](https://github.com/rokasSimon/T120B165_TVShowApplication) repository, which was just a university module assignment.

Goal with this repository was to make this project work with docker and also convert the project into clean architecture. Things still needed to fix:

- bad browser security (storing JWT in local storage) or just not functioning because CORS is getting triggered (because in the original repo the HTML was served by ASP.NET, not a separate service)
- incomplete clean architecture (core project should probably be split into application and domain)
- CRUD could be transformed to Command/Query format to match CQRS
- clean up dependency injection
- use endpoints instead of controllers
- no unit tests
- moving many values into configuration files (like CORS origins or API base URL)
- mount MSSQL onto a volume so data persists

## Running project

Before running project you need to generate and trust .NET dev certs to `./certificates/tvshowapplication/https` (configured in docker compose file).

Afterwards running `docker compose --env-file ./.env up -d` is enough.