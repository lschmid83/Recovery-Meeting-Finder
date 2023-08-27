using System;
using System.Collections.Generic;

namespace RMF.WebAPI.Models
{
    public class MeetingSearchResults
    {
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<MeetingSearchResult> MeetingTypes { get; set; }
        public DateTime? StartTime { get; set; }
    }
}
