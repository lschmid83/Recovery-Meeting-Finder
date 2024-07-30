using Newtonsoft.Json;
using RMF.MeetingWebsiteScraper.Models;
using System.Collections.Generic;
using System.IO;

namespace RMF.MeetingWebsiteScraper.Files
{
    public class OrganisationReader : IOrganisationReader
    {
        public List<Organisation> Read(string path)
        {
            return JsonConvert.DeserializeObject<List<Organisation>>(File.ReadAllText(path));
        }
    }
}
