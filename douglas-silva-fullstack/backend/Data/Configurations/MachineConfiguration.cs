using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend.Models;

namespace backend.Data.Configurations
{
    public class MachineConfiguration : IEntityTypeConfiguration<Machine>
    {
        public void Configure(EntityTypeBuilder<Machine> builder)
        {
            builder.HasKey(m => m.Id);
            
            builder.Property(m => m.Name)
                .IsRequired()
                .HasMaxLength(100);
                
            builder.Property(m => m.SerialNumber)
                .IsRequired()
                .HasMaxLength(50);
                
            builder.Property(m => m.Description)
                .HasMaxLength(500);
                
            builder.Property(m => m.Type)
                .IsRequired()
                .HasConversion<string>();
                
            builder.Property(m => m.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
                
            builder.Property(m => m.UpdatedAt);
        }
    }
}
