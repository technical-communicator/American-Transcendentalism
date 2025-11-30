#!/usr/bin/env python3
"""
Extract clean text content from Project Gutenberg files.
Removes headers and footers, keeping only the literary work.
"""

import os
import re

# Define the texts to process
TEXTS = {
    'pg29433.txt': {
        'title': 'Nature',
        'author': 'Ralph Waldo Emerson',
        'output': 'clean_emerson_nature.txt'
    },
    'pg205.txt': {
        'title': 'Walden, and On The Duty Of Civil Disobedience',
        'author': 'Henry David Thoreau',
        'output': 'clean_thoreau_walden.txt'
    },
    'pg1322.txt': {
        'title': 'Leaves of Grass',
        'author': 'Walt Whitman',
        'output': 'clean_whitman_leaves.txt'
    },
    'pg25344 (1).txt': {
        'title': 'The Scarlet Letter',
        'author': 'Nathaniel Hawthorne',
        'output': 'clean_hawthorne_scarlet.txt'
    },
    'pg2701.txt': {
        'title': 'Moby Dick; Or, The Whale',
        'author': 'Herman Melville',
        'output': 'clean_melville_moby.txt'
    }
}

def extract_clean_text(input_file):
    """Extract text between Project Gutenberg delimiters."""
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find content between START and END markers
        start_pattern = r'\*\*\* START OF (?:THIS|THE) PROJECT GUTENBERG EBOOK .+ \*\*\*'
        end_pattern = r'\*\*\* END OF (?:THIS|THE) PROJECT GUTENBERG EBOOK .+ \*\*\*'

        start_match = re.search(start_pattern, content, re.IGNORECASE)
        end_match = re.search(end_pattern, content, re.IGNORECASE)

        if start_match and end_match:
            # Extract text between markers
            clean_text = content[start_match.end():end_match.start()].strip()
            return clean_text
        else:
            print(f"Warning: Could not find delimiters in {input_file}")
            return None

    except Exception as e:
        print(f"Error processing {input_file}: {e}")
        return None

def main():
    """Process all texts and save clean versions."""
    print("Extracting clean text from Project Gutenberg files...\n")

    for input_file, metadata in TEXTS.items():
        if not os.path.exists(input_file):
            print(f"⚠ File not found: {input_file}")
            continue

        print(f"Processing: {metadata['title']} by {metadata['author']}")

        clean_text = extract_clean_text(input_file)

        if clean_text:
            output_file = metadata['output']
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(clean_text)

            word_count = len(clean_text.split())
            print(f"  ✓ Extracted {word_count:,} words to {output_file}\n")
        else:
            print(f"  ✗ Failed to extract text\n")

    print("Extraction complete!")

if __name__ == '__main__':
    main()
