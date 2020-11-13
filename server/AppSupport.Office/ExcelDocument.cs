using System.Collections.Generic;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;

namespace AppSupport.Office
{
    public class ExcelDocument
    {
        /* Properties */
        UInt32Value sheetId = 0;

        public SpreadsheetDocument Document { get; set; }
        public WorkbookPart Workbook { get; set; }
        public WorkbookStylesPart Styles { get; set; }
        public Sheets Sheets { get; set; }

        public ExcelDocument(string path)
        {
            Document = CreateDocument(path);
            Workbook = ConfigureWorkbook(Document);
            Sheets = ConfigureSheets(Document);
            Styles = ConfigureStyles(Workbook);
        }

        /* Methods */

        public WorksheetPart CreateWorksheet(WorkbookPart workbook)
        {
            var worksheet = workbook.AddNewPart<WorksheetPart>();
            worksheet.Worksheet = new Worksheet();

            FreezeTopRow(worksheet);
            ConfigureColumns(worksheet, 1, 9, 20);

            /* THIS MUST BE LAST */
            worksheet.Worksheet.AppendChild(new SheetData());

            return worksheet;
        }

        public Sheet CreateSheet(WorksheetPart worksheet, string name)
        {
            var sheet = CreateSheet(Document, worksheet, Sheets, ++sheetId, name);
            return sheet;
        }

        public void SaveAndClose()
        {
            Workbook.Workbook.Save();
            Document.Close();
        }

        public static SpreadsheetDocument CreateDocument(string path) =>
            SpreadsheetDocument.Create(path, SpreadsheetDocumentType.Workbook);

        public static WorkbookPart ConfigureWorkbook(SpreadsheetDocument document)
        {
            var workbook = document.AddWorkbookPart();
            workbook.Workbook = new Workbook();

            return workbook;
        }

        public static Sheets ConfigureSheets(SpreadsheetDocument document) =>
            document
                .WorkbookPart
                .Workbook
                .AppendChild<Sheets>(new Sheets());

        public static Sheet CreateSheet(SpreadsheetDocument document, WorksheetPart worksheet, Sheets sheets, UInt32Value sheetId, string name)
        {
            var sheet = new Sheet()
            {
                Id = document.WorkbookPart.GetIdOfPart(worksheet),
                SheetId = sheetId,
                Name = name
            };

            sheets.Append(sheet);

            return sheet;
        }

        public static Cell CreateCell(string cellDef, string value, bool isHeader = false, CellValues type = CellValues.String) => new Cell()
        {
            CellReference = cellDef,
            CellValue = new CellValue(value),
            DataType = new EnumValue<CellValues>(type),
            // STYLES MUST BE APPLIED TO CELLS
            StyleIndex = isHeader ? 1U : 0U
        };

        public static void FreezeTopRow(WorksheetPart worksheet)
        {
            // MUST BE COMPOSED IN THIS WAY! CANNOT COMPOSE AS CONSTRUCTOR ARGUMENTS

            var sheetViews = new SheetViews();
            var sheetView = new SheetView()
            {
                TabSelected = true,
                WorkbookViewId = (UInt32Value)0U
            };
            var pane = new Pane
            {
                ActivePane = PaneValues.BottomLeft,
                State = PaneStateValues.Frozen,
                TopLeftCell = "A2",
                VerticalSplit = 1D
            };
            var selection = new Selection()
            {
                Pane = PaneValues.BottomLeft
            };

            sheetView.Append(pane);
            sheetView.Append(selection);
            sheetViews.Append(sheetView);
            worksheet.Worksheet.Append(sheetViews);
        }

        public static void ConfigureColumns(WorksheetPart worksheet, uint min, uint max, uint width)
        {
            var columns = new Columns(
                new Column()
                {
                    // ALL OF THESE FIELDS ARE REQUIRED
                    Min = min,
                    Max = max,
                    Width = width,
                    CustomWidth = true,
                    // DO NOT SET BestFit
                }
            );

            worksheet.Worksheet.Append(columns);
        }

        public static void ConfigureAutoFilter(WorksheetPart worksheet, string reference)
        {
            var autoFilter = new AutoFilter()
            {
                Reference = reference
            };

            worksheet.Worksheet.Append(autoFilter);
        }

        public static WorkbookStylesPart ConfigureStyles(WorkbookPart workbook)
        {
            var styles = workbook.AddNewPart<WorkbookStylesPart>();

            styles.Stylesheet = new Stylesheet(
                new Fonts(
                    new Font(
                        new FontSize() { Val = 12D },
                        new FontName() { Val = "Consolas" }
                    ),
                    new Font(
                        new FontSize() { Val = 14D },
                        new FontName() { Val = "Consolas" },
                        new Bold()
                    )
                ),
                new Fills(
                    new Fill(
                        new PatternFill() { PatternType = PatternValues.None }
                    ),
                    // THIS FILL DEFINITION IS MANDATORY FOR SOME FUCKING REASON
                    new Fill(
                        new PatternFill() { PatternType = PatternValues.Gray125 }
                    ),
                    new Fill(
                        new PatternFill(
                            new ForegroundColor() { Rgb = new HexBinaryValue() { Value = "ffff7979" }}
                        ) { PatternType = PatternValues.Solid }
                    )
                ),
                new Borders(
                    new Border(
                        new LeftBorder(),
                        new RightBorder(),
                        new TopBorder(),
                        new BottomBorder(),
                        new DiagonalBorder()
                    )
                ),
                new CellFormats(
                    new CellFormat() { FontId = 0, FillId = 0, BorderId = 0 },
                    new CellFormat()
                    {
                        FontId = 1,
                        FillId = 2,
                        BorderId = 0,
                        ApplyFill = true,
                        Alignment = new Alignment()
                        {
                            Horizontal = HorizontalAlignmentValues.Center,
                            Vertical = VerticalAlignmentValues.Center
                        }
                    }
                )
            );

            return styles;
        }
    }
}