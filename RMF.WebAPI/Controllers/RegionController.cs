using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RMF.DAL.Repos.Interfaces;
using RMF.WebAPI.ActionFilters;
using RMF.WebAPI.Client.Models;
using RMF.WebAuth.Enums;
using System.Threading.Tasks;

namespace RMF.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RegionController : ControllerBase
    {
        private readonly IRegionRepo RegionRepo;

        public RegionController(IRegionRepo dayRepo)
        {
            RegionRepo = dayRepo;
        }

        [HttpGet]
        [ResponseCache(Duration = 3600, VaryByQueryKeys = new[] { "regionName" })]
        [Route("name")]
        [Authorization(UserType = UserType.ApiUser)]
        public async Task<Region> GetRegionByName(string regionName)
        {
            var region = await RegionRepo.Get(regionName);
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<DAL.Entities.Region, Region>();
                cfg.CreateMap<DAL.Entities.Country, Country>();
            });
            var mapper = config.CreateMapper();
            var resultRegion = mapper.Map<DAL.Entities.Region, Region>(region);

            if (resultRegion != null)
            {
                resultRegion.Longitude = region.Location.X;
                resultRegion.Latitude = region.Location.Y;
            }

            return resultRegion;
        }

        [HttpGet]
        [ResponseCache(Duration = 3600, VaryByQueryKeys = new[] { "regionId" })]
        [Authorization(UserType = UserType.ApiUser)]
        public async Task<Region> Get(int regionId)
        {
            var region = await RegionRepo.Get(regionId);
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<DAL.Entities.Region, Region>();
                cfg.CreateMap<DAL.Entities.Country, Country>();
            });
            var mapper = config.CreateMapper();
            var resultRegion = mapper.Map<DAL.Entities.Region, Region>(region);

            resultRegion.Longitude = region.Location.X;
            resultRegion.Latitude = region.Location.Y;

            return resultRegion;
        }
    }
}
