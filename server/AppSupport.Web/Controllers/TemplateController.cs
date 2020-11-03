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
    public class TemplateController : Controller
    {
        private AppDbContext db;

        public TemplateController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(QueryResult<Template>), 200)]
        public async Task<IActionResult> QueryTemplates(
            [FromRoute]int id,
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryTemplates(id, page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        [ProducesResponseType(typeof(QueryResult<Person>), 200)]
        public async Task<IActionResult> QueryAvailableTemplatePeople(
            [FromRoute]int id,
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryAvailableTemplatePeople(id, page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        public async Task<Template> GetTemplate([FromRoute]int id) => await db.GetTemplate(id);

        [HttpPost("[action]")]
        public async Task AddTemplate([FromBody]Template template) => await db.AddTemplate(template);

        [HttpPost("[action]")]
        public async Task UpdateTemplate([FromBody]Template template) => await db.UpdateTemplate(template);

        [HttpPost("[action]")]
        public async Task RemoveTemplate([FromBody]Template template) => await db.RemoveTemplate(template);
    }
}