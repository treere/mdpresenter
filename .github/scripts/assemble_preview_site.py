#!/usr/bin/env python3
"""Assemble the published site: main build at the root, one folder per open PR.

The site is a single GitHub Pages deployment, so every PR preview has to live
inside the same artifact. This script only moves files around: it never runs
code coming from the pull requests.

    python3 .github/scripts/assemble_preview_site.py \
        --site site --previews previews --prs prs.json
"""

from __future__ import annotations

import argparse
import html
import json
import shutil
from pathlib import Path

INDEX_TEMPLATE = """<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Preview delle PR — mdpresenter</title>
<style>
  :root {{ color-scheme: light dark; }}
  body {{
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    margin: 0 auto; max-width: 46rem; padding: 2rem 1.25rem 4rem; line-height: 1.5;
  }}
  h1 {{ font-size: 1.4rem; margin: 0 0 .25rem; }}
  p.lead {{ margin: 0 0 2rem; opacity: .7; }}
  ul {{ list-style: none; padding: 0; margin: 0; }}
  li {{ border-top: 1px solid color-mix(in srgb, currentColor 18%, transparent); padding: .9rem 0; }}
  a.title {{ font-weight: 600; text-decoration: none; }}
  a.title:hover {{ text-decoration: underline; }}
  .meta {{ display: block; font-size: .85rem; opacity: .7; margin-top: .2rem; }}
  .draft {{ font-size: .75rem; border: 1px solid currentColor; border-radius: .4rem;
            padding: 0 .35rem; margin-left: .4rem; opacity: .8; }}
  .empty {{ opacity: .7; }}
  footer {{ margin-top: 3rem; font-size: .85rem; opacity: .7; }}
</style>
</head>
<body>
<h1>Preview delle PR</h1>
<p class="lead">Build di ogni pull request aperta, prima del merge.
Non è la produzione: la versione vera è <a href="../">qui</a>.</p>
{body}
<footer>Cartelle rigenerate a ogni evento sulle PR; dopo un merge su main
la produzione ripubblica il sito e questi preview spariscono fino al prossimo aggiornamento.</footer>
</body>
</html>
"""


def render_index(pull_requests: list[dict]) -> str:
    if not pull_requests:
        body = '<p class="empty">Nessuna pull request aperta.</p>'
    else:
        items = []
        for pr in pull_requests:
            number = pr["number"]
            title = html.escape(str(pr.get("title", "")).strip() or f"PR #{number}")
            author = html.escape(str((pr.get("author") or {}).get("login", "")))
            branch = html.escape(str(pr.get("headRefName", "")))
            draft = '<span class="draft">bozza</span>' if pr.get("isDraft") else ""
            meta = " · ".join(part for part in (author, branch) if part)
            items.append(
                '  <li>\n'
                f'    <a class="title" href="pr-{number}/">#{number} — {title}</a>{draft}\n'
                f'    <span class="meta">{meta}</span>\n'
                "  </li>"
            )
        body = "<ul>\n" + "\n".join(items) + "\n</ul>"
    return INDEX_TEMPLATE.format(body=body)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", required=True, help="directory with the main build")
    parser.add_argument("--previews", default="previews", help="artifact directories preview-<n>")
    parser.add_argument("--prs", default="prs.json", help="gh pr list output")
    args = parser.parse_args()

    site = Path(args.site)
    previews = Path(args.previews)
    prs_file = Path(args.prs)
    if not site.is_dir():
        raise SystemExit(f"missing main build: {site}")

    pull_requests = json.loads(prs_file.read_text(encoding="utf-8")) if prs_file.is_file() else []
    published = []
    for pr in sorted(pull_requests, key=lambda item: item["number"]):
        source = previews / f"preview-{pr['number']}"
        if not source.is_dir():
            print(f"skip PR #{pr['number']}: no build")
            continue
        target = site / "preview" / f"pr-{pr['number']}"
        shutil.copytree(source, target, dirs_exist_ok=True)
        published.append(pr)

    index = site / "preview" / "index.html"
    index.parent.mkdir(parents=True, exist_ok=True)
    index.write_text(render_index(published), encoding="utf-8")
    print(f"published {len(published)} pull request preview(s) under {index.parent}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
