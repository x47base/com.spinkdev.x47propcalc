#!/usr/bin/env python3
"""
Script: extract_files.py

Scans the current directory (or specified directory) for files, excluding certain directories
and the script itself, then writes each file's path+name followed by its contents into a single text file.
"""
import os
import sys

# Directories to exclude
EXCLUDE_DIRS = {
    'zips', 'web', 'node_modules', 'gradle-8.14.2', 'android', '.idea', 'expo'
}

# File extensions to exclude (optional)
EXCLUDE_EXTENSIONS = {'.zip'}

# Name of the output file
OUTPUT_FILENAME = 'extracted_files.txt'


def main(target_dir):
    script_name = os.path.basename(__file__)
    output_path = os.path.join(target_dir, OUTPUT_FILENAME)

    try:
        with open(output_path, 'w', encoding='utf-8') as out_file:
            for entry in os.listdir(target_dir):
                # Skip excluded directories
                if entry in EXCLUDE_DIRS:
                    continue
                full_path = os.path.join(target_dir, entry)
                # Skip directories
                if os.path.isdir(full_path):
                    continue
                # Skip the script file itself
                if entry == script_name:
                    continue
                # Skip excluded extensions
                _, ext = os.path.splitext(entry)
                if ext.lower() in EXCLUDE_EXTENSIONS:
                    continue

                # Read file content
                try:
                    with open(full_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception as e:
                    print(f"# ERROR reading {full_path}: {e}", file=sys.stderr)
                    continue

                # Write filepath and content to output file
                out_file.write(f"--- {full_path} ---\n")
                out_file.write(content)
                out_file.write("\n\n")  # blank line between files

        print(f"Extraction complete. Output written to: {output_path}")
    except Exception as e:
        print(f"Failed to write output file: {e}", file=sys.stderr)


if __name__ == '__main__':
    target_directory = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    main(target_directory)
