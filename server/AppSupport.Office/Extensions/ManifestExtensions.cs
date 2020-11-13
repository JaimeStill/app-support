using System;
using System.IO;
using AppSupport.Core.Extensions;
using AppSupport.Data.Models;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Spreadsheet;

namespace AppSupport.Office.Extensions
{
    public static class ManifestExtensions
    {
        public static bool GenerateDocument(this ManifestModel manifest, string path)
        {
            try
            {
                var spreadsheet = new ExcelDocument(Path.Join(path, $"{manifest.Title.UrlEncode()}.xlsx"));

                manifest.Planes.ForEach(plane => GenerateSheet(plane, spreadsheet));

                spreadsheet.SaveAndClose();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.GetExceptionChain());
            }
        }

        static void GenerateSheet(PlaneModel plane, ExcelDocument spreadsheet)
        {
            var worksheet = spreadsheet.CreateWorksheet(spreadsheet.Workbook);

            var sheet = spreadsheet.CreateSheet(worksheet, plane.Name);
            var sheetData = worksheet.Worksheet.GetFirstChild<SheetData>();

            sheetData.Append(GenerateHeader());

            plane.People.ForEach(person =>
            {
                var index = (uint)plane.People.IndexOf(person) + 2;
                sheetData.Append(GenerateRow(person, index));
            });

            ExcelDocument.ConfigureAutoFilter(worksheet, "A1:I1");
        }

        static Row GenerateHeader()
        {
            // FOR SOME STUPID FUCKING REASON, YOU CANNOT APPLY STYLES TO ROWS
            var row = new Row() { RowIndex = 1 };

            row.InsertAt(ExcelDocument.CreateCell("A1", "SSN", true), 0);
            row.InsertAt(ExcelDocument.CreateCell("B1", "Rank", true), 1);
            row.InsertAt(ExcelDocument.CreateCell("C1", "Last Name", true), 2);
            row.InsertAt(ExcelDocument.CreateCell("D1", "First Name", true), 3);
            row.InsertAt(ExcelDocument.CreateCell("E1", "Middle Name", true), 4);
            row.InsertAt(ExcelDocument.CreateCell("F1", "Title", true), 5);
            row.InsertAt(ExcelDocument.CreateCell("G1", "Organization", true), 6);
            row.InsertAt(ExcelDocument.CreateCell("H1", "DoD ID", true), 7);
            row.InsertAt(ExcelDocument.CreateCell("I1", "Occupation", true), 8);

            return row;
        }

        static Row GenerateRow(PersonModel person, uint index)
        {
            var row = new Row() { RowIndex = UInt32Value.FromUInt32(index) };

            row.InsertAt(ExcelDocument.CreateCell($"A{index}", person.Ssn), 0);
            row.InsertAt(ExcelDocument.CreateCell($"B{index}", person.Rank.Label), 1);
            row.InsertAt(ExcelDocument.CreateCell($"C{index}", person.LastName), 2);
            row.InsertAt(ExcelDocument.CreateCell($"D{index}", person.FirstName), 3);
            row.InsertAt(ExcelDocument.CreateCell($"E{index}", person.MiddleName), 4);
            row.InsertAt(ExcelDocument.CreateCell($"F{index}", person.Title), 5);
            row.InsertAt(ExcelDocument.CreateCell($"G{index}", person.Organization.Name), 6);
            row.InsertAt(ExcelDocument.CreateCell($"H{index}", person.DodId.ToString()), 7);
            row.InsertAt(ExcelDocument.CreateCell($"I{index}", person.Occupation), 8);

            return row;
        }
    }
}