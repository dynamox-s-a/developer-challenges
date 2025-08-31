using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
        // Tabela de máquinas no banco de dados
        public DbSet<Machine> Machines { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações adicionais do modelo
            modelBuilder.Entity<Machine>(entity =>
            {
                // Define o nome da tabela
                entity.ToTable("Machines");

                // Configura a chave primária
                entity.HasKey(m => m.Id);

                // Configura o campo Name
                entity.Property(m => m.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                // Configura o campo SerialNumber como único
                entity.HasIndex(m => m.SerialNumber)
                    .IsUnique();

                // Configura o campo Type para ser armazenado como string
                entity.Property(m => m.Type)
                    .HasConversion<string>()
                    .HasMaxLength(20);

                // Configura os valores padrão
                entity.Property(m => m.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
            });
        }
    }
}