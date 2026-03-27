export interface Role {
  title: string;
  company: string;
  dates: string;
  location: string;
  bullets: string[];
  tech?: string[];
}

export interface Education {
  degree: string;
  school: string;
  note?: string;
}

export const hero = {
  name: "Thom Flaherty",
  tagline: "Data & AI Infrastructure Leader",
  bio: "13+ years building data systems, deploying ML at scale, and enabling engineering teams. Background in visual design, based in Omaha, NE.",
};

export const roles: Role[] = [
  {
    title: "Director of Technology",
    company: "Talent Plus, Inc.",
    dates: "Dec 2025 – Mar 2026",
    location: "Lincoln, NE",
    bullets: [
      "Introduced AI-assisted coding tools (Claude) to the development team",
      "Led initiative for reusable automated testing frameworks across all repositories",
      "Bridged research and engineering teams to accelerate product development",
    ],
    tech: ["AWS", "Snowflake", "Claude", "Python", "CI/CD"],
  },
  {
    title: "Staff Data Engineer",
    company: "Buildertrend",
    dates: "Oct 2022 – Dec 2025",
    location: "Omaha, NE",
    bullets: [
      "Owned all Databricks infrastructure on GCP — 8 workspaces managed via OpenTofu + Terragrunt",
      "Led migration from BigQuery/dbt data warehouse to Databricks Lakehouse, including custom SQL Server replication that eliminated Fivetran costs",
      "Standardized MLflow usage patterns across data science and dev teams; mentored engineers in MLOps practices",
      "Unity Catalog governance, Delta pipelines, and end-to-end data platform ownership",
    ],
    tech: ["Databricks", "GCP", "OpenTofu", "Terragrunt", "MLflow", "dbt", "Docker", "Python"],
  },
  {
    title: "Data Science Engineer",
    company: "Spreetail",
    dates: "Jun 2021 – Oct 2022",
    location: "Omaha, NE",
    bullets: [
      "Built demand forecasting and pricing models in close collaboration with business stakeholders",
      "Authored the organization's Databricks standards and operating procedures",
      "Optimized model training and inference via Spark-native H2O.ai algorithms — 10x speed improvement, 30-40% cost reduction",
    ],
    tech: ["Azure Databricks", "PySpark", "H2O.ai", "Python", "Apache Spark"],
  },
  {
    title: "Senior Analytics Developer",
    company: "Nebraska Medicine",
    dates: "Mar 2019 – Jun 2021",
    location: "Omaha, NE",
    bullets: [
      "Built and deployed COVID-19 inpatient forecasting models used by hospital leadership during the pandemic",
      "Developed internal community transmission rate calculator for clinical decision-making",
      "Stood up RStudio Connect as the org's first programmatic analytics platform, expanding capabilities beyond Tableau",
    ],
    tech: ["R", "RStudio Connect", "Shiny", "SQL", "Tableau"],
  },
];

export const skills = {
  core: ["Python", "Databricks", "GCP", "AWS", "Azure", "OpenTofu/Terraform", "Docker", "MLflow"],
  supporting: ["Apache Spark", "dbt", "Snowflake", "SQL", "Git", "CI/CD"],
};

export const education: Education[] = [
  {
    degree: "M.S. Mathematics, Data Science",
    school: "University of Nebraska Omaha",
    note: "Thesis: Tools to Combat the Opioid Crisis",
  },
  {
    degree: "B.S. Mathematics",
    school: "University of Nebraska Omaha",
  },
];

export const teaching = {
  role: "Python 101 Instructor",
  org: "Omaha Data Science Academy (Contemporary Analysis)",
};
