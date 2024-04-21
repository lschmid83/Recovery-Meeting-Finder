using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;

namespace RMF.DataInserter
{
    public class OrganisationReader : IOrganisationReader
    {
        public List<Organisation> Read(string path)
        {
            return JsonConvert.DeserializeObject<List<Organisation>>(File.ReadAllText(path));
        }
    }
}
