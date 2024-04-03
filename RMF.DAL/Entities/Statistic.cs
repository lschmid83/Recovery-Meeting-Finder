using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace RMF.DAL.Entities
{
    [Table("Statistic")]
    public class Statistic : EntityBase
    {
        [Required]
        public int TypeId { get; set; }

        [ForeignKey("TypeId")]
        public virtual Type Type { get; set; }

        [Required]
        public int CountryId { get; set; }

        [ForeignKey("CountryId")]
        public virtual Country Country { get; set; }

        [Required]
        public int Total { get; set; }

        [Required]
        public DateTime LastUpdated { get; set; }
    }
}
