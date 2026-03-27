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
      "Brought Claude into the dev workflow. Turns out AI pair programming is a hard sell until it isn't",
      "Defined the strategy for reusable automated testing across all repos and guided the team on execution",
      "Played translator between the research PhDs and the engineers who had to build their ideas",
    ],
    tech: ["AWS", "Snowflake", "Claude", "Python", "CI/CD"],
  },
  {
    title: "Staff Data Engineer",
    company: "Buildertrend",
    dates: "Oct 2022 – Dec 2025",
    location: "Omaha, NE",
    bullets: [
      "Ran 8 Databricks workspaces on GCP. All the infra, all the pipelines, all mine",
      "Migrated an entire data warehouse from BigQuery to Databricks and killed a Fivetran bill along the way",
      "Taught data scientists and devs how to actually use MLflow instead of just saying they would",
    ],
    tech: ["Databricks", "GCP", "OpenTofu", "Terragrunt", "MLflow", "dbt", "Docker", "Python"],
  },
  {
    title: "Data Science Engineer",
    company: "Spreetail",
    dates: "Jun 2021 – Oct 2022",
    location: "Omaha, NE",
    bullets: [
      "Built the demand forecasting and pricing models that people actually made decisions with",
      "Wrote the Databricks playbook. If you used Databricks at Spreetail, you followed my docs, used my notebooks and were beholden to my cluster policies",
      "Made models run 10x faster and cost 30-40% less by switching to Spark-native algorithms",
    ],
    tech: ["Azure", "Databricks", "PySpark", "H2O.ai", "Python", "Apache Spark"],
  },
  {
    title: "Senior Analytics Developer",
    company: "Nebraska Medicine",
    dates: "Mar 2019 – Jun 2021",
    location: "Omaha, NE",
    bullets: [
      "Built the COVID-19 forecasting models that hospital leadership used to make real decisions during a pandemic",
      "Gave the org its first real analytics platform. RStudio Connect replaced a lot of \"email me the spreadsheet\" workflows",
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
