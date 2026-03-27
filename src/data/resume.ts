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
  tagline: "I build the infrastructure that data teams run on.",
  bio: "13 years of Databricks workspaces, ML pipelines, and teaching people to stop emailing spreadsheets. Based in Omaha.",
};

export const roles: Role[] = [
  {
    title: "Director of Technology",
    company: "Talent Plus, Inc.",
    dates: "Dec 2025 – Mar 2026",
    location: "Lincoln, NE",
    bullets: [
      "Got the dev team coding with Claude",
      "Set the strategy for automated testing",
      "Translated between research and engineering",
    ],
    tech: ["AWS", "Snowflake", "Claude", "Python", "CI/CD"],
  },
  {
    title: "Staff Data Engineer",
    company: "Buildertrend",
    dates: "Oct 2022 – Dec 2025",
    location: "Omaha, NE",
    bullets: [
      "Owned 8 Databricks workspaces on GCP",
      "Migrated BigQuery to Databricks, killed a Fivetran bill",
      "Got teams to actually use MLflow",
    ],
    tech: ["Databricks", "GCP", "OpenTofu", "Terragrunt", "MLflow", "dbt", "Docker", "Python"],
  },
  {
    title: "Data Science Engineer",
    company: "Spreetail",
    dates: "Jun 2021 – Oct 2022",
    location: "Omaha, NE",
    bullets: [
      "Built demand forecasting and pricing models",
      "Wrote the org's Databricks playbook",
      "10x faster models, 30-40% cheaper",
    ],
    tech: ["Azure", "Databricks", "PySpark", "H2O.ai", "Python", "Apache Spark"],
  },
  {
    title: "Senior Analytics Developer",
    company: "Nebraska Medicine",
    dates: "Mar 2019 – Jun 2021",
    location: "Omaha, NE",
    bullets: [
      "Built COVID-19 forecasting models for hospital leadership",
      "Stood up RStudio Connect, killed the spreadsheet emails",
    ],
    tech: ["R", "RStudio Connect", "Shiny", "SQL", "Tableau"],
  },
];

export const expertise = [
  "Data Science",
  "Machine Learning / MLOps",
  "Data Engineering",
  "Technology Leadership",
  "Cloud Infrastructure",
  "Platform Engineering",
  "Agentic Development",
  "Healthcare Analytics",
];

export const skills = {
  tools: ["Python", "Databricks", "GCP", "AWS", "Azure", "OpenTofu/Terraform", "Docker", "MLflow", "Apache Spark", "dbt", "Snowflake", "SQL", "Git", "CI/CD"],
  strengths: [
    "Teaching & Mentorship",
    "Cross-Team Translation",
    "Standards & Governance",
    "Building from Zero",
    "Open Source Tooling",
  ],
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
