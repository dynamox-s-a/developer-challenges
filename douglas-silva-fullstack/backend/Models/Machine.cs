using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Machine
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome da máquina é obrigatório")]
        [StringLength(100, MinimumLength = 3,
         ErrorMessage = "O nome deve ter entre 3 e 100 caracteres")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "O número de série é obrigatório")]
        [StringLength(50, ErrorMessage = "O número de série não pode ter mais de 50 caracteres")]
        public string SerialNumber { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "A descrição não pode ter mais de 500 caracteres")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "O tipo da máquina é obrigatório")]
        public MachineType Type { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }

    public enum MachineType
    {
        Press,
        Lathe,
        MillingMachine,
        Cutter,
        Drill,
        Other
    }
}
