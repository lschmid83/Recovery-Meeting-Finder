using System.Collections.Generic;

namespace RMF.DataInserter
{
    public interface IOrganisationReader
    {
        List<Organisation> Read(string path);
    }
}
