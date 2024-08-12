using System.Reflection;
using System.Text;
using Hellang.Middleware.ProblemDetails;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using TVShowApplication.Core.Common.Exceptions;
using TVShowApplication.Core.Common.Interfaces.Security;
using TVShowApplication.Core.Options;
using TVShowApplication.Core.Security.Services;

namespace TVShowApplication.API;

public static class APIDependencyInjections
{
    public static IServiceCollection AddAPIServices(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        return services;
    }

    public static IServiceCollection AddAuthenticationServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.Jwt));

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
            .AddJwtBearer(options =>
            {
                var jwtOptions = new JwtOptions();
                configuration.GetSection(JwtOptions.Jwt).Bind(jwtOptions);

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions.Issuer,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret!)),
                };
            });

        return services;
    }

    public static IServiceCollection AddMappedProblemDetails(this IServiceCollection services)
    {
        services.AddProblemDetails(options =>
        {
            options.Map<UnauthorizedException>(ex => new ProblemDetails
            {
                Title = "Unauthorized",
                Status = StatusCodes.Status403Forbidden,
                Detail = ex.Message,
            });

            options.Map<ResourceNotFoundException>(ex => new ProblemDetails
            {
                Title = "NotFound",
                Status = StatusCodes.Status404NotFound,
                Detail = ex.Message,
            });

            options.Map<UnupdateableResourceException>(ex => new ProblemDetails
            {
                Title = "Cannot update resource",
                Status = StatusCodes.Status403Forbidden,
                Detail = ex.Message,
            });
        });

        return services;
    }
}