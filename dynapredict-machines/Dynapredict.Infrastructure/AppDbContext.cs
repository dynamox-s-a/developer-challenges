using Dynapredict.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dynapredict.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Machine> Machines => Set<Machine>();
        public DbSet<MachineType> MachineTypes => Set<MachineType>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Machine>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Name).IsRequired().HasMaxLength(200);
                entity.Property(m => m.SerialNumber).IsRequired().HasMaxLength(100);
                entity.HasIndex(m => m.SerialNumber).IsUnique();
            });

            modelBuilder.Entity<MachineType>(entity =>
            {
                entity.HasKey(mt => mt.Id);
                entity.Property(mt => mt.Name).IsRequired().HasMaxLength(100);

                // Seed some defaults
                entity.HasData(
                    new MachineType { Id = 1, Name = "Press" },
                    new MachineType { Id = 2, Name = "Lathe" },
                    new MachineType { Id = 3, Name = "Milling Machine" }
                );
            });
        }
    }
}
