// Main application logic for American Transcendentalism analysis viewer

let analysisData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load analysis data
        const response = await fetch('analysis_results.json');
        analysisData = await response.json();

        // Initialize views
        initializeNavigation();
        populateOverview();
        populateTextSelector();
        populateComparisonView();

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error loading analysis data:', error);
        document.querySelector('main').innerHTML = '<p class="error">Error loading analysis data. Please ensure analysis_results.json is available.</p>';
    }
});

// Navigation between views
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const viewSections = document.querySelectorAll('.view-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetView = button.dataset.view;

            // Update active states
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            viewSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetView}-view`) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Populate overview section
function populateOverview() {
    // Collection statistics
    const totalWords = Object.values(analysisData.texts).reduce((sum, text) =>
        sum + text.statistics.total_words, 0);
    const totalUnique = Object.values(analysisData.texts).reduce((sum, text) =>
        sum + text.statistics.unique_words, 0);

    document.getElementById('collection-stats').innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Total Texts:</span>
            <span class="stat-value">${analysisData.metadata.total_texts}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Total Words:</span>
            <span class="stat-value">${totalWords.toLocaleString()}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Total Unique Words:</span>
            <span class="stat-value">${totalUnique.toLocaleString()}</span>
        </div>
    `;

    // Text list
    const textListHtml = Object.entries(analysisData.texts).map(([id, data]) => `
        <div class="text-list-item">
            <strong>${data.metadata.title}</strong><br>
            <em>${data.metadata.author}</em> (${data.metadata.year})
        </div>
    `).join('');
    document.getElementById('text-list').innerHTML = textListHtml;

    // Create charts
    createWordCountChart();
    createSentimentChart();
}

