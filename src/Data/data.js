// Data Dummy

export const LJK = [
  {
    "id": "ljk-001",
    "name": "BPR/BPRS Dummy 1",
    "type": "BPR",
    "email": "contact1@dummy-ljk.co.id",
    "phone": "08123456001",
    "pengawasId": "user-001",
    "createdAt": "2025-01-06T10:00:00Z"
  },
  {
    "id": "ljk-002",
    "name": "BPR/BPRS Dummy 2",
    "type": "BPR",
    "email": "contact2@dummy-ljk.co.id",
    "phone": "08123456002",
    "pengawasId": "user-001",
    "createdAt": "2025-01-07T10:00:00Z"
  },
  {
    "id": "ljk-003",
    "name": "BPR/BPRS Dummy 3",
    "type": "BPRS",
    "email": "contact3@dummy-ljk.co.id",
    "phone": "08123456003",
    "pengawasId": "user-001",
    "createdAt": "2025-01-08T10:00:00Z"
  },
  {
    "id": "ljk-004",
    "name": "BPR/BPRS Dummy 4",
    "type": "BPR",
    "email": "contact4@dummy-ljk.co.id",
    "phone": "08123456004",
    "pengawasId": "user-001",
    "createdAt": "2025-01-09T10:00:00Z"
  },
  {
    "id": "ljk-005",
    "name": "BPR/BPRS Dummy 5",
    "type": "BPR",
    "email": "contact5@dummy-ljk.co.id",
    "phone": "08123456005",
    "pengawasId": "user-001",
    "createdAt": "2025-01-10T10:00:00Z"
  },
  {
    "id": "ljk-006",
    "name": "BPR/BPRS Dummy 6",
    "type": "BPRS",
    "email": "contact6@dummy-ljk.co.id",
    "phone": "08123456006",
    "pengawasId": "user-001",
    "createdAt": "2025-01-11T10:00:00Z"
  },
  {
    "id": "ljk-007",
    "name": "BPR/BPRS Dummy 7",
    "type": "BPR",
    "email": "contact7@dummy-ljk.co.id",
    "phone": "08123456007",
    "pengawasId": "user-001",
    "createdAt": "2025-01-12T10:00:00Z"
  },
  {
    "id": "ljk-008",
    "name": "BPR/BPRS Dummy 8",
    "type": "BPRS",
    "email": "contact8@dummy-ljk.co.id",
    "phone": "08123456008",
    "pengawasId": "user-001",
    "createdAt": "2025-01-13T10:00:00Z"
  },
  {
    "id": "ljk-009",
    "name": "BPR/BPRS Dummy 9",
    "type": "BPR",
    "email": "contact9@dummy-ljk.co.id",
    "phone": "08123456009",
    "pengawasId": "user-001",
    "createdAt": "2025-01-14T10:00:00Z"
  },
  {
    "id": "ljk-010",
    "name": "BPR/BPRS Dummy 10",
    "type": "BPR",
    "email": "contact10@dummy-ljk.co.id",
    "phone": "08123456010",
    "pengawasId": "user-001",
    "createdAt": "2025-01-15T10:00:00Z"
  }
]

  
  export const TEMPLATES = [
    {
      "id": "temp-001",
      "nama": "Laporan Bulanan",
      "kategori": "BULANAN"
    },
    {
      "id": "temp-002",
      "nama": "Laporan Triwulan Kredit",
      "kategori": "TRIWULAN"
    },
    {
      "id": "temp-003",
      "nama": "Laporan Semester Keuangan",
      "kategori": "SEMESTER"
    },
    {
      "id": "temp-004",
      "nama": "Laporan Tahunan Aset & Kinerja",
      "kategori": "TAHUNAN"
    }
  ]
  

  export const PERIODS = [
    {
      "id": "prd-2025-b01",
      "label": "Januari 2025",
      "tahun": 2025,
      "kategori": "BULANAN",
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-01-31T23:59:59Z"
    },
    {
      "id": "prd-2025-b02",
      "label": "Februari 2025",
      "tahun": 2025,
      "kategori": "BULANAN",
      "startDate": "2025-02-01T00:00:00Z",
      "endDate": "2025-02-28T23:59:59Z"
    },
    {
      "id": "prd-2025-b03",
      "label": "Maret 2025",
      "tahun": 2025,
      "kategori": "BULANAN",
      "startDate": "2025-03-01T00:00:00Z",
      "endDate": "2025-03-31T23:59:59Z"
    },
    {
      "id": "prd-2025-q1",
      "label": "Triwulan 1 2025",
      "tahun": 2025,
      "kategori": "TRIWULAN",
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-03-31T23:59:59Z"
    },
    {
      "id": "prd-2025-s1",
      "label": "Semester 1 2025",
      "tahun": 2025,
      "kategori": "SEMESTER",
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-06-30T23:59:59Z"
    },
    {
      "id": "prd-2025-y",
      "label": "Tahun 2025",
      "tahun": 2025,
      "kategori": "TAHUNAN",
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-12-31T23:59:59Z"
    }
  ]
  

  
  export const REPORTS = [
    {
      id: "lap-001",
      ljkId: "ljk-001",
      templateId: "temp-001",
      periodeId: "prd-2025-b01",
      status: "SUDAH",
      deadline: "2025-02-10T23:59:59Z",
      tanggalSubmit: "2025-02-08T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2025-02-08T10:00:00Z"
    },
    {
      id: "lap-002",
      ljkId: "ljk-001",
      templateId: "temp-001",
      periodeId: "prd-2025-b02",
      status: "BELUM",
      deadline: "2025-03-10T23:59:59Z",
      tanggalSubmit: null,
      catatan: null,
      updatedAt: "2025-03-10T23:59:59Z"
    },
    {
      id: "lap-003",
      ljkId: "ljk-001",
      templateId: "temp-002",
      periodeId: "prd-2025-q1",
      status: "TERLAMBAT",
      deadline: "2025-04-15T23:59:59Z",
      tanggalSubmit: "2025-04-20T10:00:00Z",
      catatan: "Dikirim terlambat. Perlu tindak lanjut.",
      updatedAt: "2025-04-20T10:00:00Z"
    },
    {
      id: "lap-004",
      ljkId: "ljk-002",
      templateId: "temp-001",
      periodeId: "prd-2025-b01",
      status: "BELUM",
      deadline: "2025-02-10T23:59:59Z",
      tanggalSubmit: null,
      catatan: null,
      updatedAt: "2025-02-10T23:59:59Z"
    },
    {
      id: "lap-005",
      ljkId: "ljk-002",
      templateId: "temp-001",
      periodeId: "prd-2025-b02",
      status: "SUDAH",
      deadline: "2025-03-10T23:59:59Z",
      tanggalSubmit: "2025-03-08T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2025-03-08T10:00:00Z"
    },
    {
      id: "lap-006",
      ljkId: "ljk-002",
      templateId: "temp-004",
      periodeId: "prd-2025-y",
      status: "SUDAH",
      deadline: "2026-01-10T23:59:59Z",
      tanggalSubmit: "2026-01-08T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2026-01-08T10:00:00Z"
    },
    {
      id: "lap-007",
      ljkId: "ljk-003",
      templateId: "temp-001",
      periodeId: "prd-2025-b01",
      status: "TERLAMBAT",
      deadline: "2025-02-10T23:59:59Z",
      tanggalSubmit: "2025-02-15T10:00:00Z",
      catatan: "Dikirim terlambat. Perlu tindak lanjut.",
      updatedAt: "2025-02-15T10:00:00Z"
    },
    {
      id: "lap-008",
      ljkId: "ljk-003",
      templateId: "temp-003",
      periodeId: "prd-2025-s1",
      status: "BELUM",
      deadline: "2025-07-10T23:59:59Z",
      tanggalSubmit: null,
      catatan: null,
      updatedAt: "2025-07-10T23:59:59Z"
    },
    {
      id: "lap-009",
      ljkId: "ljk-004",
      templateId: "temp-001",
      periodeId: "prd-2025-b01",
      status: "TIDAK_MENYAMPAIKAN",
      deadline: "2025-02-10T23:59:59Z",
      tanggalSubmit: null,
      catatan: "Belum menyampaikan hingga lewat batas waktu.",
      updatedAt: "2025-02-10T23:59:59Z"
    },
    {
      id: "lap-010",
      ljkId: "ljk-004",
      templateId: "temp-001",
      periodeId: "prd-2025-b02",
      status: "BELUM",
      deadline: "2025-03-10T23:59:59Z",
      tanggalSubmit: null,
      catatan: null,
      updatedAt: "2025-03-10T23:59:59Z"
    },
    {
      id: "lap-011",
      ljkId: "ljk-004",
      templateId: "temp-002",
      periodeId: "prd-2025-q1",
      status: "SUDAH",
      deadline: "2025-04-15T23:59:59Z",
      tanggalSubmit: "2025-04-13T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2025-04-13T10:00:00Z"
    },
    {
      id: "lap-012",
      ljkId: "ljk-005",
      templateId: "temp-001",
      periodeId: "prd-2025-b01",
      status: "SUDAH",
      deadline: "2025-02-10T23:59:59Z",
      tanggalSubmit: "2025-02-08T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2025-02-08T10:00:00Z"
    },
    {
      id: "lap-013",
      ljkId: "ljk-005",
      templateId: "temp-001",
      periodeId: "prd-2025-b02",
      status: "SUDAH",
      deadline: "2025-03-10T23:59:59Z",
      tanggalSubmit: "2025-03-08T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2025-03-08T10:00:00Z"
    },
    {
      id: "lap-014",
      ljkId: "ljk-005",
      templateId: "temp-001",
      periodeId: "prd-2025-b03",
      status: "SUDAH",
      deadline: "2025-04-10T23:59:59Z",
      tanggalSubmit: "2025-04-08T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2025-04-08T10:00:00Z"
    },
    {
      id: "lap-015",
      ljkId: "ljk-006",
      templateId: "temp-001",
      periodeId: "prd-2025-b01",
      status: "BELUM",
      deadline: "2025-02-10T23:59:59Z",
      tanggalSubmit: null,
      catatan: null,
      updatedAt: "2025-02-10T23:59:59Z"
    },
    {
      id: "lap-016",
      ljkId: "ljk-006",
      templateId: "temp-002",
      periodeId: "prd-2025-q1",
      status: "BELUM",
      deadline: "2025-04-15T23:59:59Z",
      tanggalSubmit: null,
      catatan: null,
      updatedAt: "2025-04-15T23:59:59Z"
    },
    {
      id: "lap-017",
      ljkId: "ljk-006",
      templateId: "temp-004",
      periodeId: "prd-2025-y",
      status: "TIDAK_MENYAMPAIKAN",
      deadline: "2026-01-10T23:59:59Z",
      tanggalSubmit: null,
      catatan: "Belum menyampaikan hingga lewat batas waktu.",
      updatedAt: "2026-01-10T23:59:59Z"
    },
    {
      id: "lap-018",
      ljkId: "ljk-007",
      templateId: "temp-001",
      periodeId: "prd-2025-b01",
      status: "SUDAH",
      deadline: "2025-02-10T23:59:59Z",
      tanggalSubmit: "2025-02-08T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2025-02-08T10:00:00Z"
    },
    {
      id: "lap-019",
      ljkId: "ljk-007",
      templateId: "temp-003",
      periodeId: "prd-2025-s1",
      status: "TERLAMBAT",
      deadline: "2025-07-10T23:59:59Z",
      tanggalSubmit: "2025-07-15T10:00:00Z",
      catatan: "Dikirim terlambat. Perlu tindak lanjut.",
      updatedAt: "2025-07-15T10:00:00Z"
    },
    {
      id: "lap-020",
      ljkId: "ljk-008",
      templateId: "temp-001",
      periodeId: "prd-2025-b02",
      status: "BELUM",
      deadline: "2025-03-10T23:59:59Z",
      tanggalSubmit: null,
      catatan: null,
      updatedAt: "2025-03-10T23:59:59Z"
    },
    {
      id: "lap-021",
      ljkId: "ljk-008",
      templateId: "temp-001",
      periodeId: "prd-2025-b03",
      status: "BELUM",
      deadline: "2025-04-10T23:59:59Z",
      tanggalSubmit: null,
      catatan: null,
      updatedAt: "2025-04-10T23:59:59Z"
    },
    {
      id: "lap-022",
      ljkId: "ljk-008",
      templateId: "temp-004",
      periodeId: "prd-2025-y",
      status: "SUDAH",
      deadline: "2026-01-10T23:59:59Z",
      tanggalSubmit: "2026-01-08T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2026-01-08T10:00:00Z"
    },
    {
      id: "lap-023",
      ljkId: "ljk-009",
      templateId: "temp-001",
      periodeId: "prd-2025-b01",
      status: "TERLAMBAT",
      deadline: "2025-02-10T23:59:59Z",
      tanggalSubmit: "2025-02-15T10:00:00Z",
      catatan: "Dikirim terlambat. Perlu tindak lanjut.",
      updatedAt: "2025-02-15T10:00:00Z"
    },
    {
      id: "lap-024",
      ljkId: "ljk-009",
      templateId: "temp-001",
      periodeId: "prd-2025-b02",
      status: "TERLAMBAT",
      deadline: "2025-03-10T23:59:59Z",
      tanggalSubmit: "2025-03-15T10:00:00Z",
      catatan: "Dikirim terlambat. Perlu tindak lanjut.",
      updatedAt: "2025-03-15T10:00:00Z"
    },
    {
      id: "lap-025",
      ljkId: "ljk-010",
      templateId: "temp-001",
      periodeId: "prd-2025-b01",
      status: "BELUM",
      deadline: "2025-02-10T23:59:59Z",
      tanggalSubmit: null,
      catatan: null,
      updatedAt: "2025-02-10T23:59:59Z"
    },
    {
      id: "lap-026",
      ljkId: "ljk-010",
      templateId: "temp-002",
      periodeId: "prd-2025-q1",
      status: "SUDAH",
      deadline: "2025-04-15T23:59:59Z",
      tanggalSubmit: "2025-04-13T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2025-04-13T10:00:00Z"
    },
    {
      id: "lap-027",
      ljkId: "ljk-010",
      templateId: "temp-003",
      periodeId: "prd-2025-s1",
      status: "SUDAH",
      deadline: "2025-07-10T23:59:59Z",
      tanggalSubmit: "2025-07-08T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2025-07-08T10:00:00Z"
    },
    {
      id: "lap-028",
      ljkId: "ljk-003",
      templateId: "temp-002",
      periodeId: "prd-2025-q1",
      status: "SUDAH",
      deadline: "2025-04-15T23:59:59Z",
      tanggalSubmit: "2025-04-13T10:00:00Z",
      catatan: "Sudah dicek. Lengkap.",
      updatedAt: "2025-04-13T10:00:00Z"
    },
    {
      id: "lap-029",
      ljkId: "ljk-008",
      templateId: "temp-002",
      periodeId: "prd-2025-q1",
      status: "TERLAMBAT",
      deadline: "2025-04-15T23:59:59Z",
      tanggalSubmit: "2025-04-20T10:00:00Z",
      catatan: "Dikirim terlambat. Perlu tindak lanjut.",
      updatedAt: "2025-04-20T10:00:00Z"
    },
    {
      id: "lap-030",
      ljkId: "ljk-009",
      templateId: "temp-004",
      periodeId: "prd-2025-y",
      status: "BELUM",
      deadline: "2026-01-10T23:59:59Z",
      tanggalSubmit: null,
      catatan: null,
      updatedAt: "2026-01-10T23:59:59Z"
    }
  ]
  
  