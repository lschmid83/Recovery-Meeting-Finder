using System;
using System.Collections.Generic;
using System.Text;

namespace RMF.WebAPI.Client.Models
{
    public class StatisticTypeResults
    {
        public List<StatisticTypeResult> MeetingTypes { get; set; }

        public int Total { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}
