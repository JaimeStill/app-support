namespace AppSupport.Data.Models
{
    public class PlaneModel
    {
        public int Id { get; set; }
        public int AltId { get; set; }
        public int ParentId { get; set; }
        public int Capacity { get; set; }
        public int Reserved { get; set; }
        public string Name { get; set; }
    }
}