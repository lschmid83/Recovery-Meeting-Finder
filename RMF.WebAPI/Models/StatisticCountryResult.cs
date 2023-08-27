using System;
using System.Collections.Generic;
using System.Text;

namespace RMF.WebAPI.Models
{
    public class StatisticCountryResult
    {
        public string Country { get; set; }

        public List<StatisticTypeResult> MeetingTypes { get; set; }

        public int Total { get; set; }
    }
}
