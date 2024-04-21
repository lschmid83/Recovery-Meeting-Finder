using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RMF.DAL.Entities
{
    public interface IMeetingDataDump
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public Guid Guid { get; set; }

        [Required]
        [MaxLength(250)]
        public string Title { get; set; }

        [Required]
        [MaxLength(5)]
        public string Time { get; set; }

        [Required]
        [MaxLength(35)]
        public string Duration { get; set; }

        [Required]
        [MaxLength(10)]
        public string Postcode { get; set; }

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        [Required]
        [MaxLength(250)]
        public string Venue { get; set; }

        [Required]
        [MaxLength(250)]
        public string Address { get; set; }

        [Required]
        [MaxLength(100)]
        public string What3Words { get; set; }

        [Required]
        [MaxLength(10)]
        public string Day { get; set; }

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

        [Required]
        [MaxLength(250)]
        public string Format { get; set; }

        [Required]
        [MaxLength(1500)]
        public string Note { get; set; }

        [Required]
        [MaxLength(100)]
        public string Code { get; set; }

        // Regional intergroup data is not always available so these are not required fields.
        // See RMF.MeetingWebsiteScraper.CLI comment 15/05/2022.
        [MaxLength(100)]
        public string Region { get; set; }

        [MaxLength(100)]
        public string RegionArea { get; set; }

        public int RegionAreaOrder { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        [MaxLength(50)]
        public string MeetingType { get; set; }

        [Required]
        [MaxLength(10)]
        public string MeetingTypeNamespace { get; set; }
    }
}
