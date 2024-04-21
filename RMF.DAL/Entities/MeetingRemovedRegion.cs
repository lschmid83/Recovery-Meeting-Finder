using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RMF.DAL.Entities.Interfaces;

namespace RMF.DAL.Entities
{
    [Table("MeetingRemovedRegion")]
    public class MeetingRemovedRegion : EntityBase, IMeetingRegion
    {
        [Required]
        public int MeetingId { get; set; }

        [ForeignKey("MeetingId")]
        public virtual Meeting Meeting { get; set; }

        [Required]
        public int RegionId { get; set; }

    }
}
