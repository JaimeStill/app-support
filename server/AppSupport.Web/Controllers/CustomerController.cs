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
    public class CustomerController : Controller
    {
        private AppDbContext db;

        public CustomerController(AppDbContext db)
        {
            this.db = db;
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(QueryResult<Customer>), 200)]
        public async Task<IActionResult> QueryCustomers(
            [FromQuery]string page,
            [FromQuery]string pageSize,
            [FromQuery]string search,
            [FromQuery]string sort
        ) => Ok(await db.QueryCustomers(page, pageSize, search, sort));

        [HttpGet("[action]/{id}")]
        public async Task<Customer> GetCustomer([FromRoute]int id) => await db.GetCustomer(id);

        [HttpPost("[action]")]
        public async Task RemoveCustomer([FromBody]Customer customer) => await db.RemoveCustomer(customer);

        [HttpPost("[action]")]
        public async Task<bool> IsMigrated([FromBody]Customer customer) => await customer.IsMigrated(db);

        [HttpPost("[action]")]
        public async Task ImportCustomers([FromBody]List<Customer> customers) => await db.ImportCustomers(customers);

        [HttpPost("[action]")]
        public async Task ImportCustomer([FromBody]Customer customer) => await db.ImportCustomer(customer);
    }
}