// Create word count comparison chart
function createWordCountChart() {
    const ctx = document.getElementById('wordCountChart').getContext('2d');
    const textData = Object.entries(analysisData.texts).map(([id, data]) => ({
        label: data.metadata.author.split(' ').pop(), // Last name
        total: data.statistics.total_words,
        unique: data.statistics.unique_words
    }));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: textData.map(t => t.label),
            datasets: [
                {
                    label: 'Total Words',
                    data: textData.map(t => t.total),
                    backgroundColor: 'rgba(75, 115, 170, 0.7)',
                    borderColor: 'rgba(75, 115, 170, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Unique Words',
                    data: textData.map(t => t.unique),
                    backgroundColor: 'rgba(150, 75, 75, 0.7)',
                    borderColor: 'rgba(150, 75, 75, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create sentiment comparison chart
function createSentimentChart() {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    const textData = Object.entries(analysisData.texts).map(([id, data]) => ({
        label: data.metadata.author.split(' ').pop(),
        positive: data.sentiment.positive,
        neutral: data.sentiment.neutral,
        negative: data.sentiment.negative,
        compound: data.sentiment.compound
    }));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: textData.map(t => t.label),
            datasets: [
                {
                    label: 'Positive',
                    data: textData.map(t => t.positive),
                    backgroundColor: 'rgba(75, 170, 75, 0.7)',
                    borderColor: 'rgba(75, 170, 75, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Neutral',
                    data: textData.map(t => t.neutral),
                    backgroundColor: 'rgba(170, 170, 75, 0.7)',
                    borderColor: 'rgba(170, 170, 75, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Negative',
                    data: textData.map(t => t.negative),
                    backgroundColor: 'rgba(170, 75, 75, 0.7)',
                    borderColor: 'rgba(170, 75, 75, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

// Populate text selector dropdown
function populateTextSelector() {
    const select = document.getElementById('text-select');

    Object.entries(analysisData.texts).forEach(([id, data]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `${data.metadata.title} - ${data.metadata.author}`;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        if (e.target.value) {
            displayTextAnalysis(e.target.value);
        } else {
            document.getElementById('text-details').style.display = 'none';
        }
    });
}

// Display analysis for a specific text
function displayTextAnalysis(textId) {
    const data = analysisData.texts[textId];
    const detailsDiv = document.getElementById('text-details');

    // Update header
    document.getElementById('text-title').textContent = data.metadata.title;
    document.getElementById('text-author').textContent =
        `${data.metadata.author} (${data.metadata.year})`;

    // Update statistics
    document.getElementById('text-stats').innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Total Words:</span>
            <span class="stat-value">${data.statistics.total_words.toLocaleString()}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Unique Words:</span>
            <span class="stat-value">${data.statistics.unique_words.toLocaleString()}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Lexical Diversity:</span>
            <span class="stat-value">${(data.statistics.lexical_diversity * 100).toFixed(2)}%</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Avg Sentence Length:</span>
            <span class="stat-value">${data.statistics.avg_sentence_length} words</span>
        </div>
    `;

    // Update sentiment
    const sentimentClass = data.sentiment.overall;
    document.getElementById('text-sentiment').innerHTML = `
        <div class="sentiment-badge ${sentimentClass}">${data.sentiment.overall.toUpperCase()}</div>
        <div class="sentiment-scores">
            <div class="stat-item">
                <span class="stat-label">Compound Score:</span>
                <span class="stat-value">${data.sentiment.compound.toFixed(3)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Positive:</span>
                <span class="stat-value">${(data.sentiment.positive * 100).toFixed(1)}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Neutral:</span>
                <span class="stat-value">${(data.sentiment.neutral * 100).toFixed(1)}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Negative:</span>
                <span class="stat-value">${(data.sentiment.negative * 100).toFixed(1)}%</span>
            </div>
        </div>
    `;

    // Create word cloud
    createWordCloud(data.word_frequency);

    // Display top words
    const topWords = Object.entries(data.word_frequency).slice(0, 20);
    document.getElementById('top-words-list').innerHTML = topWords.map(([word, count], index) => `
        <div class="word-item">
            <span class="word-rank">${index + 1}.</span>
            <span class="word-text">${word}</span>
            <span class="word-count">${count.toLocaleString()}</span>
        </div>
    `).join('');

    // Display distinctive words
    const distinctiveWords = analysisData.comparative.distinctive_words[textId] || [];
    document.getElementById('distinctive-words-list').innerHTML = distinctiveWords.slice(0, 20).map((item, index) => `
        <div class="word-item">
            <span class="word-rank">${index + 1}.</span>
            <span class="word-text">${item.word}</span>
            <span class="word-score">${item.score}</span>
        </div>
    `).join('');

    detailsDiv.style.display = 'block';
}

// Create word cloud visualization
function createWordCloud(wordFrequency) {
    const canvas = document.getElementById('wordcloud');

    // Convert word frequency to wordcloud2 format
    const wordList = Object.entries(wordFrequency).map(([word, count]) => [word, count]);

    // Clear previous word cloud
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create word cloud
    WordCloud(canvas, {
        list: wordList,
        gridSize: 8,
        weightFactor: function(size) {
            return Math.pow(size, 0.5) * 3;
        },
        fontFamily: 'Georgia, serif',
        color: function() {
            const colors = ['#4b73aa', '#964b4b', '#4baa4b', '#aa964b', '#734baa'];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        rotateRatio: 0.3,
        backgroundColor: '#f8f9fa'
    });
}

// Populate comparison view
function populateComparisonView() {
    // Create lexical diversity chart
    createDiversityChart();

    // Create vocabulary overlap visualization
    createVocabularyOverlap();

    // Populate comparison table
    populateComparisonTable();
}

// Create lexical diversity chart
function createDiversityChart() {
    const ctx = document.getElementById('diversityChart').getContext('2d');
    const textData = Object.entries(analysisData.texts).map(([id, data]) => ({
        label: data.metadata.author.split(' ').pop(),
        diversity: data.statistics.lexical_diversity * 100
    }));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: textData.map(t => t.label),
            datasets: [{
                label: 'Lexical Diversity (%)',
                data: textData.map(t => t.diversity),
                backgroundColor: 'rgba(115, 75, 170, 0.7)',
                borderColor: 'rgba(115, 75, 170, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20
                }
            }
        }
    });
}

// Create vocabulary overlap visualization
function createVocabularyOverlap() {
    const overlapData = analysisData.comparative.vocabulary_overlap;
    const container = document.getElementById('vocabulary-overlap');

    let html = '<div class="overlap-matrix">';

    // Get all text IDs
    const textIds = Object.keys(analysisData.texts);

    // Create matrix
    textIds.forEach(textId1 => {
        const text1 = analysisData.texts[textId1];
        html += `<div class="overlap-row">`;
        html += `<div class="overlap-label">${text1.metadata.author.split(' ').pop()}</div>`;

        textIds.forEach(textId2 => {
            if (textId1 === textId2) {
                html += `<div class="overlap-cell self">—</div>`;
            } else {
                const overlap = overlapData[textId1][textId2].overlap_percentage;
                html += `<div class="overlap-cell" style="background-color: rgba(75, 115, 170, ${overlap / 100})">${overlap.toFixed(1)}%</div>`;
            }
        });

        html += `</div>`;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Populate comparison table
function populateComparisonTable() {
    const tbody = document.getElementById('comparison-table-body');

    Object.entries(analysisData.texts).forEach(([id, data]) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td><strong>${data.metadata.author}</strong><br><em>${data.metadata.title}</em></td>
            <td>${data.statistics.total_words.toLocaleString()}</td>
            <td>${data.statistics.unique_words.toLocaleString()}</td>
            <td>${(data.statistics.lexical_diversity * 100).toFixed(2)}%</td>
            <td>${data.statistics.avg_sentence_length}</td>
            <td><span class="sentiment-badge ${data.sentiment.overall}">${data.sentiment.overall}</span></td>
        `;
    });
}
