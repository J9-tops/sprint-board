export const ASSIGNEE = { name: "JD", src: "https://github.com/shadcn.png" };

export const STARRED_BOARDS = [
  {
    id: '1',
    title: 'Product Roadmap Q4',
    starred: true,
    background: 'bg-teal-600',
    label: 'ENGINEERING',
  },
  {
    id: '2',
    title: 'Design System V2',
    starred: true,
    background: 'bg-indigo-600',
    label: 'DESIGN',
  },
];

export const ALL_BOARDS = [
  {
    id: '3',
    title: 'Marketing Launch',
    background: 'bg-orange-700',
    label: 'MARKETING',
  },
  {
    id: '4',
    title: 'Home Renovation',
    background: 'bg-slate-800',
    label: 'PERSONAL',
  },
  {
    id: '5',
    title: 'Weekly Meal Prep',
    background: 'bg-slate-800',
    label: 'LIFESTYLE',
  },
  {
    id: '6',
    title: 'Q3 Finance Review',
    background: 'bg-slate-900',
    label: 'FINANCE',
  },
];

export const BOARD_MOCK_DATA = {
  backlog: [
    {
      title: "Implement social login (Google, GitHub)",
      labels: [{ name: 'FEATURE', color: 'bg-emerald-500', type: 'pill' as const }],
      hasDescription: true,
      assignee: ASSIGNEE,
    },
    {
      title: "Competitor analysis for Q3",
      labels: [{ name: 'RESEARCH', color: 'bg-purple-500', type: 'pill' as const }],
      commentCount: 2,
    },
  ],
  inProgress: [
    {
      title: "New dashboard layout concepts",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
      labels: [{ name: 'DESIGN', color: 'bg-blue-500', type: 'pill' as const }],
      dueDate: { text: 'Overdue', status: 'overdue' as const },
      attachmentCount: 3,
      assignee: ASSIGNEE,
    },
    {
      title: "Fix navigation flicker on mobile Safari",
      labels: [
        { name: 'BUG', color: 'bg-red-500', type: 'pill' as const },
        { name: 'HIGH', color: 'bg-orange-500', type: 'pill' as const }
      ],
      dueDate: { text: 'Due Today', status: 'today' as const },
      assignee: ASSIGNEE,
    },
    {
      title: "Update API documentation",
      hasDescription: true,
      assignee: ASSIGNEE,
    },
  ],
  review: [
    {
      title: "Test payment gateway integration in staging",
      labels: [{ name: 'QA', color: 'bg-orange-500', type: 'pill' as const }],
      checklist: { total: 4, completed: 0 },
      assignee: ASSIGNEE,
    },
    {
      title: "Copy review for marketing landing page",
      hasDescription: true,
      assignee: ASSIGNEE,
    },
  ],
  done: [
    { title: 'Server migration to AWS', color: 'border-l-blue-500', label: 'OPS' },
    { title: 'Q2 Analytics Report', color: 'border-l-emerald-500' },
    { title: 'Update Privacy Policy', color: 'border-l-purple-500' },
    { title: 'Client meeting preparation', color: 'border-l-pink-500' },
  ]
};
