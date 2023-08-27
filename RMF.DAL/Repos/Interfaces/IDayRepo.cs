using RMF.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RMF.DAL.Repos.Interfaces
{
    public interface IDayRepo
    {
        Task<IEnumerable<Day>> GetAll();
    }
}
