export interface Role {
  title: string;
  company: string;
  dates: string;
  location: string;
  bullets: string[];
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
      "Enabled dev team with AI-assisted coding tools",
      "Bridged research and development teams",
      "Modernized engineering practices",
    ],
  },
  {
    title: "Staff Data Engineer",
    company: "Buildertrend",
    dates: "Oct 2022 – Dec 2025",
    location: "Omaha, NE",
    bullets: [
      "Led migration from BigQuery/Dataiku to Databricks Lakehouse on GCP",
      "Infrastructure-as-code with OpenTofu + Terragrunt",
      "Unity Catalog, Delta pipelines, MLflow",
    ],
  },
  {
    title: "Data Science Engineer",
    company: "Spreetail",
    dates: "Jun 2021 – Oct 2022",
    location: "Omaha, NE",
    bullets: [
      "End-to-end model development, deployment, and maintenance",
      "Stood up Azure Databricks environments with SOPs",
      "Apache Spark optimization for scalable parallelism",
    ],
  },
  {
    title: "Senior Analytics Developer",
    company: "Nebraska Medicine",
    dates: "Mar 2019 – Jun 2021",
    location: "Omaha, NE",
    bullets: [
      "Built and deployed COVID-19 inpatient forecasting models",
      "Developed community transmission rate calculator",
      "Patient safety and value-driven analytics",
    ],
  },
];

export const skills = {
  core: ["Python", "Databricks", "GCP", "OpenTofu/Terraform", "Docker", "MLflow"],
  supporting: ["Apache Spark", "SQL", "Git", "VS Code", "CI/CD"],
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
