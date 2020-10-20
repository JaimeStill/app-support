using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppSupport.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace AppSupport.Data.Extensions
{
    public static class DbInitializer
    {
        public static async Task Initialize(this AppDbContext db)
        {
            Console.WriteLine("Initializing database");
            await db.Database.MigrateAsync();
            Console.WriteLine("Database initialized");

            if (!await db.Branches.AnyAsync())
            {
                Console.WriteLine("Seeding branches...");

                var branches = new List<Branch>
                {
                    new Branch
                    {
                        Name = "Army",
                        Ranks = new List<Rank>
                        {
                            new Rank
                            {
                                Grade = "E1",
                                Label = "PVT",
                                Name = "Private",
                                Order = 1
                            },
                            new Rank
                            {
                                Grade = "E2",
                                Label = "PV2",
                                Name = "Private",
                                Order = 2
                            },
                            new Rank
                            {
                                Grade = "E3",
                                Label = "PFC",
                                Name = "Private First Class",
                                Order = 3
                            },
                            new Rank
                            {
                                Grade = "E4",
                                Label = "SPC",
                                Name = "Specialist",
                                Order = 4
                            },
                            new Rank
                            {
                                Grade = "E4",
                                Label = "CPL",
                                Name = "Corporal",
                                Order = 5
                            },
                            new Rank
                            {
                                Grade = "E5",
                                Label = "SGT",
                                Name = "Sergeant",
                                Order = 6
                            },
                            new Rank
                            {
                                Grade = "E6",
                                Label = "SSG",
                                Name = "Staff Sergeant",
                                Order = 7
                            },
                            new Rank
                            {
                                Grade = "E7",
                                Label = "SFC",
                                Name = "Sergeant First Class",
                                Order = 8
                            },
                            new Rank
                            {
                                Grade = "E8",
                                Label = "MSG",
                                Name = "Master Sergeant",
                                Order = 9
                            },
                            new Rank
                            {
                                Grade = "E8",
                                Label = "1SG",
                                Name = "First Sergeant",
                                Order = 10
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "SGM",
                                Name = "Sergeant Major",
                                Order = 11
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "CSM",
                                Name = "Command Sergeant Major",
                                Order = 12
                            },
                            new Rank
                            {
                                Grade = "W1",
                                Label = "WO1",
                                Name = "Warrant Officer 1",
                                Order = 13
                            },
                            new Rank
                            {
                                Grade = "W2",
                                Label = "CW2",
                                Name = "Chief Warrant Officer 2",
                                Order = 14
                            },
                            new Rank
                            {
                                Grade = "W3",
                                Label = "CW3",
                                Name = "Chief Warrant Officer 3",
                                Order = 15
                            },
                            new Rank
                            {
                                Grade = "W4",
                                Label = "CW4",
                                Name = "Chief Warrant Officer 4",
                                Order = 16
                            },
                            new Rank
                            {
                                Grade = "W5",
                                Label = "CW5",
                                Name = "Chief Warrant Officer 5",
                                Order = 17
                            },
                            new Rank
                            {
                                Grade = "O1",
                                Label = "2LT",
                                Name = "Second Lieutenant",
                                Order = 18
                            },
                            new Rank
                            {
                                Grade = "O2",
                                Label = "1LT",
                                Name = "First Lieutenant",
                                Order = 19
                            },
                            new Rank
                            {
                                Grade = "O3",
                                Label = "CPT",
                                Name = "Captain",
                                Order = 20
                            },
                            new Rank
                            {
                                Grade = "O4",
                                Label = "MAJ",
                                Name = "Major",
                                Order = 21
                            },
                            new Rank
                            {
                                Grade = "O5",
                                Label = "LTC",
                                Name = "Lieutenant Colonel",
                                Order = 22
                            },
                            new Rank
                            {
                                Grade = "O6",
                                Label = "COL",
                                Name = "Colonel",
                                Order = 23
                            },
                            new Rank
                            {
                                Grade = "O7",
                                Label = "BG",
                                Name = "Brigadier General",
                                Order = 24
                            },
                            new Rank
                            {
                                Grade = "O8",
                                Label = "MG",
                                Name = "Major General",
                                Order = 25
                            },
                            new Rank
                            {
                                Grade = "O9",
                                Label = "LTG",
                                Name = "Lieutenant General",
                                Order = 26
                            },
                            new Rank
                            {
                                Grade = "O10",
                                Label = "GEN",
                                Name = "General",
                                Order = 27
                            }
                        }
                    },
                    new Branch
                    {
                        Name = "Air Force",
                        Ranks = new List<Rank>
                        {
                            new Rank
                            {
                                Grade = "E1",
                                Label = "AB",
                                Name = "Airman Basic",
                                Order = 1
                            },
                            new Rank
                            {
                                Grade = "E2",
                                Label = "Amn",
                                Name = "Airman",
                                Order = 2
                            },
                            new Rank
                            {
                                Grade = "E3",
                                Label = "A1C",
                                Name = "Airman First Class",
                                Order = 3
                            },
                            new Rank
                            {
                                Grade = "E4",
                                Label = "SrA",
                                Name = "Senior Airman",
                                Order = 4
                            },
                            new Rank
                            {
                                Grade = "E5",
                                Label = "SSgt",
                                Name = "Staff Sergeant",
                                Order = 5
                            },
                            new Rank
                            {
                                Grade = "E6",
                                Label = "TSgt",
                                Name = "Technical Sergeant",
                                Order = 6
                            },
                            new Rank
                            {
                                Grade = "E7",
                                Label = "MSgt",
                                Name = "Master Sergeant",
                                Order = 7
                            },
                            new Rank
                            {
                                Grade = "E7",
                                Label = "MSgt",
                                Name = "First Sergeant",
                                Order = 8
                            },
                            new Rank
                            {
                                Grade = "E8",
                                Label = "SMSgt",
                                Name = "Senior Master Sergeant",
                                Order = 9
                            },
                            new Rank
                            {
                                Grade = "E8",
                                Label = "SMSgt",
                                Name = "First Sergeant",
                                Order = 10
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "CMSgt",
                                Name = "Chief Master Sergeant",
                                Order = 11
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "CMSgt",
                                Name = "First Sergeant",
                                Order = 12
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "CMSgt",
                                Name = "Command Chief Master Sergeant",
                                Order = 13
                            },
                            new Rank
                            {
                                Grade = "O1",
                                Label = "2d Lt",
                                Name = "Second Lieutenant",
                                Order = 14
                            },
                            new Rank
                            {
                                Grade = "O2",
                                Label = "1st Lt",
                                Name = "First Lieutenant",
                                Order = 15
                            },
                            new Rank
                            {
                                Grade = "O3",
                                Label = "Capt",
                                Name = "Captain",
                                Order = 16
                            },
                            new Rank
                            {
                                Grade = "O4",
                                Label = "Maj",
                                Name = "Major",
                                Order = 17
                            },
                            new Rank
                            {
                                Grade = "O5",
                                Label = "Lt Col",
                                Name = "Lieutenant Colonel",
                                Order = 18
                            },
                            new Rank
                            {
                                Grade = "O6",
                                Label = "Col",
                                Name = "Colonel",
                                Order = 19
                            },
                            new Rank
                            {
                                Grade = "O7",
                                Label = "Brig Gen",
                                Name = "Brigadier General",
                                Order = 20
                            },
                            new Rank
                            {
                                Grade = "O8",
                                Label = "Maj Gen",
                                Name = "Major General",
                                Order = 21
                            },
                            new Rank
                            {
                                Grade = "O9",
                                Label = "Lt Gen",
                                Name = "Lieutenant General",
                                Order = 22
                            },
                            new Rank
                            {
                                Grade = "O10",
                                Label = "Gen",
                                Name = "General",
                                Order = 23
                            }
                        }
                    },
                    new Branch
                    {
                        Name = "Navy",
                        Ranks = new List<Rank>
                        {
                            new Rank
                            {
                                Grade = "E1",
                                Label = "SR",
                                Name = "Seaman Recruit",
                                Order = 1
                            },
                            new Rank
                            {
                                Grade = "E2",
                                Label = "SA",
                                Name = "Seaman Apprentice",
                                Order = 2
                            },
                            new Rank
                            {
                                Grade = "E3",
                                Label = "SN",
                                Name = "Seaman",
                                Order = 3
                            },
                            new Rank
                            {
                                Grade = "E4",
                                Label = "PO3",
                                Name = "Petty Officer Third Class",
                                Order = 4
                            },
                            new Rank
                            {
                                Grade = "E5",
                                Label = "PO2",
                                Name = "Petty Officer Second Class",
                                Order = 5
                            },
                            new Rank
                            {
                                Grade = "E6",
                                Label = "PO1",
                                Name = "Petty Officer First Class",
                                Order = 6
                            },
                            new Rank
                            {
                                Grade = "E7",
                                Label = "CPO",
                                Name = "Chief Petty Officer",
                                Order = 7
                            },
                            new Rank
                            {
                                Grade = "E8",
                                Label = "SCPO",
                                Name = "Senior Chief Petty Officer",
                                Order = 8
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "MCPO",
                                Name = "Master Chief Petty Officer",
                                Order = 9
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "MCPO",
                                Name = "Fleet Master Chief Petty Officer",
                                Order = 10
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "MCPO",
                                Name = "Command Master Chief Petty Officer",
                                Order = 11
                            },
                            new Rank
                            {
                                Grade = "W1",
                                Label = "WO1",
                                Name = "USN Warrant Officer 1",
                                Order = 12
                            },
                            new Rank
                            {
                                Grade = "W2",
                                Label = "CWO2",
                                Name = "USN Chief Warrant Officer 2",
                                Order = 13
                            },
                            new Rank
                            {
                                Grade = "W3",
                                Label = "CWO3",
                                Name = "USN Chief Warrant Officer 3",
                                Order = 14
                            },
                            new Rank
                            {
                                Grade = "W4",
                                Label = "CWO4",
                                Name = "USN Chief Warrant Officer 4",
                                Order = 15
                            },
                            new Rank
                            {
                                Grade = "W5",
                                Label = "CWO5",
                                Name = "USN Chief Warrant Officer 5",
                                Order = 16
                            },
                            new Rank
                            {
                                Grade = "O1",
                                Label = "ENS",
                                Name = "Ensign",
                                Order = 18
                            },
                            new Rank
                            {
                                Grade = "O2",
                                Label = "LTJG",
                                Name = "Lieutenant Junior Grade",
                                Order = 19
                            },
                            new Rank
                            {
                                Grade = "O3",
                                Label = "LT",
                                Name = "Lieutenant",
                                Order = 20
                            },
                            new Rank
                            {
                                Grade = "O4",
                                Label = "LCDR",
                                Name = "Lieutenant Commander",
                                Order = 21
                            },
                            new Rank
                            {
                                Grade = "O5",
                                Label = "CDR",
                                Name = "Commander",
                                Order = 22
                            },
                            new Rank
                            {
                                Grade = "O6",
                                Label = "CAPT",
                                Name = "Captain",
                                Order = 23
                            },
                            new Rank
                            {
                                Grade = "O7",
                                Label = "RDML",
                                Name = "Rear Admiral Lower Half",
                                Order = 24
                            },
                            new Rank
                            {
                                Grade = "O8",
                                Label = "RADM",
                                Name = "Rear Admiral Upper Half",
                                Order = 25
                            },
                            new Rank
                            {
                                Grade = "O9",
                                Label = "VADM",
                                Name = "Vice Admiral",
                                Order = 26
                            },
                            new Rank
                            {
                                Grade = "O10",
                                Label = "ADM",
                                Name = "Admiral",
                                Order = 27
                            }
                        }
                    },
                    new Branch
                    {
                        Name = "Marine Corps",
                        Ranks = new List<Rank>
                        {
                            new Rank
                            {
                                Grade = "E1",
                                Label = "PVT",
                                Name = "Private",
                                Order = 1
                            },
                            new Rank
                            {
                                Grade = "E2",
                                Label = "PFC",
                                Name = "Private First Class",
                                Order = 2
                            },
                            new Rank
                            {
                                Grade = "E3",
                                Label = "LCpl",
                                Name = "Lance Corporal",
                                Order = 3
                            },
                            new Rank
                            {
                                Grade = "E4",
                                Label = "Cpl",
                                Name = "Corporal",
                                Order = 4
                            },
                            new Rank
                            {
                                Grade = "E5",
                                Label = "Sgt",
                                Name = "Sergeant",
                                Order = 5
                            },
                            new Rank
                            {
                                Grade = "E6",
                                Label = "SSgt",
                                Name = "Staff Sergeant",
                                Order = 6
                            },
                            new Rank
                            {
                                Grade = "E7",
                                Label = "GySgt",
                                Name = "Gunnery Sergeant",
                                Order = 7
                            },
                            new Rank
                            {
                                Grade = "E8",
                                Label = "MSgt",
                                Name = "Master Sergeant",
                                Order = 8
                            },
                            new Rank
                            {
                                Grade = "E8",
                                Label = "MSgt",
                                Name = "First Sergeant",
                                Order = 9
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "MGySgt",
                                Name = "Master Gunnery Sergeant",
                                Order = 10
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "SgtMaj",
                                Name = "Sergeant Major",
                                Order = 11
                            },
                            new Rank
                            {
                                Grade = "W1",
                                Label = "WO",
                                Name = "Warrant Officer 1",
                                Order = 12
                            },
                            new Rank
                            {
                                Grade = "W2",
                                Label = "CWO2",
                                Name = "Chief Warrant Officer 2",
                                Order = 13
                            },
                            new Rank
                            {
                                Grade = "W3",
                                Label = "CWO3",
                                Name = "Chief Warrant Officer 3",
                                Order = 14
                            },
                            new Rank
                            {
                                Grade = "W4",
                                Label = "CWO4",
                                Name = "Chief Warrant Officer 4",
                                Order = 15
                            },
                            new Rank
                            {
                                Grade = "W5",
                                Label = "CWO5",
                                Name = "Chief Warrant Officer 5",
                                Order = 16
                            },
                            new Rank
                            {
                                Grade = "O1",
                                Label = "2ndLt",
                                Name = "Second Lieutenant",
                                Order = 17
                            },
                            new Rank
                            {
                                Grade = "O2",
                                Label = "1stLt",
                                Name = "First Lieutenant",
                                Order = 18
                            },
                            new Rank
                            {
                                Grade = "O3",
                                Label = "Capt",
                                Name = "Captain",
                                Order = 19
                            },
                            new Rank
                            {
                                Grade = "O4",
                                Label = "Maj",
                                Name = "Major",
                                Order = 20
                            },
                            new Rank
                            {
                                Grade = "O5",
                                Label = "LtCol",
                                Name = "Lieutenant Colonel",
                                Order = 21
                            },
                            new Rank
                            {
                                Grade = "O6",
                                Label = "Col",
                                Name = "Colonel",
                                Order = 22
                            },
                            new Rank
                            {
                                Grade = "O7",
                                Label = "BGen",
                                Name = "Brigadier General",
                                Order = 23
                            },
                            new Rank
                            {
                                Grade = "O8",
                                Label = "MajGen",
                                Name = "Major General",
                                Order = 24
                            },
                            new Rank
                            {
                                Grade = "O9",
                                Label = "LtGen",
                                Name = "Lieutenant General",
                                Order = 25
                            },
                            new Rank
                            {
                                Grade = "O10",
                                Label = "Gen",
                                Name = "General",
                                Order = 26
                            }
                        }
                    },
                    new Branch
                    {
                        Name = "Coast Guard",
                        Ranks = new List<Rank>
                        {
                            new Rank
                            {
                                Grade = "E1",
                                Label = "SR",
                                Name = "Seaman Recruit",
                                Order = 1
                            },
                            new Rank
                            {
                                Grade = "E2",
                                Label = "SA",
                                Name = "Seaman Apprentice",
                                Order = 2
                            },
                            new Rank
                            {
                                Grade = "E3",
                                Label = "SN",
                                Name = "Seaman",
                                Order = 3
                            },
                            new Rank
                            {
                                Grade = "E4",
                                Label = "PO3",
                                Name = "Petty Officer Third Class",
                                Order = 4
                            },
                            new Rank
                            {
                                Grade = "E5",
                                Label = "PO2",
                                Name = "Petty Officer Second Class",
                                Order = 5
                            },
                            new Rank
                            {
                                Grade = "E6",
                                Label = "PO1",
                                Name = "Petty Officer First Class",
                                Order = 6
                            },
                            new Rank
                            {
                                Grade = "E7",
                                Label = "CPO",
                                Name = "Chief Petty Officer",
                                Order = 7
                            },
                            new Rank
                            {
                                Grade = "E8",
                                Label = "SCPO",
                                Name = "Senior Chief Petty Officer",
                                Order = 8
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "MCPO",
                                Name = "Master Chief Petty Officer",
                                Order = 9
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "MCPO",
                                Name = "Fleet Master Chief Petty Officer",
                                Order = 10
                            },
                            new Rank
                            {
                                Grade = "E9",
                                Label = "MCPO",
                                Name = "Command Master Chief Petty Officer",
                                Order = 11
                            },
                            new Rank
                            {
                                Grade = "W2",
                                Label = "CWO2",
                                Name = "Chief Warrant Officer 2",
                                Order = 12
                            },
                            new Rank
                            {
                                Grade = "W3",
                                Label = "CWO3",
                                Name = "Chief Warrant Officer 3",
                                Order = 13
                            },
                            new Rank
                            {
                                Grade = "W4",
                                Label = "CWO4",
                                Name = "Chief Warrant Officer 4",
                                Order = 14
                            },
                            new Rank
                            {
                                Grade = "O1",
                                Label = "ENS",
                                Name = "Ensign",
                                Order = 15
                            },
                            new Rank
                            {
                                Grade = "O2",
                                Label = "LTJG",
                                Name = "Lieutenant Junior Grade",
                                Order = 16
                            },
                            new Rank
                            {
                                Grade = "O3",
                                Label = "LT",
                                Name = "Lieutenant",
                                Order = 17
                            },
                            new Rank
                            {
                                Grade = "O4",
                                Label = "LCDR",
                                Name = "Lieutenant Commander",
                                Order = 18
                            },
                            new Rank
                            {
                                Grade = "O5",
                                Label = "CDR",
                                Name = "Commander",
                                Order = 19
                            },
                            new Rank
                            {
                                Grade = "O6",
                                Label = "CAPT",
                                Name = "Captain",
                                Order = 20
                            },
                            new Rank
                            {
                                Grade = "O7",
                                Label = "RDML",
                                Name = "Rear Admiral Lower Half",
                                Order = 21
                            },
                            new Rank
                            {
                                Grade = "O8",
                                Label = "RADM",
                                Name = "Rear Admiral Upper Half",
                                Order = 22
                            },
                            new Rank
                            {
                                Grade = "O9",
                                Label = "VADM",
                                Name = "Vice Admiral",
                                Order = 23
                            },
                            new Rank
                            {
                                Grade = "O10",
                                Label = "ADM",
                                Name = "Admiral",
                                Order = 24
                            }
                        }
                    },
                    new Branch
                    {
                        Name = "Civilian",
                        Ranks = new List<Rank>
                        {
                            new Rank
                            {
                                Grade = "GS1",
                                Label = "GS-1",
                                Name = "Civilian",
                                Order = 1
                            },
                            new Rank
                            {
                                Grade = "GS2",
                                Label = "GS-2",
                                Name = "Civilian",
                                Order = 2
                            },
                            new Rank
                            {
                                Grade = "GS3",
                                Label = "GS-3",
                                Name = "Civilian",
                                Order = 3
                            },
                            new Rank
                            {
                                Grade = "GS4",
                                Label = "GS-4",
                                Name = "Civilian",
                                Order = 4
                            },
                            new Rank
                            {
                                Grade = "GS5",
                                Label = "GS-5",
                                Name = "Civilian",
                                Order = 5
                            },
                            new Rank
                            {
                                Grade = "GS6",
                                Label = "GS-6",
                                Name = "Civilian",
                                Order = 6
                            },
                            new Rank
                            {
                                Grade = "GS7",
                                Label = "GS-7",
                                Name = "Civilian",
                                Order = 7
                            },
                            new Rank
                            {
                                Grade = "GS8",
                                Label = "GS-8",
                                Name = "Civilian",
                                Order = 8
                            },
                            new Rank
                            {
                                Grade = "GS9",
                                Label = "GS-9",
                                Name = "Civilian",
                                Order = 9
                            },
                            new Rank
                            {
                                Grade = "GS10",
                                Label = "GS-10",
                                Name = "Civilian",
                                Order = 10
                            },
                            new Rank
                            {
                                Grade = "GS11",
                                Label = "GS-11",
                                Name = "Civilian",
                                Order = 11
                            },
                            new Rank
                            {
                                Grade = "GS12",
                                Label = "GS-12",
                                Name = "Civilian",
                                Order = 12
                            },
                            new Rank
                            {
                                Grade = "GS13",
                                Label = "GS-13",
                                Name = "Civilian",
                                Order = 13
                            },
                            new Rank
                            {
                                Grade = "GS14",
                                Label = "GS-14",
                                Name = "Civilian",
                                Order = 14
                            },
                            new Rank
                            {
                                Grade = "GS15",
                                Label = "GS-15",
                                Name = "Civilian",
                                Order = 15
                            },
                            new Rank
                            {
                                Grade = "SES",
                                Label = "SES",
                                Name = "Civilian",
                                Order = 16
                            }
                        }
                    },
                    new Branch
                    {
                        Name = "Contractor",
                        Ranks = new List<Rank>
                        {
                            new Rank
                            {
                                Grade = "CTR",
                                Label = "CTR",
                                Name = "Contractor",
                                Order = 1
                            }
                        }
                    }
                };

                await db.Branches.AddRangeAsync(branches);
                await db.SaveChangesAsync();
            }
        }
    }
}
