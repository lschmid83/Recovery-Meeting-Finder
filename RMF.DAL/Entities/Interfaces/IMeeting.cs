using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NetTopologySuite.Geometries;

namespace RMF.DAL.Entities.Interfaces
{
    public interface IMeeting
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public string Title { get; set; }
        public DateTime Time { get; set; }
        public string Duration { get; set; }
        public string Postcode { get; set; }
        public Point Location { get; set; }
        public string Venue { get; set; }
        public string Address { get; set; }
        public string What3Words { get; set; }
        public int DayId { get; set; }
        public Day Day { get; set; }
        public bool Hearing { get; set; }
        public bool Wheelchair { get; set; }
        public bool Chit { get; set; }
        public bool Open { get; set; }
        public string OpenFormat { get; set; }
        public string Format { get; set; }
        public string Note { get; set; }
        public string Code { get; set; }
        public int TypeId { get; set; }
        public Type Type { get; set; }
        public string RegionArea { get; set; }
        public string RegionName { get; set; }
        public string Country { get; set; }
        public int Hash { get; set; }
    }
}
