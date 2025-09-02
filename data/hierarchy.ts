export interface HierarchyPortfolio {
  name: string;
}

export interface HierarchyUnit {
  name: string;
  portfolios: HierarchyPortfolio[];
}

export interface HierarchyBeam {
  name: string;
  units: HierarchyUnit[];
}

export const HIERARCHY_DATA: HierarchyBeam[] = [
  {
    name: "Consumer Digital",
    units: [
      {
        name: "Retail Banking",
        portfolios: [
          { name: "Alpha Core Banking" },
          { name: "Echo Mobile App" },
          { name: "Foxtrot Online Banking" },
        ],
      },
      {
        name: "Wealth Management",
        portfolios: [
          { name: "India Investments Platform" },
          { name: "Juliett Advisory Tools" },
        ],
      },
      {
        name: "Payment Solutions",
        portfolios: [
          { name: "Bravo Payments Gateway" },
          { name: "November Credit Cards" },
        ],
      },
    ],
  },
  {
    name: "Enterprise Technology",
    units: [
      {
        name: "Corporate Systems",
        portfolios: [
            { name: "Charlie CRM" }, 
            { name: "Romeo HR Platform" },
            { name: "Sierra Finance ERP" },
        ],
      },
      {
        name: "Infrastructure & Ops",
        portfolios: [
            { name: "Delta Infrastructure" },
            { name: "Victor Cloud Services" }
        ],
      },
    ],
  },
];
