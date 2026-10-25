
export const initialSupportTickets = [
  {
    id: "TKT-1004",
    subject: "Trip report amount discrepancy",
    category: "Trip Reports",
    priority: "High",
    status: "In Progress",
    createdAt: "14 Oct 2026",
    updatedAt: "15 Oct 2026",
    description:
      "The amount displayed in a completed trip report does not match the expected trip total.",
    messages: [
      {
        id: "MSG-1001",
        sender: "Partner",
        message:
          "Please review the total amount shown in the completed trip report.",
        createdAt: "14 Oct 2026, 10:30 AM",
      },
      {
        id: "MSG-1002",
        sender: "HireD Support",
        message:
          "We've received your request and are reviewing the reported discrepancy.",
        createdAt: "15 Oct 2026, 9:15 AM",
      },
    ],
  },
  {
    id: "TKT-1003",
    subject: "September statement clarification",
    category: "Invoices & Statements",
    priority: "Normal",
    status: "Resolved",
    createdAt: "08 Oct 2026",
    updatedAt: "10 Oct 2026",
    description:
      "Clarification requested about the company share shown in the September statement.",
    messages: [
      {
        id: "MSG-1003",
        sender: "Partner",
        message:
          "Could you clarify the company share shown in the September statement?",
        createdAt: "08 Oct 2026, 11:00 AM",
      },
      {
        id: "MSG-1004",
        sender: "HireD Support",
        message:
          "The statement breakdown is available in the statement details. Please review the company share and trip totals there.",
        createdAt: "10 Oct 2026, 2:20 PM",
      },
    ],
  },
  {
    id: "TKT-1002",
    subject: "Unable to locate an order",
    category: "Orders",
    priority: "Normal",
    status: "Open",
    createdAt: "05 Oct 2026",
    updatedAt: "05 Oct 2026",
    description:
      "An order submitted earlier is not appearing in the expected list.",
    messages: [
      {
        id: "MSG-1005",
        sender: "Partner",
        message:
          "I cannot find an order I submitted earlier. Please help me verify its status.",
        createdAt: "05 Oct 2026, 4:45 PM",
      },
    ],
  },
];

export const supportCategories = [
  "Orders",
  "Trips",
  "Trip Reports",
  "Invoices & Statements",
  "Account & Profile",
  "Technical Issue",
  "Other",
];

export const supportPriorities = ["Low", "Normal", "High", "Urgent"];
