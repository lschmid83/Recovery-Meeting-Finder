using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RMF.DAL.Entities.Interfaces;

namespace RMF.DAL.Entities
{
    [Table("MeetingAddedRegion")]
    public class MeetingAddedRegion : EntityBase, IMeetingRegion
    {
        [Required]
        public int MeetingId { get; set; }

        [ForeignKey("MeetingId")]
        public virtual Meeting Meeting { get; set; }

        [Required]
        public int RegionId { get; set; }

    }
}
