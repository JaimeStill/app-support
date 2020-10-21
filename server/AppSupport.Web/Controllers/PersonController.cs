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
    public class PersonController : Controller
    {
        private AppDbContext db;

        public PersonController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action")]
        [ProducesResponseType(typeof(QueryResult<Person>), 200)]
        public async Task<IActionResult> QueryPeople(
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryPeople(page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        public async Task<Person> GetPerson([FromRoute]int id) => await db.GetPerson(id);

        [HttpPost("[action]")]
        public async Task AddPerson([FromBody]Person person) => await db.AddPerson(person);

        [HttpPost("[action]")]
        public async Task UpdatePerson([FromBody]Person person) => await db.UpdatePerson(person);

        [HttpPost("[action]")]
        public async Task RemovePerson([FromBody]Person person) => await db.RemovePerson(person);
    }
}