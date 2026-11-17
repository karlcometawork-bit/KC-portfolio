"""Build only site-linked files. Never publish the repository wholesale."""
from pathlib import Path
from html.parser import HTMLParser
import shutil, json, os
ROOT = Path(__file__).resolve().parents[1]
class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.files = set(); self.ids = set(); self.anchors = set()
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            assert a["id"] not in self.ids, "Duplicate id: " + a["id"]
            self.ids.add(a["id"])
        for key in ("src", "href", "poster", "data-img"):
            value = a.get(key, "")
            if value.startswith("#"): self.anchors.add(value[1:])
            elif value and not value.startswith(("https:", "http:", "mailto:", "data:")):
                assert ".." not in value and not value.startswith("/"), value
                self.files.add(value)
p = Links(); p.feed((ROOT / "index.html").read_text())
assert p.anchors <= p.ids, "Broken anchors: " + str(p.anchors - p.ids)
out = ROOT / "_site"
if out.exists(): shutil.rmtree(out)
out.mkdir()
for name in sorted(p.files | {"index.html", "robots.txt", "sitemap.xml"}):
    source = ROOT / name
    assert source.is_file(), "Missing asset: " + name
    assert source.suffix.lower() in {".html", ".css", ".js", ".webp", ".pdf", ".xml", ".txt"}, name
    shutil.copy2(source, out / name)
assert (out / "Karl_Cometa_CV.pdf").read_bytes().startswith(b"%PDF-"), "Invalid CV"
(out / ".nojekyll").touch()
(out / "version.json").write_text(json.dumps({"commit": os.getenv("GITHUB_SHA", "local"), "version": "portfolio-v2"}))
print(f"Built {len(list(out.iterdir()))} files; anchors and local paths valid.")
