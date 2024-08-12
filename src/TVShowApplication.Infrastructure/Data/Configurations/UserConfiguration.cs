using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TVShowApplication.Core.Models.Entity;

namespace TVShowApplication.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder
            .HasMany(u => u.Reviews)
            .WithOne(r => r.Reviewer)
            .OnDelete(DeleteBehavior.ClientSetNull);
    }
}