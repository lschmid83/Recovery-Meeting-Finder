using NetTopologySuite.Geometries;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RMF.DAL.Entities
{
    [Table("Region")]
    public class Region : EntityBase
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public Point Location { get; set; }

        [Required]
        public int Zoom { get; set; }

        [Required]
        public int AreaId { get; set; }

        [ForeignKey("AreaId")]
        public virtual Area Area { get; set; }

        [Required]
        public int CountryId { get; set; }

        [ForeignKey("CountryId")]
        public virtual Country Country { get; set; }

        [Required]
        public Geometry ConvexHull { get; set; }

        [Required]
        public string Boundary { get; set; }
    }
}
