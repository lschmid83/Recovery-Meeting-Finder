using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace RMF.MeetingWebsiteScraper.Models
{
    public class Organisation
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Namespace { get; set; }
        public string ShortName { get; set; }
        public string Color { get; set; }
        public List<Website> Websites { get; set; }
    }
}
