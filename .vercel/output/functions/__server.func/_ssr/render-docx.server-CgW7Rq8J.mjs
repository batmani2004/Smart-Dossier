import { a as Packer, c as ShadingType, d as TableRow, f as TextRun, i as HeadingLevel, l as Table, n as BorderStyle, o as PageOrientation, p as WidthType, r as File, s as Paragraph, t as AlignmentType, u as TableCell } from "../_libs/docx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/render-docx.server-CgW7Rq8J.js
function fmtDate(iso) {
	const d = new Date(iso);
	return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}
function para(text, opts = {}) {
	return new Paragraph({
		alignment: opts.align,
		children: [new TextRun({
			text,
			bold: opts.bold,
			size: opts.size ?? 22
		})]
	});
}
function heading(text) {
	return new Paragraph({
		heading: HeadingLevel.HEADING_2,
		spacing: {
			before: 200,
			after: 120
		},
		children: [new TextRun({
			text,
			bold: true,
			size: 24
		})]
	});
}
function buildTable(columns, rows) {
	const cellBorder = {
		style: BorderStyle.SINGLE,
		size: 4,
		color: "999999"
	};
	const cellBorders = {
		top: cellBorder,
		bottom: cellBorder,
		left: cellBorder,
		right: cellBorder
	};
	const colCount = columns.length;
	const tableWidth = 9e3;
	const colWidth = Math.floor(tableWidth / colCount);
	const columnWidths = Array.from({ length: colCount }, () => colWidth);
	const headerRow = new TableRow({ children: columns.map((c) => new TableCell({
		borders: cellBorders,
		width: {
			size: colWidth,
			type: WidthType.DXA
		},
		shading: {
			fill: "EEEEEE",
			type: ShadingType.CLEAR,
			color: "auto"
		},
		margins: {
			top: 80,
			bottom: 80,
			left: 120,
			right: 120
		},
		children: [new Paragraph({ children: [new TextRun({
			text: c,
			bold: true,
			size: 20
		})] })]
	})) });
	const bodyRows = rows.map((row) => new TableRow({ children: row.map((cell) => new TableCell({
		borders: cellBorders,
		width: {
			size: colWidth,
			type: WidthType.DXA
		},
		margins: {
			top: 80,
			bottom: 80,
			left: 120,
			right: 120
		},
		children: [new Paragraph({ children: [new TextRun({
			text: String(cell),
			size: 20
		})] })]
	})) }));
	return new Table({
		width: {
			size: tableWidth,
			type: WidthType.DXA
		},
		columnWidths,
		rows: [headerRow, ...bodyRows]
	});
}
async function renderDocxBuffer(doc) {
	const children = [];
	children.push(new Paragraph({
		alignment: AlignmentType.CENTER,
		children: [new TextRun({
			text: doc.institution.toUpperCase(),
			bold: true,
			size: 26
		})]
	}), new Paragraph({
		alignment: AlignmentType.CENTER,
		spacing: { after: 200 },
		children: [new TextRun({
			text: "Republika e Shqipërisë",
			size: 20
		})]
	}), new Paragraph({ children: [new TextRun({
		text: `Nr. prot.: ${doc.number}`,
		bold: true,
		size: 22
	}), new TextRun({
		text: `    Data: ${fmtDate(doc.date)}`,
		size: 22
	})] }), new Paragraph({
		alignment: AlignmentType.CENTER,
		spacing: {
			before: 240,
			after: 200
		},
		children: [new TextRun({
			text: doc.title.toUpperCase(),
			bold: true,
			size: 28
		})]
	}), para(`Drejtuar: ${doc.addressee}${doc.addresseeAddress ? `, ${doc.addresseeAddress}` : ""}`, { bold: true }), para(`Pasuria: ${doc.propertyLines.join(" · ")}`), new Paragraph({
		children: [new TextRun({ text: "" })],
		spacing: { after: 120 }
	}));
	for (const s of doc.sections) {
		if (s.heading) children.push(heading(s.heading));
		for (const p of s.paragraphs) children.push(para(p));
	}
	if (doc.table) {
		if (doc.table.heading) children.push(heading(doc.table.heading));
		children.push(buildTable(doc.table.columns, doc.table.rows));
		children.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
	}
	if (doc.deadlineLine) children.push(new Paragraph({
		spacing: {
			before: 240,
			after: 240
		},
		shading: {
			fill: "FEF3C7",
			type: ShadingType.CLEAR,
			color: "auto"
		},
		children: [new TextRun({
			text: `⚠ ${doc.deadlineLine}`,
			bold: true,
			size: 22
		})]
	}));
	children.push(heading("Bazë ligjore"));
	for (const l of doc.legalBasis) children.push(para(`• ${l}`));
	children.push(new Paragraph({
		children: [new TextRun({ text: "" })],
		spacing: { before: 400 }
	}));
	if (doc.signatures.length > 0) {
		const colWidth = Math.floor(9e3 / doc.signatures.length);
		const sigRow = new TableRow({ children: doc.signatures.map((sig) => new TableCell({
			borders: {
				top: {
					style: BorderStyle.SINGLE,
					size: 6,
					color: "111111"
				},
				bottom: {
					style: BorderStyle.NONE,
					size: 0,
					color: "auto"
				},
				left: {
					style: BorderStyle.NONE,
					size: 0,
					color: "auto"
				},
				right: {
					style: BorderStyle.NONE,
					size: 0,
					color: "auto"
				}
			},
			width: {
				size: colWidth,
				type: WidthType.DXA
			},
			margins: {
				top: 120,
				bottom: 80,
				left: 120,
				right: 120
			},
			children: [new Paragraph({
				alignment: AlignmentType.CENTER,
				children: [new TextRun({
					text: sig.role,
					bold: true,
					size: 20
				})]
			}), new Paragraph({
				alignment: AlignmentType.CENTER,
				children: [new TextRun({
					text: sig.institution,
					size: 20
				})]
			})]
		})) });
		children.push(new Table({
			width: {
				size: 9e3,
				type: WidthType.DXA
			},
			columnWidths: doc.signatures.map(() => colWidth),
			rows: [sigRow]
		}));
	}
	if (doc.footer) children.push(new Paragraph({
		spacing: { before: 400 },
		children: [new TextRun({
			text: doc.footer,
			italics: true,
			size: 18,
			color: "6B7280"
		})]
	}));
	const document = new File({
		styles: { default: { document: { run: {
			font: "Times New Roman",
			size: 22
		} } } },
		sections: [{
			properties: { page: {
				size: {
					width: 11906,
					height: 16838,
					orientation: PageOrientation.PORTRAIT
				},
				margin: {
					top: 1134,
					right: 1134,
					bottom: 1134,
					left: 1134
				}
			} },
			children
		}]
	});
	return Packer.toBuffer(document);
}
//#endregion
export { renderDocxBuffer };
