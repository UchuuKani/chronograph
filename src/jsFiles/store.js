const store = {
  document: {
    8: { id: 8, report_id: 4, name: "Sample Document", filetype: "txt" },
    34: { id: 34, report_id: 21, name: "Quarterly Report", filetype: "pdf" },
    87: { id: 87, report_id: 21, name: "Performance Summary", filetype: "pdf" },
  },
  page: {
    19: { id: 19, document_id: 34, body: "Lorem ipsum...", footnote: null },
    72: {
      id: 72,
      document_id: 87,
      body: "Ut aliquet...",
      footnote: "Aliquam erat...",
    },
    205: {
      id: 205,
      document_id: 34,
      body: "Donec a dui et...",
      footnote: null,
    },
  },
  report: {
    4: { id: 4, title: "Sample Report" },
    21: { id: 21, title: "Portfolio Summary 2020" },
  },
};

module.exports = store;
