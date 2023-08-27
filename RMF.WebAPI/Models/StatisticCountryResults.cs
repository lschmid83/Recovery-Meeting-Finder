using System;
using System.Collections.Generic;
using System.Text;

namespace RMF.WebAPI.Models
{
    public class StatisticCountryResults
    {
        public List<StatisticCountryResult> MeetingCountries { get; set; }

        public int Total { get; set; }

        public DateTime LastUpdated { get; set; }
    }
}
