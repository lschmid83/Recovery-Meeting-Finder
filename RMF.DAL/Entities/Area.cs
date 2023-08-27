using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RMF.DAL.Entities
{
    [Table("Area")]
    public class Area : EntityBase
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        [Required]
        public int Order { get; set; }

        public virtual ICollection<Region> Regions { get; set; }
    }
}
