using System.Collections.Generic;

namespace AppSupport.Core.ApiQuery
{
    public class QueryResult<T>
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string Search { get; set; }
        public int TotalCount { get; set; }
        public List<T> Data { get; set; }
    }
}
