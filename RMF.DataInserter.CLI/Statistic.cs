using System;
using System.Collections.Generic;
using System.Text;

namespace RMF.MeetingWebsiteScraper.CLI
{
    public class Statistic
    {
        public string Type { get; set; }
        public string Country { get; set; }
        public int Total { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
