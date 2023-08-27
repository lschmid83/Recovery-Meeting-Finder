using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace RMF.DAL.Entities
{
    [Table("Country")]
    public class Country : EntityBase
    {
        [Required]
        [MaxLength(20)]
        public string Name { get; set; }

        [Required]
        public int Order { get; set; }
    }
}
