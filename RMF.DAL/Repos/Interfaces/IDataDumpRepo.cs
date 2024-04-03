using RMF.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RMF.DAL.Repos.Interfaces
{
    public interface IDataDumpRepo
    {
        Task<IEnumerable<DataDump>> GetAll();
    }
}
