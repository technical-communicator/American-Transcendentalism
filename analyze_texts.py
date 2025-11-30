#!/usr/bin/env python3
"""
Conduct distant reading analysis on American Transcendentalist texts.
Includes bag-of-words, sentiment analysis, and comparative analysis.
"""

import json
import re
from collections import Counter
from pathlib import Path
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Text metadata
TEXTS = {
    'clean_emerson_nature.txt': {
        'id': 'emerson_nature',
        'title': 'Nature',
        'author': 'Ralph Waldo Emerson',
        'year': 1836,
        'gutenberg_id': 29433
    },
    'clean_thoreau_walden.txt': {
        'id': 'thoreau_walden',
        'title': 'Walden, and On The Duty Of Civil Disobedience',
        'author': 'Henry David Thoreau',
        'year': 1854,
        'gutenberg_id': 205
    },
    'clean_whitman_leaves.txt': {
        'id': 'whitman_leaves',
        'title': 'Leaves of Grass',
        'author': 'Walt Whitman',
        'year': 1855,
        'gutenberg_id': 1322
    },
    'clean_hawthorne_scarlet.txt': {
        'id': 'hawthorne_scarlet',
        'title': 'The Scarlet Letter',
        'author': 'Nathaniel Hawthorne',
        'year': 1850,
        'gutenberg_id': 25344
    },
    'clean_melville_moby.txt': {
        'id': 'melville_moby',
        'title': 'Moby Dick; Or, The Whale',
        'author': 'Herman Melville',
        'year': 1851,
        'gutenberg_id': 2701
    }
}

def load_text(filename):
    """Load text file content."""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return None

def clean_and_tokenize(text):
    """Clean text and tokenize into words."""
    # Convert to lowercase
    text = text.lower()

    # Tokenize
    tokens = word_tokenize(text)

    # Filter: only alphabetic tokens, remove stopwords, minimum length 3
    stop_words = set(stopwords.words('english'))
    tokens = [
        word for word in tokens
        if word.isalpha() and word not in stop_words and len(word) >= 3
    ]

    return tokens

def build_word_frequency(tokens, top_n=100):
    """Build word frequency distribution."""
    freq_dist = Counter(tokens)
    return dict(freq_dist.most_common(top_n))

def calculate_text_statistics(text, tokens):
    """Calculate basic text statistics."""
    words = text.split()
    sentences = sent_tokenize(text)

    # Lexical diversity (unique words / total words)
    unique_words = set(token.lower() for token in words if token.isalpha())
    lexical_diversity = len(unique_words) / len(words) if words else 0

    # Average sentence length
    avg_sentence_length = len(words) / len(sentences) if sentences else 0

    return {
        'total_words': len(words),
        'total_sentences': len(sentences),
        'unique_words': len(unique_words),
        'filtered_tokens': len(tokens),
        'lexical_diversity': round(lexical_diversity, 4),
        'avg_sentence_length': round(avg_sentence_length, 2)
    }

def analyze_sentiment(text, sample_size=1000):
    """Analyze sentiment using VADER."""
    analyzer = SentimentIntensityAnalyzer()

    # Split into sentences
    sentences = sent_tokenize(text)

    # Sample sentences if text is very long (for performance)
    if len(sentences) > sample_size:
        # Sample evenly throughout the text
        step = len(sentences) // sample_size
        sampled_sentences = sentences[::step][:sample_size]
    else:
        sampled_sentences = sentences

    # Analyze each sentence
    sentiments = []
    for sentence in sampled_sentences:
        scores = analyzer.polarity_scores(sentence)
        sentiments.append(scores)

    # Calculate aggregate scores
    if sentiments:
        avg_compound = sum(s['compound'] for s in sentiments) / len(sentiments)
        avg_pos = sum(s['pos'] for s in sentiments) / len(sentiments)
        avg_neu = sum(s['neu'] for s in sentiments) / len(sentiments)
        avg_neg = sum(s['neg'] for s in sentiments) / len(sentiments)

        # Classify overall sentiment
        if avg_compound >= 0.05:
            overall = 'positive'
        elif avg_compound <= -0.05:
            overall = 'negative'
        else:
            overall = 'neutral'
    else:
        avg_compound = avg_pos = avg_neu = avg_neg = 0
        overall = 'neutral'

    return {
        'compound': round(avg_compound, 4),
        'positive': round(avg_pos, 4),
        'neutral': round(avg_neu, 4),
        'negative': round(avg_neg, 4),
        'overall': overall,
        'sentences_analyzed': len(sampled_sentences)
    }

