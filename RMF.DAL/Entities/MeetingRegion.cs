using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RMF.DAL.Entities
{
    [Table("MeetingRegion")]
    public class MeetingRegion : EntityBase
    {
        [Required]
        public int MeetingId { get; set; }

        [ForeignKey("MeetingId")]
        public virtual Meeting Meeting { get; set; }

        [Required]
        public int RegionId { get; set; }

    }
}
