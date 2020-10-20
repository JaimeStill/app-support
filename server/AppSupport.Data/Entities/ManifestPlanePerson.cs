namespace AppSupport.Data.Entities
{
    public class ManifestPlanePerson
    {
        public int Id { get; set; }
        public int ManifestPlaneId { get; set; }
        public int PersonId { get; set; }
        public string Branch { get; set; }
        public string Nickname { get; set; }
        public string Occupation { get; set; }
        public string Organization { get; set; }
        public string Rank { get; set; }
        public string Title { get; set; }

        public ManifestPlane ManifestPlane { get; set; }
        public Person Person { get; set; }
    }
}