import os
from pathlib import Path

import dotenv
from langchain.llms import OpenAI
from langchain.schema import HumanMessage


ROOT_PATH = Path(__file__).parent
OPENAI_ENV_PATH = ROOT_PATH.parent / "env" / "openai.env"
dotenv.load_dotenv(OPENAI_ENV_PATH)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

OPENAI_MODEL = OpenAI(openai_api_key=OPENAI_API_KEY)


def request_prompt(source_sentence):
    translated_sentence = "\n"
    if source_sentence:
        translation_prompt = HumanMessage(
            content=f"Translate this sentence from Korean to English. {source_sentence}"
        )
        translated_sentence = OPENAI_MODEL.predict_messages([translation_prompt]).content
    return translated_sentence


def translate(source_path, dest_path):
    translate_lines = []
    with open(source_path, "r") as f:
        line = f.readline()
        translate_lines += [line]
        lines = []
        is_codeblock = False
        is_header = True
        while line:
            line = f.readline()
            # 헤더 블록인 경우
            if line.startswith("---"):
                is_header = False
                translate_lines += [line]
                continue
            if is_header:
                translate_lines += [line]
                continue

            # 코드 블록인 경우
            if line.startswith("```"):
                if not is_codeblock:
                    # 코드 블록 시작인 경우 번역한다.
                    source_sentence = "".join(lines)
                    translated_sentence = request_prompt(source_sentence)
                    translate_lines += [translated_sentence]
                    translate_lines += ["\n"]
                    # 모으는 부분을 초기화 하고 코드 블록임을 선언한다.
                    lines = []
                    is_codeblock = True
                else:
                    # 코드 블록이 끝난 경우
                    is_codeblock = False
                    translate_lines += [line]
                    continue
            if is_codeblock:
                # 코드 블록 내부인 경우 통과한다.
                translate_lines += [line]
                continue
            lines += [line]
            if len(lines) > 10:
                # 많이 모이면 먼저 번역한다.
                source_sentence = "".join(lines)
                translated_sentence = request_prompt(source_sentence)
                translate_lines += [translated_sentence]
                translate_lines += ["\n"]
                lines = []

    source_sentence = "".join(lines)
    #
    # request
    #
    translated_sentence = request_prompt(source_sentence)
    translate_lines += [translated_sentence]
    translate_lines += ["\n"]

    docs = "".join(translate_lines)
    with open(dest_path, "w") as f:
        f.write(docs)


if __name__ == "__main__":
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument("--chapter", type=str)
    args = parser.parse_args()
    REPO_ROOT = ROOT_PATH.parent.parent
    DOCS_ROOT = REPO_ROOT / "docs" / args.chapter
    DEST_ROOT = REPO_ROOT / "i18n/en/docusaurus-plugin-content-docs/version-1.0" / args.chapter

    for source_path in DOCS_ROOT.glob("*.md"):
        dest_path = DEST_ROOT / source_path.name
        print("source : ", source_path)
        translate(source_path, dest_path)
        print("dest : ", dest_path)
