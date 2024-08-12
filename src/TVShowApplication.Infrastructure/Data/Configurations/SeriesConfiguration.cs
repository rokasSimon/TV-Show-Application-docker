using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Infrastructure.Data.Configurations;

public class SeriesConfiguration : IEntityTypeConfiguration<Series>
{
    public void Configure(EntityTypeBuilder<Series> builder)
    {
        builder
            .Property(x => x.Directors)
            .HasConversion(
                v => v == null ? null : string.Join(',', v),
                v => v == null ? null : v.Split(',', StringSplitOptions.RemoveEmptyEntries));

        builder
            .Property(x => x.StarringCast)
            .HasConversion(
                v => v == null ? null : string.Join(',', v),
                v => v == null ? null : v.Split(',', StringSplitOptions.RemoveEmptyEntries));
    }
}