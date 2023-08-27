using System.Collections.Generic;

namespace RMF.WebAPI.Models
{
    public class Area
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int Order { get; set; }

        public virtual IEnumerable<Region> Regions { get; set; }
    }
}
