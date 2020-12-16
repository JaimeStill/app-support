using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using AppSupport.Data;
using AppSupport.Data.Entities;
using AppSupport.Data.Extensions;
using SqlCore;

namespace AppSupport.Web.Controllers
{
    [Route("api/[controller]")]
    public class QueryController : Controller
    {
        private AppDbContext db;

        public QueryController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        public async Task<List<Query>> GetQueries() => await db.GetQueries();

        [HttpGet("[action]/{name}")]
        public async Task<Query> GetQuery([FromRoute]string name) => await db.GetQuery(name);

        [HttpPost("[action]")]
        public async Task<bool> ValidateQueryName([FromBody]Query query) => await db.ValidateQueryName(query);

        [HttpPost("[action]")]
        [Produces("application/json")]
        public async Task<IActionResult> ExecuteQuery([FromBody]Query query)
        {
            using var connection = await query.Server
                .BuildConnectionString(query.Database)
                .InitalizeConnection();

            using var command = connection.InitializeCommand(query.Value);
            var reader = await command.ResilientQuery();
            var result = await reader.ReadResults();

            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task AddQuery([FromBody]Query query) => await db.AddQuery(query);

        [HttpPost("[action]")]
        public async Task UpdateQuery([FromBody]Query query) => await db.UpdateQuery(query);

        [HttpPost("[action]")]
        public async Task RemoveQuery([FromBody]Query query) => await db.RemoveQuery(query);
    }
}