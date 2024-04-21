using NetTopologySuite.Geometries;
using RMF.DAL.Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RMF.DAL.Entities
{
    [Table("Meeting")]
    public class Meeting : EntityBase, IMeeting
    {
        [Required]
        public Guid Guid { get; set; }

        [MaxLength(250)]
        public string Title { get; set; }

        [Required]
        [MaxLength(5)]
        public DateTime Time { get; set; }

        [MaxLength(35)]
        public string Duration { get; set; }

        [MaxLength(10)]
        public string Postcode { get; set; }

        [Required]
        public Point Location { get; set; }

        [MaxLength(250)]
        public string Venue { get; set; }

        [Required]
        [MaxLength(250)]
        public string Address { get; set; }

        [Required]
        [MaxLength(100)]
        public string What3Words { get; set; }

        [Required]
        public int DayId { get; set; }

        [ForeignKey("DayId")]
        public virtual Day Day { get; set; }

        [Required]
        public bool Hearing { get; set; }

        [Required]
        public bool Wheelchair { get; set; }

        [Required]
        public bool Chit { get; set; }

        [Required]
        public bool Open { get; set; }

        [MaxLength(250)]
        public string OpenFormat { get; set; }

        [MaxLength(250)]
        public string Format { get; set; }

        [MaxLength(1500)]
        public string Note { get; set; }

        [MaxLength(100)]
        public string Code { get; set; }

        [Required]
        public int TypeId { get; set; }

        [ForeignKey("TypeId")]
        public virtual Type Type { get; set; }

        [Required]
        public string RegionArea { get; set; }

        [Required]
        public string RegionName { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        public int Hash { get; set; }
    }
}
