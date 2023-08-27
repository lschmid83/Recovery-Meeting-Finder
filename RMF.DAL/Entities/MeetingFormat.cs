using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RMF.DAL.Entities
{
    [Table("MeetingFormat")]
    public class MeetingFormat : EntityBase
    {      
        [Required]
        public int MeetingId { get; set; }

        [Required]
        public int FormatId { get; set; }

        [ForeignKey("FormatId")]
        public virtual Format Format { get; set; }
    }
}
