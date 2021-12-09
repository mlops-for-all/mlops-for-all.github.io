from pathlib import Path


REPO_PATH = Path(__file__).parent.parent
CONTENT_PATH= REPO_PATH / "content" / "en"

def trim_trailing_spaces():
    for md_path in CONTENT_PATH.rglob("*.md"):
        print(md_path)
        with open(md_path, "r") as file_reader:
            lines = []
            for line in file_reader:
                if line:
                    line = line.rstrip()
                lines += [line]
        if len(lines) > 0:
            with open(md_path, "w") as file_writer:
                file_writer.write("\n".join(lines))
                if lines[-1] != "\n":
                    file_writer.write("\n")


if __name__ == "__main__":
    trim_trailing_spaces()
