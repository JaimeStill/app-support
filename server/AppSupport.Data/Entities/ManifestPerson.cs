namespace AppSupport.Data.Entities
{
    public class ManifestPerson
    {
        public int Id { get; set; }
        public int ManifestPlaneId { get; set; }
        public int OrganizationId { get; set; }
        public int PersonId { get; set; }
        public int RankId { get; set; }
        public int TravelerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string Nickname { get; set; }
        public string Occupation { get; set; }
        public string Title { get; set; }

        public ManifestPlane ManifestPlane { get; set; }
        public Organization Organization { get; set; }
        public Person Person { get; set; }
        public Rank Rank { get; set; }
        public Person Traveler { get; set; }
    }
}