def compare_vocabularies(all_tokens):
    """Compare vocabularies across texts."""
    comparisons = {}

    # Get unique words per text
    unique_words = {
        text_id: set(tokens)
        for text_id, tokens in all_tokens.items()
    }

    # Calculate overlaps
    for text_id in unique_words:
        comparisons[text_id] = {}
        for other_id in unique_words:
            if text_id != other_id:
                overlap = unique_words[text_id] & unique_words[other_id]
                overlap_pct = len(overlap) / len(unique_words[text_id]) * 100
                comparisons[text_id][other_id] = {
                    'shared_words': len(overlap),
                    'overlap_percentage': round(overlap_pct, 2)
                }

    return comparisons

def find_distinctive_words(all_tokens, top_n=20):
    """Find words distinctive to each text."""
    distinctive = {}

    # Get word frequencies for each text
    all_freqs = {
        text_id: Counter(tokens)
        for text_id, tokens in all_tokens.items()
    }

    # For each text, find words that appear frequently in it but rarely in others
    for text_id, freq in all_freqs.items():
        # Calculate TF-IDF-like score
        scores = {}
        for word, count in freq.items():
            # How many other texts contain this word
            appears_in = sum(1 for other_id, other_freq in all_freqs.items()
                           if other_id != text_id and word in other_freq)

            # Distinctive score: high frequency, appears in few other texts
            if appears_in < len(all_freqs) - 1:  # Not in all texts
                scores[word] = count * (len(all_freqs) - appears_in)

        # Get top distinctive words
        distinctive[text_id] = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
        distinctive[text_id] = [{'word': word, 'score': score} for word, score in distinctive[text_id]]

    return distinctive

def main():
    """Main analysis pipeline."""
    print("Starting text analysis...\n")

    results = {
        'metadata': {
            'analysis_date': '2025-11-30',
            'total_texts': len(TEXTS),
            'description': 'Distant reading analysis of American Transcendentalist literature'
        },
        'texts': {}
    }

    all_tokens = {}

    # Process each text
    for filename, metadata in TEXTS.items():
        text_id = metadata['id']
        print(f"Analyzing: {metadata['title']} by {metadata['author']}")

        # Load text
        text = load_text(filename)
        if not text:
            continue

        # Tokenize and clean
        tokens = clean_and_tokenize(text)
        all_tokens[text_id] = tokens

        # Build word frequency
        print(f"  • Building word frequency distribution...")
        word_freq = build_word_frequency(tokens, top_n=100)

        # Calculate statistics
        print(f"  • Calculating text statistics...")
        stats = calculate_text_statistics(text, tokens)

        # Sentiment analysis
        print(f"  • Analyzing sentiment...")
        sentiment = analyze_sentiment(text)

        # Store results
        results['texts'][text_id] = {
            'metadata': metadata,
            'statistics': stats,
            'word_frequency': word_freq,
            'sentiment': sentiment
        }

        print(f"  ✓ Complete ({stats['total_words']:,} words, "
              f"{stats['unique_words']:,} unique, "
              f"sentiment: {sentiment['overall']})\n")

    # Comparative analysis
    print("Conducting comparative analysis...")

    # Vocabulary comparisons
    print("  • Comparing vocabularies...")
    vocab_comparisons = compare_vocabularies(all_tokens)

    # Distinctive words
    print("  • Finding distinctive words...")
    distinctive_words = find_distinctive_words(all_tokens)

    # Add comparative results
    results['comparative'] = {
        'vocabulary_overlap': vocab_comparisons,
        'distinctive_words': distinctive_words
    }

    # Export to JSON
    output_file = 'analysis_results.json'
    print(f"\nExporting results to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"✓ Analysis complete! Results saved to {output_file}")

    # Print summary
    print("\n" + "="*60)
    print("ANALYSIS SUMMARY")
    print("="*60)
    for text_id, data in results['texts'].items():
        meta = data['metadata']
        stats = data['statistics']
        sent = data['sentiment']
        print(f"\n{meta['title']} ({meta['author']}, {meta['year']})")
        print(f"  Words: {stats['total_words']:,} | Unique: {stats['unique_words']:,}")
        print(f"  Lexical Diversity: {stats['lexical_diversity']:.2%}")
        print(f"  Sentiment: {sent['overall'].upper()} (compound: {sent['compound']:+.3f})")

if __name__ == '__main__':
    main()
