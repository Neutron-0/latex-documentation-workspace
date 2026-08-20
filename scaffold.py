import os
import shutil

chapters = [
    "01-executive-overview",
    "02-project-ecosystem",
    "03-system-architecture",
    "04-deployment-infrastructure",
    "05-network-trust-architecture",
    "06-synthetic-platforms",
    "07-data-models",
    "08-database-architecture",
    "09-eventing-pipeline",
    "10-entity-resolution",
    "11-graph-projection",
    "12-rag-llm",
    "13-wolverinedb-architecture",
    "14-wolverinedb-cryptography",
    "15-wolverinedb-consensus",
    "16-wolverinedb-security",
    "17-api-architecture",
    "18-vzeya-frontend",
    "19-analyst-ui",
    "20-evaluation-methodology",
    "21-engineering-history",
    "22-limitations",
    "23-conclusion"
]

appendices = [
    "A-synthetic-lexicons",
    "B-prisma-dictionaries",
    "C-wdb-specifications",
    "D-source-code-excerpts"
]

# Create backup of old chapters just in case
if not os.path.exists("d:/Vault/Pro-doc/manuscript/old_chapters"):
    os.makedirs("d:/Vault/Pro-doc/manuscript/old_chapters")
    for f in os.listdir("d:/Vault/Pro-doc/manuscript/chapters"):
        if f.endswith(".tex"):
            shutil.move(os.path.join("d:/Vault/Pro-doc/manuscript/chapters", f), "d:/Vault/Pro-doc/manuscript/old_chapters/" + f)
if not os.path.exists("d:/Vault/Pro-doc/manuscript/old_appendices"):
    os.makedirs("d:/Vault/Pro-doc/manuscript/old_appendices")
    for f in os.listdir("d:/Vault/Pro-doc/manuscript/appendices"):
        if f.endswith(".tex"):
            shutil.move(os.path.join("d:/Vault/Pro-doc/manuscript/appendices", f), "d:/Vault/Pro-doc/manuscript/old_appendices/" + f)

# Scaffold new chapters
for ch in chapters:
    with open(f"d:/Vault/Pro-doc/manuscript/chapters/{ch}.tex", "w", encoding="utf-8") as f:
        title = ch.split("-", 1)[1].replace("-", " ").title()
        f.write(f"\\chapter{{{title}}}\n\n% TODO: Write this chapter\n")

# Scaffold new appendices
for app in appendices:
    with open(f"d:/Vault/Pro-doc/manuscript/appendices/{app}.tex", "w", encoding="utf-8") as f:
        title = app.split("-", 1)[1].replace("-", " ").title()
        f.write(f"\\chapter{{{title}}}\n\n% TODO: Write this appendix\n")

print("Scaffolding complete.")
