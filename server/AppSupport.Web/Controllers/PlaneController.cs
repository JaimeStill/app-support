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
    public class PlaneController : Controller
    {
        private AppDbContext db;

        public PlaneController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action")]
        [ProducesResponseType(typeof(QueryResult<Plane>), 200)]
        public async Task<IActionResult> QueryPlanes(
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryPlanes(page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        public async Task<Plane> GetPlane([FromRoute]int id) => await db.GetPlane(id);

        [HttpPost("[action]")]
        public async Task AddPlane([FromBody]Plane plane) => await db.AddPlane(plane);

        [HttpPost("[action]")]
        public async Task UpdatePlane([FromBody]Plane plane) => await db.UpdatePlane(plane);

        [HttpPost("[action]")]
        public async Task RemovePlane([FromBody]Plane plane) => await db.RemovePlane(plane);
    }
}