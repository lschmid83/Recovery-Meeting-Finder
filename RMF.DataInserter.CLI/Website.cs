namespace RMF.MeetingWebsiteScraper.Models
{
    public class Website
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string URL { get; set; }
        public string Namespace { get; set; }
        public string GeoLocationNamespace { get; set; }

        public bool HasDetailsPage { get; set; }
    }
}
