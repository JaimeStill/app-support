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
    public class ManifestController : Controller
    {
        private AppDbContext db;

        public ManifestController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(QueryResult<Manifest>), 200)]
        public async Task<IActionResult> QueryManifests(
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryManifests(page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        public async Task<Manifest> GetManifest([FromRoute]int id) => await db.GetManifest(id);

        [HttpGet("[action]/{id}")]
        public async Task<int> GenerateManifest([FromRoute]int id) => await db.GenerateManifest(id);

        [HttpPost("[action]")]
        public async Task<int> AddManifest([FromBody]Manifest manifest) => await db.AddManifest(manifest);

        [HttpPost("[action]")]
        public async Task UpdateManifest([FromBody]Manifest manifest) => await db.UpdateManifest(manifest);

        [HttpPost("[action]")]
        public async Task RemoveManifest([FromBody]Manifest manifest) => await db.RemoveManifest(manifest);
    }
}