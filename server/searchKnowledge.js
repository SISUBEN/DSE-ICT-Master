#!/usr/bin/env node

/**
 * CLI Tool for Searching Knowledge Points
 * 
 * Usage:
 *   node searchKnowledge.js --tags python,sql
 *   node searchKnowledge.js --query "database design"
 *   node searchKnowledge.js --module elec-a
 *   node searchKnowledge.js --tags python --module core-d
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { KnowledgePoint } from './models.js';

// Load environment variables
dotenv.config();

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    tags: null,
    query: null,
    moduleId: null,
    limit: 10
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--tags' && args[i + 1]) {
      options.tags = args[i + 1].split(',').map(t => t.trim());
      i++;
    } else if (args[i] === '--query' && args[i + 1]) {
      options.query = args[i + 1];
      i++;
    } else if (args[i] === '--module' && args[i + 1]) {
      options.moduleId = args[i + 1];
      i++;
    } else if (args[i] === '--limit' && args[i + 1]) {
      options.limit = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Knowledge Base Search CLI Tool
================================

Search through knowledge points using tags, queries, or modules.

Usage:
  node searchKnowledge.js [OPTIONS]

Options:
  --tags <tags>       Search by tags (comma-separated). Supports partial matching.
                      Example: --tags python,sql
                      Example: --tags elect  (matches "elective A", "elective B", etc.)

  --query <text>      Search in title and content (case-insensitive)
                      Example: --query "database design"

  --module <id>       Filter by module ID
                      Example: --module core-a
                      Example: --module elec-a

  --limit <number>    Limit number of results (default: 10)
                      Example: --limit 20

  --help, -h          Show this help message

Examples:
  # Search for notes with Python tag
  node searchKnowledge.js --tags python

  # Search for multiple tags
  node searchKnowledge.js --tags python,sql,excel

  # Search for partial tag match (case-insensitive)
  node searchKnowledge.js --tags elect

  # Search in content
  node searchKnowledge.js --query "normalization"

  # Combine filters
  node searchKnowledge.js --tags python --module core-d --limit 5

  # Search for elective A related notes
  node searchKnowledge.js --tags "elective A"
`);
}

async function search(options) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database\n');

    // Build query
    const query = {};

    if (options.moduleId) {
      query.moduleId = options.moduleId;
    }

    if (options.tags) {
      // MongoDB handles regex compilation efficiently
      // Support partial matching with case-insensitive search
      query.tags = {
        $in: options.tags.map(tag => new RegExp(tag, 'i'))
      };
    }

    if (options.query) {
      query.$or = [
        { title: { $regex: options.query, $options: 'i' } },
        { content: { $regex: options.query, $options: 'i' } },
        { tags: { $regex: options.query, $options: 'i' } }
      ];
    }

    // Execute search
    const results = await KnowledgePoint.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(options.limit);

    // Display results
    console.log(`Found ${results.length} result(s):\n`);
    console.log('='.repeat(80));

    if (results.length === 0) {
      console.log('No results found. Try different search criteria.');
    } else {
      results.forEach((note, index) => {
        console.log(`\n${index + 1}. ${note.title}`);
        console.log(`   Module: ${note.moduleId}`);
        console.log(`   Tags: ${note.tags.join(', ') || 'None'}`);
        console.log(`   Author: ${note.author?.username || 'Unknown'}`);
        console.log(`   Created: ${note.createdAt.toLocaleDateString()}`);
        console.log(`   Preview: ${note.content.substring(0, 100).replace(/\n/g, ' ')}...`);
        console.log('-'.repeat(80));
      });
    }

    console.log(`\nTotal: ${results.length} note(s)`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Main execution
const options = parseArgs();

// Check if any search criteria provided
if (!options.tags && !options.query && !options.moduleId) {
  console.log('Error: Please provide at least one search criterion.\n');
  printHelp();
  process.exit(1);
}

search(options).then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
