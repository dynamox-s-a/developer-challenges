using System;
using System.Collections.Generic;
using FullStackDevelopmentChallenge.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FullStackDevelopmentChallenge.Infraestructure.DataAccess;

public partial class FullStackDevelopmentChallengeDbContext : DbContext
{
    public FullStackDevelopmentChallengeDbContext()
    {
    }

    public FullStackDevelopmentChallengeDbContext(DbContextOptions<FullStackDevelopmentChallengeDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Machine> Machines { get; set; }

    public virtual DbSet<MachineType> MachineTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Machine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Machines__3214EC077AF86FD4");

            entity.HasIndex(e => e.SerialNumber, "UQ__Machines__048A0008D0EF970A").IsUnique();

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.SerialNumber).HasMaxLength(50);

            entity.HasOne(d => d.MachineType).WithMany(p => p.Machines)
                .HasForeignKey(d => d.MachineTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Machines__Machin__4222D4EF");
        });

        modelBuilder.Entity<MachineType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__MachineT__3214EC07E6250959");

            entity.HasIndex(e => e.TypeName, "UQ__MachineT__D4E7DFA8C53D5625").IsUnique();

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.TypeName).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
