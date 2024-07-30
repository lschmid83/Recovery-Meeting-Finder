using RMF.WebAuth.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RMF.DAL.Entities
{
    [Table("User")]
    public class User : EntityBase
    {
        [MaxLength(250)]
        [Required]
        public string Username { get; set; }

        [MaxLength(250)]
        [Required]
        public string Password { get; set; }

        [Required]
        public virtual UserType Permissions { get; set; }
    }
}
