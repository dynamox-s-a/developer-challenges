using Microsoft.EntityFrameworkCore;
using backend.Models;
using System;

namespace backend.Data
{
    /// <summary>
    /// Representa o contexto do banco de dados da aplicação
    /// </summary>
    public class AppDbContext : DbContext
    {
        /// <summary>
        /// Inicializa uma nova instância do contexto do banco de dados
        /// </summary>
        /// <param name="options">Opções de configuração do contexto</param>
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
        /// <summary>
        /// Conjunto de entidades de máquinas no banco de dados
        /// </summary>
        public DbSet<Machine> Machines { get; set; }

        /// <summary>
        /// Configura o modelo de dados usando Fluent API
        /// </summary>
        /// <param name="modelBuilder">Construtor de modelo para o contexto</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Machine>(entity =>
            {
                entity.ToTable("Machines");

                entity.HasKey(m => m.Id);

                entity.Property(m => m.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasIndex(m => m.SerialNumber)
                    .IsUnique();

                entity.Property(m => m.Type)
                    .IsRequired()
                    .HasConversion(
                        v => v.ToString(),
                        v => (MachineType)Enum.Parse(typeof(MachineType), v));

                entity.Property(m => m.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
            });
        }
    }
}