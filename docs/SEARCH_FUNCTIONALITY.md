# Tag-Based Search Functionality for Knowledge Repository

This document describes the tag-based search functionality implemented for the DSE ICT Master knowledge repository.

## Overview

The search functionality allows users to find notes/knowledge points using various filters including tags, keywords, and module categories. The system supports:

- **Tag-based filtering**: Search by one or multiple tags
- **Full-text search**: Search in titles, content, and tags
- **Module filtering**: Filter by specific course modules
- **Partial matching**: Case-insensitive partial text matching
- **Multiple interfaces**: Web UI and CLI tool

## Features

### 1. Tagging System

Each knowledge point (note) can be assigned multiple tags. Tags are stored in the MongoDB database as an array of strings in the `KnowledgePoint` model.

**Example tags:**
- `python`
- `sql`
- `excel`
- `elective A`
- `database design`
- `normalization`

### 2. Search API Endpoints

#### Search Knowledge Points
```http
GET /api/knowledge/search?q=<query>&tags=<tags>&moduleId=<moduleId>&userId=<userId>
```

**Query Parameters:**
- `q` (optional): Text query to search in title, content, and tags
- `tags` (optional): Comma-separated list of tags for filtering
- `moduleId` (optional): Filter by specific module ID
- `userId` (optional): Filter by user (automatically applied for non-admin users)

**Example Requests:**
```bash
# Search by tag
/api/knowledge/search?tags=python

# Search by multiple tags
/api/knowledge/search?tags=python,sql

# Search by text query
/api/knowledge/search?q=database

# Combine filters
/api/knowledge/search?tags=python&moduleId=core-d&q=algorithm
```

**Response:**
```json
[
  {
    "_id": "64abc123...",
    "moduleId": "core-d",
    "title": "Python Sorting Algorithms",
    "content": "# Bubble Sort\n\nBubble sort is...",
    "author": {
      "_id": "64def456...",
      "username": "john_doe"
    },
    "tags": ["python", "algorithm", "sorting"],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Get All Tags
```http
GET /api/knowledge/tags
```

Returns all unique tags with their usage count, sorted by popularity.

**Response:**
```json
[
  { "tag": "python", "count": 15 },
  { "tag": "sql", "count": 12 },
  { "tag": "excel", "count": 8 }
]
```

### 3. Web UI Search Interface

#### MyNotes Component (Personal Search)
Located at `/knowledge/manage`, this component provides:
- Search bar for text queries
- Tag filter buttons (shows only user's tags)
- Real-time filtering as you type
- Filter summary showing result count
- Highlighted tags that match filter criteria

**Features:**
- Client-side filtering for instant results
- Visual feedback with color-coded selected tags
- Empty state with clear instructions
- Option to clear all filters

#### SearchKnowledge Component (Global Search)
Located at `/knowledge/search`, this component provides:
- Global search across all notes (or user's notes for non-admin)
- Advanced filters (expandable)
- Tag suggestions based on popular tags
- Module dropdown filter
- Server-side search with debouncing
- Highlighted search terms in results

**Features:**
- Debounced search (300ms) to reduce API calls
- Shows tag usage count
- Visual indicators for matched filters
- Expandable advanced filters section
- Initial state with popular tag suggestions

### 4. CLI Search Tool

A command-line interface for searching knowledge points directly from the terminal.

**Location:** `server/searchKnowledge.js`

**Usage:**
```bash
# Basic tag search
npm run search -- --tags python

# Multiple tags
npm run search -- --tags python,sql,excel

# Partial tag matching (case-insensitive)
npm run search -- --tags elect

# Text query
npm run search -- --query "database design"

# Filter by module
npm run search -- --module core-a

# Combine filters
npm run search -- --tags python --module core-d --limit 5

# Show help
npm run search -- --help
```

**Example Output:**
```
Connected to database

Found 3 result(s):

================================================================================

1. Python Data Structures
   Module: core-d
   Tags: python, data structures, lists
   Author: student001
   Created: 1/15/2024
   Preview: # Lists in Python Lists are ordered, mutable collections...
--------------------------------------------------------------------------------

2. Python Loops and Control Flow
   Module: core-d
   Tags: python, loops, control flow
   Author: student002
   Created: 1/16/2024
   Preview: # For Loops The for loop in Python is used to iterate...
--------------------------------------------------------------------------------

Total: 2 note(s)
```

## Implementation Details

### Backend (Server-Side)

#### API Endpoint: `/api/knowledge/search`
- Uses MongoDB query with regular expressions for partial matching
- Supports case-insensitive search with the `i` flag
- Uses `$in` operator for tag arrays
- Uses `$or` operator for multi-field text search
- Populates author information
- Limits results to 100 to prevent performance issues

**Code Location:** `server/index.js` (lines ~460-540)

#### API Endpoint: `/api/knowledge/tags`
- Uses MongoDB aggregation pipeline
- `$unwind` to expand tag arrays
- `$group` to count unique tags
- `$sort` by count descending
- Returns top 100 tags

**Code Location:** `server/index.js` (lines ~540-560)

### Frontend (Client-Side)

#### MyNotes Component
- Client-side filtering for instant results
- Uses React hooks (useState, useEffect)
- Filters on title, content, and tags
- Tag toggle functionality
- Visual feedback with Tailwind CSS classes

**Code Location:** `src/components/MyNotes.jsx`

#### SearchKnowledge Component
- Server-side search with API calls
- Debounced search to reduce load
- Advanced filters (collapsible)
- Tag selection interface
- Module dropdown
- Result highlighting
- Empty states and loading states

**Code Location:** `src/components/SearchKnowledge.jsx`

### Database Schema

The `KnowledgePoint` model in MongoDB has the following structure:

```javascript
{
  moduleId: String,      // e.g., "core-a", "elec-a"
  title: String,         // Note title
  content: String,       // Markdown content
  author: ObjectId,      // Reference to User
  tags: [String],        // Array of tag strings
  createdAt: Date        // Timestamp
}
```

**Index recommendations:**
```javascript
// For faster tag searches
db.knowledgepoints.createIndex({ tags: 1 });

