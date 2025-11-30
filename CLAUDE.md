# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a digital archive of classic American Transcendentalist and related literary works from Project Gutenberg. The repository contains five complete public domain texts totaling over 62,000 lines.

## Contents

All texts are stored as UTF-8 encoded files at the root level, following Project Gutenberg's naming convention `pg[EBOOK_ID].txt`:

- **pg1322.txt** - Walt Whitman, *Leaves of Grass* (eBook #1322)
- **pg205.txt** - Henry David Thoreau, *Walden, and On The Duty Of Civil Disobedience* (eBook #205)
- **pg25344 (1).txt** - Nathaniel Hawthorne, *The Scarlet Letter* (eBook #25344)
- **pg2701.txt** - Herman Melville, *Moby Dick; Or, The Whale* (eBook #2701)
- **pg29433.txt** - Ralph Waldo Emerson, *Nature* (eBook #29433)

## File Structure

Each text file contains:
1. Project Gutenberg header with title, author, release date, and license information
2. Delimiter: `*** START OF THE PROJECT GUTENBERG EBOOK [TITLE] ***`
3. The complete literary work
4. End delimiter: `*** END OF THE PROJECT GUTENBERG EBOOK [TITLE] ***`
5. Project Gutenberg license text

## Working with This Repository

### Viewing Content
```bash
# Read a specific text
cat pg29433.txt | less

# Search across all texts
grep -i "transcendental" *.txt

# Count lines in a specific work
wc -l pg2701.txt

# Extract just the book content (between delimiters)
sed -n '/\*\*\* START OF/,/\*\*\* END OF/p' pg29433.txt
```

### Git Workflow
Always work on the designated Claude branch (check system instructions for branch name):
```bash
# Check current branch
git status

# Stage changes
git add <filename>

# Commit with descriptive message
git commit -m "Description of changes"

# Push to remote
git push
```

## Notes

- This is a data-only repository with no build system, tests, or code
- All texts are in the public domain in the United States
- Files are sourced directly from Project Gutenberg without modification
- No development environment setup required
