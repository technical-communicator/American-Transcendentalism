# American Transcendentalism - Distant Reading Analysis

A digital humanities project that performs computational analysis on classic American Transcendentalist texts from Project Gutenberg.

## Overview

This project conducts distant reading analysis on five major works of American literature:

- **Nature** by Ralph Waldo Emerson (1836)
- **Walden, and On The Duty Of Civil Disobedience** by Henry David Thoreau (1854)
- **Leaves of Grass** by Walt Whitman (1855)
- **The Scarlet Letter** by Nathaniel Hawthorne (1850)
- **Moby Dick; Or, The Whale** by Herman Melville (1851)

## Features

### Analysis Capabilities
- **Bag-of-Words Analysis**: Word frequency distributions with stopword removal
- **Sentiment Analysis**: VADER sentiment analysis for each complete work
- **Text Statistics**: Word counts, lexical diversity, sentence length averages
- **Comparative Analysis**: Vocabulary overlap and distinctive word identification

### Interactive Web Interface
- **Overview Dashboard**: Collection-wide statistics and visualizations
- **Individual Text Analysis**: Detailed analysis for each work including:
  - Interactive word clouds
  - Top word frequencies
  - Distinctive vocabulary
  - Sentiment breakdowns
- **Comparison Tools**: Side-by-side comparison of all texts

## Project Structure

```
American-Transcendentalism/
├── pg*.txt                      # Original Project Gutenberg texts
├── clean_*.txt                  # Extracted clean text (no headers/footers)
├── extract_texts.py             # Text extraction script
├── analyze_texts.py             # Main analysis pipeline
├── analysis_results.json        # Complete analysis data
├── index.html                   # Web interface
├── app.js                       # Visualization logic
├── styles.css                   # Interface styling
├── CLAUDE.md                    # Claude Code guidance
└── README.md                    # This file
```

## Usage

### Running the Analysis

1. **Extract clean text from Project Gutenberg files:**
   ```bash
   python3 extract_texts.py
   ```

2. **Run the complete analysis pipeline:**
   ```bash
   python3 analyze_texts.py
   ```
   This will generate `analysis_results.json` with all analysis data.

### Viewing the Web Interface

Simply open `index.html` in a web browser:

```bash
# Using Python's built-in server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

Or open the file directly in your browser.

## Requirements

### Python Dependencies
- `nltk` - Natural language processing
- `scikit-learn` - Machine learning utilities
- `vaderSentiment` - Sentiment analysis

Install with:
```bash
pip3 install nltk scikit-learn vaderSentiment
```

### NLTK Data
Download required datasets:
```python
import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')
```

### Web Interface
The web interface uses CDN-hosted libraries:
- Chart.js (for statistical visualizations)
- WordCloud2 (for word cloud generation)

No local installation required.

## Analysis Methodology

### Text Preprocessing
1. Extract content between Project Gutenberg delimiters
2. Tokenize using NLTK's word tokenizer
3. Filter: remove stopwords, non-alphabetic tokens, and words < 3 characters
4. Convert to lowercase for normalization

### Bag-of-Words
- Generate word frequency distributions
- Extract top 100 most frequent words per text
- Calculate distinctive words using TF-IDF-like scoring

### Sentiment Analysis
- Uses VADER (Valence Aware Dictionary and sEntiment Reasoner)
- Analyzes up to 1,000 sentences sampled evenly throughout each text
- Provides compound, positive, neutral, and negative scores

### Comparative Analysis
- Vocabulary overlap: percentage of shared words between texts
- Distinctive words: terms frequent in one text but rare in others
- Statistical comparisons: lexical diversity, sentence length, etc.

## Key Findings

Based on the analysis of these five texts:

- **Emerson's Nature** has the highest lexical diversity (16.75%)
- **Melville's Moby Dick** is the longest work (212,796 words)
- All texts show positive sentiment except Moby Dick (neutral)
- Emerson's work shows the most positive sentiment (compound: +0.227)
- Significant vocabulary overlap exists between Transcendentalist authors

## License

All analyzed texts are in the public domain in the United States.

This analysis code and web interface are provided for educational purposes.

## Credits

- Texts sourced from [Project Gutenberg](https://www.gutenberg.org/)
- Analysis by Claude Code (Anthropic)
- Created: November 30, 2025
