using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TVShowApplication.Core.Common.Interfaces.Repository;
using TVShowApplication.Core.Common.Interfaces.Security;
using TVShowApplication.Core.Security.Services;
using TVShowApplication.Infrastructure.Data;
using TVShowApplication.Infrastructure.Data.Identity;
using TVShowApplication.Infrastructure.Data.Repository;

namespace TVShowApplication.Infrastructure;

public static class InfrastructureDependencyInjections
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var dbConnectionString = configuration.GetConnectionString("DefaultConnection");

        ArgumentNullException.ThrowIfNull(dbConnectionString, nameof(dbConnectionString));

        services.AddDbContext<TVShowContext>((sp, options) =>
        {
            options.UseSqlServer(dbConnectionString);
        });

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IGenreRepository, GenreRepository>();
        services.AddScoped<IReviewRepository, ReviewRepository>();
        services.AddScoped<ISeriesRepository, SeriesRepository>();

        services.AddDbContext<TVShowContext>();

        services.AddScoped<IJwtGenerator, JwtGenerator>();
        services.AddScoped<IPasswordHasher, BcryptHasher>();
        services.AddScoped<IUserManager, UserManager>();
        services.AddScoped<IUserDataProvider, UserDataProvider>();

        return services;
    }
}