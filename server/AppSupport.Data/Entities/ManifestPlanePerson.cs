namespace AppSupport.Data.Entities
{
    public class ManifestPlanePerson
    {
        public int Id { get; set; }
        public int ManifestPlaneId { get; set; }
        public int PersonId { get; set; }

        public ManifestPlane ManifestPlane { get; set; }
        public Person Person { get; set; }
    }
}