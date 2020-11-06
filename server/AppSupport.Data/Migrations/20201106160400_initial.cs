﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace AppSupport.Data.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Branch",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Branch", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Organization",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organization", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DefaultPageSize = table.Column<int>(nullable: true),
                    Guid = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    UserName = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    SocketName = table.Column<string>(nullable: true),
                    IsAdmin = table.Column<bool>(nullable: false),
                    IsHr = table.Column<bool>(nullable: false),
                    IsTech = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rank",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BranchId = table.Column<int>(nullable: false),
                    Order = table.Column<int>(nullable: false),
                    Label = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Grade = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rank", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rank_Branch_BranchId",
                        column: x => x.BranchId,
                        principalTable: "Branch",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Manifest",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrganizationId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    DateCreated = table.Column<DateTime>(nullable: false),
                    DateExpected = table.Column<DateTime>(nullable: false),
                    DateExecuted = table.Column<DateTime>(nullable: true),
                    IsClosed = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Manifest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Manifest_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Plane",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrganizationId = table.Column<int>(nullable: false),
                    Capacity = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plane", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Plane_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Template",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrganizationId = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Template", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Template_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Person",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExecutiveId = table.Column<int>(nullable: true),
                    OrganizationId = table.Column<int>(nullable: false),
                    RankId = table.Column<int>(nullable: false),
                    DodId = table.Column<int>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    MiddleName = table.Column<string>(nullable: true),
                    Nickname = table.Column<string>(nullable: true),
                    Occupation = table.Column<string>(nullable: true),
                    Ssn = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Person_Person_ExecutiveId",
                        column: x => x.ExecutiveId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Person_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Person_Rank_RankId",
                        column: x => x.RankId,
                        principalTable: "Rank",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ManifestPlane",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ManifestId = table.Column<int>(nullable: false),
                    PlaneId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManifestPlane", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ManifestPlane_Manifest_ManifestId",
                        column: x => x.ManifestId,
                        principalTable: "Manifest",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ManifestPlane_Plane_PlaneId",
                        column: x => x.PlaneId,
                        principalTable: "Plane",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TemplatePlane",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlaneId = table.Column<int>(nullable: false),
                    TemplateId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplatePlane", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TemplatePlane_Plane_PlaneId",
                        column: x => x.PlaneId,
                        principalTable: "Plane",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TemplatePlane_Template_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "Template",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ManifestPerson",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ManifestPlaneId = table.Column<int>(nullable: false),
                    OrganizationId = table.Column<int>(nullable: false),
                    PersonId = table.Column<int>(nullable: false),
                    RankId = table.Column<int>(nullable: false),
                    TravelerId = table.Column<int>(nullable: false),
                    Nickname = table.Column<string>(nullable: true),
                    Occupation = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManifestPerson", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ManifestPerson_ManifestPlane_ManifestPlaneId",
                        column: x => x.ManifestPlaneId,
                        principalTable: "ManifestPlane",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ManifestPerson_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ManifestPerson_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ManifestPerson_Rank_RankId",
                        column: x => x.RankId,
                        principalTable: "Rank",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ManifestPerson_Person_TravelerId",
                        column: x => x.TravelerId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TemplatePerson",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonId = table.Column<int>(nullable: false),
                    TemplatePlaneId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplatePerson", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TemplatePerson_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TemplatePerson_TemplatePlane_TemplatePlaneId",
                        column: x => x.TemplatePlaneId,
                        principalTable: "TemplatePlane",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Manifest_OrganizationId",
                table: "Manifest",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_ManifestPerson_ManifestPlaneId",
                table: "ManifestPerson",
                column: "ManifestPlaneId");

            migrationBuilder.CreateIndex(
                name: "IX_ManifestPerson_OrganizationId",
                table: "ManifestPerson",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_ManifestPerson_PersonId",
                table: "ManifestPerson",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_ManifestPerson_RankId",
                table: "ManifestPerson",
                column: "RankId");

            migrationBuilder.CreateIndex(
                name: "IX_ManifestPerson_TravelerId",
                table: "ManifestPerson",
                column: "TravelerId");

            migrationBuilder.CreateIndex(
                name: "IX_ManifestPlane_ManifestId",
                table: "ManifestPlane",
                column: "ManifestId");

            migrationBuilder.CreateIndex(
                name: "IX_ManifestPlane_PlaneId",
                table: "ManifestPlane",
                column: "PlaneId");

            migrationBuilder.CreateIndex(
                name: "IX_Person_ExecutiveId",
                table: "Person",
                column: "ExecutiveId");

            migrationBuilder.CreateIndex(
                name: "IX_Person_OrganizationId",
                table: "Person",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Person_RankId",
                table: "Person",
                column: "RankId");

            migrationBuilder.CreateIndex(
                name: "IX_Plane_OrganizationId",
                table: "Plane",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Rank_BranchId",
                table: "Rank",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Template_OrganizationId",
                table: "Template",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_TemplatePerson_PersonId",
                table: "TemplatePerson",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_TemplatePerson_TemplatePlaneId",
                table: "TemplatePerson",
                column: "TemplatePlaneId");

            migrationBuilder.CreateIndex(
                name: "IX_TemplatePlane_PlaneId",
                table: "TemplatePlane",
                column: "PlaneId");

            migrationBuilder.CreateIndex(
                name: "IX_TemplatePlane_TemplateId",
                table: "TemplatePlane",
                column: "TemplateId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ManifestPerson");

            migrationBuilder.DropTable(
                name: "TemplatePerson");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "ManifestPlane");

            migrationBuilder.DropTable(
                name: "Person");

            migrationBuilder.DropTable(
                name: "TemplatePlane");

            migrationBuilder.DropTable(
                name: "Manifest");

            migrationBuilder.DropTable(
                name: "Rank");

            migrationBuilder.DropTable(
                name: "Plane");

            migrationBuilder.DropTable(
                name: "Template");

            migrationBuilder.DropTable(
                name: "Branch");

            migrationBuilder.DropTable(
                name: "Organization");
        }
    }
}
