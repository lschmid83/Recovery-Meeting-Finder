using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RMF.DataInserter
{
    public class MeetingDumpCsv
    {
        public Guid Guid { get; set; }
        public string Title { get; set; }
        public string Time { get; set; }
        public string Duration { get; set; }
        public string Postcode { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Venue { get; set; }
        public string Address { get; set; }
        public string What3Words { get; set; }
        public string Day { get; set; }
        public bool Hearing { get; set; }
        public bool Wheelchair { get; set; }
        public bool Chit { get; set; }
        public bool Open { get; set; }
        public string OpenFormat { get; set; }
        public string Format { get; set; }
        public string Note { get; set; }
        public string Region { get; set; }
        public string Area { get; set; }
        public string Country { get; set; }
        public string Type { get; set; }
    }
}
