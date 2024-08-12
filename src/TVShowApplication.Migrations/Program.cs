using Microsoft.EntityFrameworkCore;
using TVShowApplication.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<TVShowContext>(options =>
{
    var dbConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    options.UseSqlServer(dbConnectionString);
});

var app = builder.Build();

app.Run();
