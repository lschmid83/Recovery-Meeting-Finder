using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RMF.DAL.Repos.Interfaces;
using System.Collections.Generic;
using RMF.WebAPI.Client.Models;
using System.Threading.Tasks;
using RMF.WebAPI.ActionFilters;
using RMF.WebAuth.Enums;

namespace RMF.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AreaController : ControllerBase
    {
        private readonly IAreaRepo AreaRepo;

        public AreaController(IAreaRepo dayRepo)
        {
            AreaRepo = dayRepo;
        }

        [HttpGet]
        [ResponseCache(Duration = 3600)]
        [Authorization(UserType = UserType.ApiUser)]
        public async Task<IEnumerable<Area>> Get()
        {
            var areas = await AreaRepo.GetAll();
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<DAL.Entities.Area, Area>();
                cfg.CreateMap<DAL.Entities.Region, Region>();
                cfg.CreateMap<DAL.Entities.Country, Country>();
            });
            var mapper = config.CreateMapper();
            var results = mapper.Map<IEnumerable<DAL.Entities.Area>, IEnumerable<Area>>(areas);

            Parallel.ForEach(areas, area =>
            {
                Parallel.ForEach(results, result =>
                {
                    if (area.Id == result.Id)
                    {
                        Parallel.ForEach(area.Regions, region =>
                        {
                            Parallel.ForEach(result.Regions, (resultRegion, state) =>
                            {
                                if (region.Id == resultRegion.Id)
                                {
                                    resultRegion.Latitude = region.Location.Y;
                                    resultRegion.Longitude = region.Location.X;
                                    state.Break();
                                }
                            });
                        });
                    }
                });
            });
            return results;
        }
    }
}
