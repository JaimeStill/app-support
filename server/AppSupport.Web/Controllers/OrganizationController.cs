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
    public class OrganizationController : Controller
    {
        private AppDbContext db;

        public OrganizationController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(QueryResult<Organization>), 200)]
        public async Task<IActionResult> QueryOrganizations(
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryOrganizations(page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        public async Task<Organization> GetOrganization([FromRoute]int id) => await db.GetOrganization(id);

        [HttpPost("[action]")]
        public async Task AddOrganization([FromBody]Organization org) => await db.AddOrganization(org);

        [HttpPost("[action]")]
        public async Task UpdateOrganization([FromBody]Organization org) => await db.UpdateOrganization(org);

        [HttpPost("[action]")]
        public async Task RemoveOrganization([FromBody]Organization org) => await db.RemoveOrganization(org);
    }
}