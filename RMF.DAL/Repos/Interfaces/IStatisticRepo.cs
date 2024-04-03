using RMF.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace RMF.DAL.Repos.Interfaces
{
    public interface IStatisticRepo
    {
        Task<IEnumerable<Statistic>> GetLatest();
        Task<IEnumerable<Statistic>> GetAll();
    }
}
