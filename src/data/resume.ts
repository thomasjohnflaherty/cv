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
  tagline: "I build the infrastructure that keeps data teams moving.",
  bio: "13 years building data infrastructure, shipping models, and teaching people to stop emailing spreadsheets. Based in Omaha.",
};

export const roles: Role[] = [
  {
    title: "Senior Data and AI Engineer",
    company: "Contemporary Analysis",
    dates: "Apr 2026 – Present",
    location: "Omaha, NE",
    bullets: [
      "Lead data and AI engineering across concurrent client engagements in insurance, agri-tech, and building-products distribution",
      "Contribute to a Pydantic AI multi-agent FastAPI service on Cloud Run (Claude Sonnet 4.5 via Vertex AI, Arize Phoenix tracing) and the Python SDK wrapping the underlying ERP APIs",
      "Took over an R→Python actuarial rater conversion (binomial + gamma GLMs, Black-Scholes pricing) and scoping a GCP quoting platform for a weather-revenue insurance MGA",
      "Codified the firm's data-engineering archetype: Modal → Delta Lake → dbt (BigQuery + DuckDB) → Cloud SQL/Django",
      "Built the team's codebase-mapping system — a 4-parallel-subagent skill producing canonical architecture/tech/quality/concerns maps per client repo",
    ],
    tech: ["Python", "Pydantic AI", "Claude", "Vertex AI", "FastAPI", "Cloud Run", "GCP", "BigQuery", "Modal", "Delta Lake", "dbt", "DuckDB", "Polars", "Arize Phoenix", "OpenTelemetry", "Django", "Docker"],
  },
  {
    title: "Director of Technology",
    company: "Talent Plus, Inc.",
    dates: "Dec 2025 – Mar 2026",
    location: "Lincoln, NE",
    bullets: [
      "Introduced agentic coding workflows and GenAI tooling to the dev team",
      "Set the strategy for automated testing",
    ],
    tech: ["AWS", "Lambda", "ONNX", "RESTful APIs", "Snowflake", "DuckDB", "MLflow", "Claude", "Python", "CI/CD"],
  },
  {
    title: "Staff Data Engineer",
    company: "Buildertrend",
    dates: "Oct 2022 – Dec 2025",
    location: "Omaha, NE",
    bullets: [
      "Owned 8 Databricks workspaces on GCP",
      "Migrated BigQuery to Databricks, killed a Fivetran bill",
      "Made MLflow the standard for experiment tracking, LLM tracing, and observability",
      "Built document understanding and RAG/vector-search pipelines with Hugging Face vision transformers, OpenAI, DSPy, LangChain, and Databricks Vector Search",
    ],
    tech: ["Databricks", "PyTorch", "Hugging Face", "scikit-learn", "XGBoost", "LightGBM", "LangChain", "DSPy", "PySpark", "Pandas", "Polars", "DuckDB", "BigQuery", "RESTful APIs", "GCP", "Kubernetes", "Cloud Run", "OpenTofu", "Terragrunt", "MLflow", "dbt", "FastAPI", "Docker", "Python"],
  },
  {
    title: "Data Science Engineer",
    company: "Spreetail",
    dates: "Jun 2021 – Oct 2022",
    location: "Omaha, NE",
    bullets: [
      "Built ensemble demand forecasting (Prophet + XGBoost) and dynamic pricing models",
      "First to stand up Databricks at the org, wrote the playbook and set all best practices",
      "Moved from single-machine to distributed PySpark training: 10x faster, 30-40% cheaper",
    ],
    tech: ["Azure", "Databricks", "Prophet", "XGBoost", "scikit-learn", "LightGBM", "RESTful APIs", "PySpark", "Pandas", "NumPy", "H2O.ai", "Python", "Apache Spark"],
  },
  {
    title: "Senior Analytics Developer",
    company: "Nebraska Medicine",
    dates: "Mar 2019 – Jun 2021",
    location: "Omaha, NE",
    bullets: [
      "Built COVID-19 forecasting models used for staffing and ICU bed conversion decisions",
      "Owned all analytics for Clinical Effectiveness: Sepsis, length of stay, oncology, CHF",
    ],
    tech: ["R", "Python", "Posit Connect", "Shiny", "Epic", "SQL", "Tableau"],
  },
  {
    title: "Data Scientist",
    company: "Nebraska Methodist",
    dates: "May 2017 – Mar 2019",
    location: "Omaha, NE",
    bullets: [
      "Built the data science function from scratch, all open-source, zero vendor spend",
      "Developed opioid prescribing analysis and dashboards that led to a decrease in provider overprescribing",
    ],
    tech: ["R", "Python", "Shiny", "Posit Connect", "Cerner", "SQL"],
  },
];

export const expertise = [
  "Data Science",
  "Machine Learning",
  "MLOps / LLMOps",
  "Data Engineering",
  "Technology Leadership",
  "Cloud Infrastructure",
  "Platform Engineering",
  "Agentic Development",
  "Healthcare Analytics",
];

export const skills = {
  tools: ["PyTorch", "Hugging Face", "scikit-learn", "XGBoost", "LightGBM", "Prophet", "ONNX", "LangChain", "DSPy", "MLflow", "Pandas", "NumPy", "Polars", "PySpark", "Apache Spark", "DuckDB", "dbt", "SQL", "BigQuery", "Snowflake", "GCP", "AWS", "Lambda", "Azure", "Kubernetes", "Cloud Run", "OpenTofu", "Terragrunt", "Docker", "CI/CD", "Git", "Python", "React", "TypeScript", "FastAPI", "RESTful APIs"],
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
