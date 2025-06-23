<template>
  <div>
    <button @click="generateDocument">生成带表格的 Word 文档</button>
  </div>
</template>

<script setup>
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, Packer } from 'docx';

const generateDocument = async () => {
  const tables = [];

  for (let i = 1; i <= 3; i++) {
    tables.push(
        new Paragraph({
          children: [new TextRun({ text: `第 ${i} 个表格`, bold: true, size: 28 })],
          spacing: { after: 200 },
          pageBreakBefore: i !== 1, // 第二个和后续的表格从新页开始
        }),

        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "姓名", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "年龄", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "职业", bold: true })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("张三")] }),
                new TableCell({ children: [new Paragraph("28")] }),
                new TableCell({
                  children: [
                    new Paragraph(""),
                    new Table({
                      rows: [
                        new TableRow({
                          children: [
                            new TableCell({ children: [new Paragraph("内表1")] }),
                            new TableCell({ children: [new Paragraph("内表2")] }),
                          ],
                        }),
                      ],
                      width: { size: "100%", type: "pct" },
                      borders: {
                        top: { style: "single", size: 2, color: "999999" },
                        bottom: { style: "single", size: 2, color: "999999" },
                        left: { style: "single", size: 2, color: "999999" },
                        right: { style: "single", size: 2, color: "999999" },
                        insideHorizontal: { style: "single", size: 1, color: "999999" },
                        insideVertical: { style: "single", size: 1, color: "999999" },
                      },
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("李四")] }),
                new TableCell({ children: [new Paragraph("35")] }),
                new TableCell({ children: [new Paragraph("产品经理")] }),
              ],
            }),
          ],
          width: { size: "100%", type: "pct" },
          borders: {
            top: { style: "single", size: 4, color: "000000" },
            bottom: { style: "single", size: 4, color: "000000" },
            left: { style: "single", size: 4, color: "000000" },
            right: { style: "single", size: 4, color: "000000" },
            insideHorizontal: { style: "single", size: 2, color: "000000" },
            insideVertical: { style: "single", size: 2, color: "000000" },
          },
        }),

        new Paragraph({
          children: [new TextRun({ text: "这是表格下方的文字说明" })],
          spacing: { before: 200 },
        })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: tables,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "分页表格文档.docx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


</script>

<style scoped>
button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px;
}

button:hover {
  background-color: #45a049;
}
</style>