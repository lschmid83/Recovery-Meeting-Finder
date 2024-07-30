using RMF.MeetingWebsiteScraper.Models;
using System.Collections.Generic;

namespace RMF.MeetingWebsiteScraper.Files
{
    public interface IOrganisationReader
    {
        List<Organisation> Read(string path);
    }
}
