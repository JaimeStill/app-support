using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using AppSupport.Core.ApiQuery;
using AppSupport.Data;
using AppSupport.Data.Entities;
using AppSupport.Data.Extensions;

namespace AppSupport.Web.Controllers
{
    [Route("api/[controller]")]
    public class RankController : Controller
    {
        private AppDbContext db;

        public RankController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action")]
        [ProducesResponseType(typeof(QueryResult<Rank>), 200)]
        public async Task<IActionResult> QueryRanks(
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryRanks(page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        public async Task<Rank> GetRank([FromRoute]int id) => await db.GetRank(id);

        [HttpPost("[action]")]
        public async Task AddRank([FromBody]Rank rank) => await db.AddRank(rank);

        [HttpPost("[action]")]
        public async Task UpdateRank([FromBody]Rank rank) => await db.UpdateRank(rank);

        [HttpPost("[action]")]
        public async Task RemoveRank([FromBody]Rank rank) => await db.RemoveRank(rank);
    }
}