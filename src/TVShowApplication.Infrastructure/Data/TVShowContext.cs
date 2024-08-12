using System.Reflection;
using Microsoft.EntityFrameworkCore;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Infrastructure.Data
{
    public class TVShowContext(DbContextOptions<TVShowContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Poster> Posters { get; set; }
        public DbSet<Administrator> Admins { get; set; }
        public DbSet<Series> Series { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Genre> Genres { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }
    }
}
