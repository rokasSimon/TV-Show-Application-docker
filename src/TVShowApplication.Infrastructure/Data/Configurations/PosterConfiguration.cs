using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Infrastructure.Data.Configurations;

public class PosterConfiguration : IEntityTypeConfiguration<Poster>
{
    public void Configure(EntityTypeBuilder<Poster> builder)
    {
        builder
            .HasMany(p => p.PostedSeries)
            .WithOne(s => s.Poster)
            .OnDelete(DeleteBehavior.Cascade);
    }
}