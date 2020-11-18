using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using AppSupport.Core.ApiQuery;
using AppSupport.Core.Extensions;
using AppSupport.Data;
using AppSupport.Data.Entities;
using AppSupport.Data.Extensions;
using AppSupport.Data.Models;
using AppSupport.Office;
using AppSupport.Office.Extensions;
using System.Net.Http.Headers;

namespace AppSupport.Web.Controllers
{
    [Route("api/[controller]")]
    public class ManifestController : Controller
    {
        private AppDbContext db;
        private OfficeConfig office;

        public ManifestController(AppDbContext db, OfficeConfig office)
        {
            this.db = db;
            this.office = office;
        }

        #region Manifest

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(QueryResult<Manifest>), 200)]
        public async Task<IActionResult> QueryOpenManifests(
            [FromRoute]int id,
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryOpenManifests(id, page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(QueryResult<Manifest>), 200)]
        public async Task<IActionResult> QueryClosedManifests(
            [FromRoute]int id,
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryClosedManifests(id, page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        public async Task<Manifest> GetManifest([FromRoute]int id) => await db.GetManifest(id);

        [HttpGet("[action]/{id}")]
        public async Task<int> GenerateManifest([FromRoute]int id) => await db.GenerateManifest(id);

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> CreateManifestStream([FromRoute]int id)
        {
            var manifest = await db.GetManifestModel(id);
            var res = manifest.GenerateDocument(office.Directory);
            var path = Path.Join(office.Directory, $"{manifest.Title.UrlEncode()}.xlsx");
            var bytes = await System.IO.File.ReadAllBytesAsync(path);
            System.IO.File.Delete(path);

            return new FileContentResult(bytes, "application/octet")
            {
                FileDownloadName = $"{manifest.Title.UrlEncode()}.xlsx"
            };
        }

        [HttpGet("[action]/{id}")]
        public async Task<string[]> CreateManifestSpreadsheet([FromRoute]int id)
        {
            var manifest = await db.GetManifestModel(id);
            var path = Path.Join(office.Directory, "manifest", id.ToString());
            path.EnsureDirectoryExists();
            var res = manifest.GenerateDocument(path);

            return res
                ? new string[] { "office", "manifest", id.ToString(), $"{manifest.Title.UrlEncode()}.xlsx" }
                : null;
        }

        [HttpPost("[action]")]
        public async Task<int> AddManifest([FromBody]Manifest manifest) => await db.AddManifest(manifest);

        [HttpPost("[action]")]
        public async Task UpdateManifest([FromBody]Manifest manifest) => await db.UpdateManifest(manifest);

        [HttpPost("[action]")]
        public async Task ToggleManifestClosed([FromBody]Manifest manifest) => await db.ToggleManifestClosed(manifest);

        [HttpPost("[action]")]
        public async Task RemoveManifest([FromBody]Manifest manifest) => await db.RemoveManifest(manifest);

        #endregion

        #region ManifestPlane

        [HttpGet("[action]/{manifestId}/{orgId}")]
        public async Task<List<Plane>> GetAvailableManifestPlanes([FromRoute]int manifestId, [FromRoute]int orgId) =>
            await db.GetAvailableManifestPlanes(manifestId, orgId);

        [HttpGet("[action]/{id}")]
        public async Task<List<PlaneModel>> GetManifestPlanes([FromRoute]int id) => await db.GetManifestPlanes(id);

        [HttpGet("[action]/{id}")]
        public async Task<List<PlaneModel>> GetManifestPlanesWithSpace([FromRoute]int id) => await db.GetManifestPlanesWithSpace(id);

        [HttpPost("[action]/{id}")]
        public async Task AddManifestPlanes([FromRoute]int id, [FromBody]List<Plane> planes) =>
            await db.AddManifestPlanes(id, planes);

        [HttpPost("[action]")]
        public async Task RemoveManifestPlane([FromBody]ManifestPlane manifestPlane) => await db.RemoveManifestPlane(manifestPlane);

        #endregion

        #region ManifestPerson

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(QueryResult<Person>), 200)]
        public async Task<IActionResult> QueryAvailableManifestPeople(
            [FromRoute]int id,
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryAvailableManifestPeople(id, page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        public async Task<List<PersonModel>> GetManifestPeople([FromRoute]int id) => await db.GetManifestPeople(id);

        [HttpGet("[action]/{id}/{search}")]
        public async Task<List<PersonModel>> SearchManifestPeople([FromRoute]int id, [FromRoute]string search) =>
            await db.GetManifestPeople(id, search);

        [HttpPost("[action]/{id}")]
        public async Task AddManifestPeople([FromRoute]int id, [FromBody]List<Person> people) =>
            await db.AddManifestPeople(id, people);

        [HttpPost("[action]")]
        public async Task UpdateManifestPerson([FromBody]ManifestPerson manifestPerson) => await db.UpdateManifestPerson(manifestPerson);

        [HttpPost("[action]")]
        public async Task RemoveManifestPerson([FromBody]ManifestPerson manifestPerson) => await db.RemoveManifestPerson(manifestPerson);

        #endregion
    }
}