namespace AppSupport.Data.Entities
{
    public class TemplatePerson
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public int TemplatePlaneId { get; set; }

        public Person Person { get; set; }
        public TemplatePlane TemplatePlane { get; set; }
    }
}