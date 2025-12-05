#!/usr/bin/env node

/**
 * Test data seeding script for Search Functionality
 * This script creates sample knowledge points with various tags for testing
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { KnowledgePoint, User } from './models.js';

dotenv.config();

const SAMPLE_NOTES = [
  {
    moduleId: 'core-d',
    title: 'Python Basics - Variables and Data Types',
    content: `# Python Variables

Variables in Python are containers for storing data values. Unlike other programming languages, Python has no command for declaring a variable.

## Data Types
- **String**: Text data, e.g., "Hello World"
- **Integer**: Whole numbers, e.g., 42
- **Float**: Decimal numbers, e.g., 3.14
- **Boolean**: True or False

## Example
\`\`\`python
name = "John"
age = 25
height = 1.75
is_student = True
\`\`\``,
    tags: ['python', 'programming', 'data types', 'variables']
  },
  {
    moduleId: 'elec-a',
    title: 'SQL Database Basics',
    content: `# Introduction to SQL

SQL (Structured Query Language) is used to manage and manipulate databases.

## Basic Commands
- **SELECT**: Retrieve data from database
- **INSERT**: Add new data
- **UPDATE**: Modify existing data
- **DELETE**: Remove data

## Example
\`\`\`sql
SELECT * FROM students WHERE grade > 80;
\`\`\``,
    tags: ['sql', 'database', 'elective A', 'queries']
  },
  {
    moduleId: 'elec-a',
    title: 'Database Normalization',
    content: `# Database Normalization

Normalization is the process of organizing data to reduce redundancy and improve data integrity.

## Normal Forms
1. **1NF**: Atomic values, no repeating groups
2. **2NF**: No partial dependencies
3. **3NF**: No transitive dependencies

## Benefits
- Reduces data redundancy
- Improves data integrity
- Makes database more flexible`,
    tags: ['database', 'normalization', 'sql', 'elective A', 'design']
  },
  {
    moduleId: 'core-d',
    title: 'Python Loops - For and While',
    content: `# Python Loops

Loops are used to execute a block of code repeatedly.

## For Loop
\`\`\`python
for i in range(5):
    print(i)
\`\`\`

## While Loop
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\``,
    tags: ['python', 'loops', 'programming', 'control flow']
  },
  {
    moduleId: 'elec-c',
    title: 'Excel Functions and Formulas',
    content: `# Excel Basic Functions

Excel provides various functions for data analysis and calculation.

## Common Functions
- **SUM()**: Add numbers
- **AVERAGE()**: Calculate mean
- **COUNT()**: Count cells with numbers
- **IF()**: Conditional logic
- **VLOOKUP()**: Vertical lookup

## Example
\`\`\`
=SUM(A1:A10)
=IF(B2>50, "Pass", "Fail")
\`\`\``,
    tags: ['excel', 'spreadsheet', 'functions', 'elective C']
  },
  {
    moduleId: 'elec-a',
    title: 'SQL Joins - INNER, LEFT, RIGHT',
    content: `# SQL Joins

Joins are used to combine rows from two or more tables based on a related column.

## Types of Joins
1. **INNER JOIN**: Returns matching records
2. **LEFT JOIN**: Returns all from left table
3. **RIGHT JOIN**: Returns all from right table
4. **FULL JOIN**: Returns all records

## Example
\`\`\`sql
SELECT students.name, courses.title
FROM students
INNER JOIN enrollments ON students.id = enrollments.student_id
INNER JOIN courses ON enrollments.course_id = courses.id;
\`\`\``,
    tags: ['sql', 'database', 'joins', 'elective A', 'queries']
  },
  {
    moduleId: 'core-d',
    title: 'Python Data Structures - Lists and Dictionaries',
    content: `# Python Data Structures

## Lists
Lists are ordered, mutable collections.
\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits.append("orange")
\`\`\`

## Dictionaries
Dictionaries store key-value pairs.
\`\`\`python
student = {
    "name": "John",
    "age": 20,
    "grade": "A"
}
\`\`\``,
    tags: ['python', 'data structures', 'lists', 'dictionaries', 'programming']
  },
  {
    moduleId: 'elec-b',
    title: 'Network Protocols - TCP/IP',
    content: `# TCP/IP Protocol

TCP/IP is the fundamental protocol suite for the internet.

## Layers
1. **Application Layer**: HTTP, FTP, SMTP
2. **Transport Layer**: TCP, UDP
3. **Internet Layer**: IP, ICMP
4. **Network Access Layer**: Ethernet, WiFi

## Key Features
- Reliable data transmission
- Error checking
- Flow control`,
    tags: ['networking', 'protocols', 'TCP/IP', 'elective B']
  }
];

async function seedTestData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database\n');

    // Find or create a test user
    let testUser = await User.findOne({ username: 'testuser' });
    
    if (!testUser) {
      console.log('Creating test user...');
      testUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword', // In production, this should be hashed
        role: 'student'
      });
      await testUser.save();
      console.log('Test user created\n');
    } else {
      console.log('Test user already exists\n');
    }

    // Check if sample data already exists
    const existingCount = await KnowledgePoint.countDocuments({ 
      author: testUser._id 
    });

    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing test notes`);
      console.log('Skipping seed. Delete existing notes first if you want to reseed.\n');
      return;
    }

    // Create sample knowledge points
    console.log('Seeding sample knowledge points...\n');
    
    for (const note of SAMPLE_NOTES) {
      const knowledgePoint = new KnowledgePoint({
        ...note,
        author: testUser._id
      });
      await knowledgePoint.save();
      console.log(`✓ Created: ${note.title}`);
      console.log(`  Tags: ${note.tags.join(', ')}\n`);
    }

    console.log(`\nSuccessfully created ${SAMPLE_NOTES.length} sample notes!`);
    console.log('\nYou can now test the search functionality:');
    console.log('- Web UI: Navigate to /knowledge/search');
    console.log('- CLI: npm run search -- --tags python');

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seeding
seedTestData().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
