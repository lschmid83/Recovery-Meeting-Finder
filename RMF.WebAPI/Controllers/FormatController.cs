using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RMF.DAL.Repos.Interfaces;
using RMF.WebAPI.Client.Models;

namespace RMF.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FormatController : ControllerBase
    {
        private readonly IFormatRepo formatRepo;

        public FormatController(IFormatRepo formatRepo)
        {
            this.formatRepo = formatRepo;
        }

        [HttpGet]
        [ResponseCache(Duration = 3600)]
        public async Task<IEnumerable<Format>> Get([FromQuery]int typeId)
        {
            var formats = await formatRepo.Get(typeId);
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<DAL.Entities.Format, Format>();
            });
            var mapper = config.CreateMapper();
            return mapper.Map<IEnumerable<DAL.Entities.Format>, IEnumerable<Format>>(formats);
        }
    }
}

