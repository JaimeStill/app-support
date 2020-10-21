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
    public class BranchController : Controller
    {
        private AppDbContext db;

        public BranchController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(QueryResult<Branch>), 200)]
        public async Task<IActionResult> QueryBranches(
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryBranches(page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        public async Task<Branch> GetBranch([FromRoute]int id) => await db.GetBranch(id);

        [HttpPost("[action]")]
        public async Task AddBranch([FromBody]Branch branch) => await db.AddBranch(branch);

        [HttpPost("[action]")]
        public async Task UpdateBranch([FromBody]Branch branch) => await db.UpdateBranch(branch);

        [HttpPost("[action]")]
        public async Task RemoveBranch([FromBody]Branch branch) => await db.RemoveBranch(branch);
    }
}