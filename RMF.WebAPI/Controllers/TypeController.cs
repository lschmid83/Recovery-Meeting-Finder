using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RMF.DAL.Repos.Interfaces;
using RMF.WebAPI.Client.Models;

namespace RMF.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TypeController : ControllerBase
    {
        private readonly ITypeRepo TypeRepo;

        public TypeController(ITypeRepo typeRepo)
        {
            TypeRepo = typeRepo;
        }

        [HttpGet]
        [Route("~/meeting-type")]
        [ResponseCache(Duration = 3600)]
        public async Task<IEnumerable<Type>> Get()
        {
            var types = await TypeRepo.GetAll();
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<DAL.Entities.Type, Type>();
            });
            var mapper = config.CreateMapper();
            return mapper.Map<IEnumerable<DAL.Entities.Type>, IEnumerable<Type>>(types).OrderBy(x => x.Order);
        }
    }
}
