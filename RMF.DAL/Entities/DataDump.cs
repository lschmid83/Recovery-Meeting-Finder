using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RMF.DAL.Entities
{
    [Table("DataDump")]
    public class DataDump : EntityBase
    {
        [Required]
        public DateTime Date { get; set; }
    }
}