// For text search
db.knowledgepoints.createIndex({ 
  title: "text", 
  content: "text", 
  tags: "text" 
});
```

## Usage Examples

### Creating a Note with Tags

When creating a knowledge point, add tags in the "Tags" field (comma-separated):

```
Tags: python, data structures, lists, arrays
```

These will be stored as: `["python", "data structures", "lists", "arrays"]`

### Searching in Web UI

1. Navigate to "搜索筆記" in the header menu
2. Type search query: "python"
3. Or click on tag suggestions: "python", "sql", etc.
4. Expand "進階篩選" for module filter
5. Results update automatically with debouncing

### Searching with CLI

```bash
# Search for notes about Python
npm run search -- --tags python

# Search for notes about elective modules
npm run search -- --tags "elective A"

# Search for specific content
npm run search -- --query "normalization"

# Complex search
npm run search -- --tags sql,database --module elec-a --limit 10
```

## Search Algorithm

### Tag Matching
The search uses MongoDB regular expressions for flexible matching:

```javascript
// Exact match (case-insensitive)
tags: { $in: ["python"] }  // matches "python", "Python", "PYTHON"

// Partial match
tags: { $regex: "elect", $options: "i" }  // matches "elective A", "Elective B"
```

### Text Search
Uses `$or` operator to search across multiple fields:

```javascript
{
  $or: [
    { title: { $regex: query, $options: 'i' } },
    { content: { $regex: query, $options: 'i' } },
    { tags: { $regex: query, $options: 'i' } }
  ]
}
```

## Performance Considerations

1. **Debouncing**: 300ms delay on search input to reduce API calls
2. **Result Limit**: Maximum 100 results per search
3. **Client-side Filtering**: Used in MyNotes for instant results
4. **Indexes**: Recommended indexes on `tags` and text fields
5. **Pagination**: Can be added for large result sets (future enhancement)

## Future Enhancements

Potential improvements for the search functionality:

1. **Advanced Search Operators**
   - Boolean operators (AND, OR, NOT)
   - Phrase search with quotes
   - Wildcard matching

2. **Search History**
   - Save recent searches
   - Popular searches tracking

3. **Search Analytics**
   - Track most searched tags
   - Search result relevance feedback

4. **Auto-complete**
   - Tag suggestions as you type
   - Recent tags

5. **Saved Searches**
   - Save complex search queries
   - Quick access to favorite filters

6. **Export Results**
   - Export search results to CSV/JSON
   - Batch download notes

## Troubleshooting

### Common Issues

**Issue:** Search returns no results
- Check if tags are spelled correctly
- Try partial matching (e.g., "elect" instead of "elective A")
- Verify notes exist with those tags
- Check case sensitivity is handled (should be case-insensitive)

**Issue:** CLI tool not connecting to database
- Ensure MongoDB is running
- Check `.env` file has correct `MONGO_URI`
- Verify network connectivity

**Issue:** Slow search performance
- Add database indexes on `tags` field
- Consider reducing result limit
- Check if too many notes exist (consider pagination)

**Issue:** Tags not showing in dropdown
- Verify notes have tags assigned
- Check `/api/knowledge/tags` endpoint directly
- Clear browser cache

## API Documentation Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/knowledge/search` | GET | Search knowledge points | Yes |
| `/api/knowledge/tags` | GET | Get all unique tags | Yes |
| `/api/knowledge` | POST | Create knowledge point | Yes |
| `/api/knowledge/:moduleId` | GET | Get notes by module | Yes |
| `/api/knowledge/user/:userId` | GET | Get user's notes | Yes |
| `/api/knowledge/detail/:id` | GET | Get note details | Yes |

## Security Notes

- User authentication required for all search endpoints
- Non-admin users can only search their own notes (by default)
- Input sanitization via MongoDB parameterized queries
- No SQL injection risk due to MongoDB's query structure
- Rate limiting recommended for production (not implemented)

## Testing Recommendations

### Manual Testing
1. Create notes with various tags
2. Test partial tag matching
3. Test case-insensitive search
4. Test multiple tag combinations
5. Test empty search results
6. Test CLI tool with different parameters

### Test Cases
- Search with single tag
- Search with multiple tags
- Search with partial text
- Search with non-existent tag
- Search with special characters
- Module filtering
- Combined filters

## License

This search functionality is part of the DSE ICT Master project and follows the project's MIT license.

## Support

For issues or questions about the search functionality:
1. Check this documentation
2. Review the code comments in source files
3. Open an issue on GitHub
4. Contact the development team

---

**Last Updated:** 2024-12-05
**Version:** 1.0.0
