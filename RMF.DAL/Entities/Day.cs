using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RMF.DAL.Entities
{
    [Table("Day")]
    public class Day : EntityBase
    {
        [Required]
        [MaxLength(10)]
        public string Name { get; set; }

        [Required]
        public int Order { get; set; }
    }
}
