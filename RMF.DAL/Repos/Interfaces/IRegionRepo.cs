using RMF.DAL.Entities;
using System.Threading.Tasks;

namespace RMF.DAL.Repos.Interfaces
{
    public interface IRegionRepo
    {
        Task<Region> Get(string regionName);
        Task<Region> Get(int regionId);
    }
}
