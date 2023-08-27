using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace RMF.WebAPI.Models
{
    public class MeetingQuery
    {
        public double? latitude { get; set; } = null;
        public double? longitude { get; set; } = null;
        public double? distance { get; set; } = null;
        public IEnumerable<int> dayIds { get; set; } = null;
        public IEnumerable<int> typeIds { get; set; } = null;
        public IEnumerable<int> meetingIds { get; set; } = null;
        public int? regionId { get; set; } = null;
        public bool? hearing { get; set; } = null;
        public bool? wheelchair { get; set; } = null;
        public bool? chit { get; set; } = null;
        public bool? open { get; set; } = null;
        public DateTime? startTime = null;
        public bool venue { get; set; }

        public string Serialize()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
