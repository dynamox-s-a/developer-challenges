using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    /// <summary>
    /// Representa uma máquina industrial no sistema
    /// </summary>
    public class Machine
    {
        /// <summary>
        /// Identificador único da máquina
        /// </summary>
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome da máquina é obrigatório")]
        [StringLength(100, MinimumLength = 3,
         ErrorMessage = "O nome deve ter entre 3 e 100 caracteres")]
        /// <summary>
        /// Nome da máquina (3-100 caracteres)
        /// </summary>
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "O número de série é obrigatório")]
        [StringLength(50, ErrorMessage = "O número de série não pode ter mais de 50 caracteres")]
        /// <summary>
        /// Número de série da máquina (até 50 caracteres)
        /// </summary>
        public string SerialNumber { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "A descrição não pode ter mais de 500 caracteres")]
        /// <summary>
        /// Descrição opcional da máquina (até 500 caracteres)
        /// </summary>
        public string? Description { get; set; }

        [Required(ErrorMessage = "O tipo da máquina é obrigatório")]
        /// <summary>
        /// Tipo da máquina (Prensa, Torno, etc.)
        /// </summary>
        public MachineType Type { get; set; }

        /// <summary>
        /// Data e hora de criação do registro
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Data e hora da última atualização do registro
        /// </summary>
        public DateTime? UpdatedAt { get; set; }
    }

    /// <summary>
    /// Tipos de máquinas disponíveis no sistema
    /// </summary>
    public enum MachineType
    {
        /// <summary>
        /// Máquina do tipo Prensa
        /// </summary>
        Press,
        /// <summary>
        /// Máquina do tipo Torno
        /// </summary>
        Lathe,
        /// <summary>
        /// Máquina do tipo Fresadora
        /// </summary>
        MillingMachine,
        /// <summary>
        /// Máquina do tipo Cortadora
        /// </summary>
        Cutter,
        /// <summary>
        /// Máquina do tipo Furadeira
        /// </summary>
        Drill,
        /// <summary>
        /// Outro tipo de máquina não listado
        /// </summary>
        Other
    }
}
