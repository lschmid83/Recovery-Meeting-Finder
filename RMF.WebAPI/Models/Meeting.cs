using System;

namespace RMF.WebAPI.Models
{
    public class Meeting
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public string Title { get; set; }
        public DateTime Time { get; set; }
        public string Duration { get; set; }
        public string Postcode { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public double Distance { get; set; }
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
        public int Hash { get; set; }
    }
}
