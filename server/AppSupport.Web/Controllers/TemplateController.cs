using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using AppSupport.Core.ApiQuery;
using AppSupport.Data;
using AppSupport.Data.Entities;
using AppSupport.Data.Extensions;
using AppSupport.Data.Models;

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

        #region Template

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
        public async Task<Template> GetTemplate([FromRoute]int id) => await db.GetTemplate(id);

        [HttpPost("[action]")]
        public async Task AddTemplate([FromBody]Template template) => await db.AddTemplate(template);

        [HttpPost("[action]")]
        public async Task UpdateTemplate([FromBody]Template template) => await db.UpdateTemplate(template);

        [HttpPost("[action]")]
        public async Task RemoveTemplate([FromBody]Template template) => await db.RemoveTemplate(template);

        #endregion

        #region Template Planes

        [HttpGet("[action]/{templateId}/{orgId}")]
        public async Task<List<Plane>> GetAvailableTemplatePlanes([FromRoute]int templateId, [FromRoute]int orgId) =>
            await db.GetAvailableTemplatePlanes(templateId, orgId);

        [HttpGet("[action]/{id}")]
        public async Task<List<PlaneModel>> GetTemplatePlanes([FromRoute]int id) => await db.GetTemplatePlanes(id);

        [HttpGet("[action]/{id}")]
        public async Task<List<PlaneModel>> GetTemplatePlanesWithSpace([FromRoute]int id) => await db.GetTemplatePlanesWithSpace(id);

        [HttpPost("[action]/{id}")]
        public async Task AddTemplatePlanes([FromRoute]int id, [FromBody]List<Plane> planes) => await db.AddTemplatePlanes(id, planes);

        [HttpPost("[action]")]
        public async Task RemoveTemplatePlane([FromBody]TemplatePlane templatePlane) => await db.RemoveTemplatePlane(templatePlane);

        #endregion

        #region Template Plane People

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
        public async Task<List<PersonModel>> GetTemplatePeople([FromRoute]int id) => await db.GetTemplatePeople(id);

        [HttpGet("[action]/{id}/{search}")]
        public async Task<List<PersonModel>> SearchTemplatePeople([FromRoute]int id, [FromRoute]string search) => await db.GetTemplatePeople(id, search);

        [HttpPost("[action]/{id}")]
        public async Task AddTemplatePeople([FromRoute]int id, [FromBody]List<Person> people) => await db.AddTemplatePeople(id, people);

        [HttpPost("[action]")]
        public async Task UpdateTemplatePerson([FromBody]TemplatePerson templatePerson) => await db.UpdateTemplatePerson(templatePerson);

        [HttpPost("[action]")]
        public async Task RemoveTemplatePerson([FromBody]TemplatePerson templatePerson) => await db.RemoveTemplatePerson(templatePerson);

        #endregion
    }
}