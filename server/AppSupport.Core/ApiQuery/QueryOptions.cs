namespace AppSupport.Core.ApiQuery
{
    public class QueryOptions
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; }
        public string Search { get; set; }
        public string SortProperty { get; set; }
        public bool SortDescending { get; set; }
    }
}
