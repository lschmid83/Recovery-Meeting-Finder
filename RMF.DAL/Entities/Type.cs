using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RMF.DAL.Entities
{
    [Table("Type")]
    public class Type : EntityBase
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        [Required]
        [MaxLength(10)]
        public string Namespace { get; set; }

        [Required]
        [MaxLength(10)]
        public string ShortName { get; set; }

        [Required]
        [MaxLength(7)]
        public string Color { get; set; }

        [Required]
        public int Order { get; set; }
    }
}
