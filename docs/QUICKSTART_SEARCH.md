# Quick Start Guide - Search Functionality

This guide provides a quick overview of the new tag-based search functionality.

## What's New?

A comprehensive search system that allows users to find notes by tags (like `python`, `sql`, `excel`, `elective A`) with:
- 🔍 Web UI search interface
- 💻 Command-line search tool
- 🏷️ Tag-based filtering
- 📝 Full-text search
- 🎯 Module filtering

## Quick Start

### 1. Web Interface

**Personal Notes Search** (`/knowledge/manage`)
- Type in the search box to filter your notes instantly
- Click tag buttons to filter by tags
- Combine text search with tag filters

**Global Search** (`/knowledge/search`)
- Navigate to "搜索筆記" in the header
- Type keywords or select popular tags
- Use advanced filters for module selection

### 2. Command Line

```bash
# Search by tag
npm run search -- --tags python

# Multiple tags
npm run search -- --tags python,sql,excel

# Text search
npm run search -- --query "database design"

# Combined filters
npm run search -- --tags python --module core-d

# Get help
npm run search -- --help
```

### 3. Creating Notes with Tags

When creating a knowledge point at `/knowledge/new`:
1. Fill in the module, title, and content
2. Add tags in the tags field (comma-separated)
3. Example tags: `python, programming, loops, control flow`

## Features

### Tag System
- **Multiple tags per note**: Add as many tags as needed
- **Partial matching**: Search "elect" to find "elective A", "elective B"
- **Case-insensitive**: "Python" = "python" = "PYTHON"

### Search Capabilities
- **By tags**: Filter notes with specific tags
- **By text**: Search in titles and content
- **By module**: Filter by course module
- **Combined**: Use all filters together

### Performance
- **Instant filtering**: Client-side search in MyNotes
- **Debounced search**: 300ms delay prevents excessive API calls
- **Result limit**: Maximum 100 results per search

## Common Use Cases

### Find Python notes
```bash
# CLI
npm run search -- --tags python

# Or in Web UI: Type "python" or click "python" tag
```

### Find SQL and database notes
```bash
# CLI
npm run search -- --tags sql,database

# Or in Web UI: Select both "sql" and "database" tags
```

### Find elective A materials
```bash
# CLI
npm run search -- --tags "elective A"

# Or in Web UI: Type "elective A" or select the tag
```

### Search specific module
```bash
# CLI
npm run search -- --module elec-a

# Or in Web UI: Use advanced filters → select module
```

## Testing

### Seed Test Data
```bash
npm run seed-search
```

This creates sample notes with tags for testing.

### Run Tests
See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing instructions.

## Documentation

- **[SEARCH_FUNCTIONALITY.md](./SEARCH_FUNCTIONALITY.md)** - Complete feature documentation
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing procedures
- **[SECURITY_SUMMARY.md](./SECURITY_SUMMARY.md)** - Security analysis
- **[README.md](./README.md)** - Main project documentation

## API Reference

### Search Endpoint
```
GET /api/knowledge/search?q=<query>&tags=<tags>&moduleId=<module>
```

**Parameters:**
- `q`: Text query (searches title, content, tags)
- `tags`: Comma-separated tags (e.g., "python,sql")
- `moduleId`: Module ID (e.g., "core-d", "elec-a")
- `userId`: User ID (auto-applied for non-admin)

### Tags Endpoint
```
GET /api/knowledge/tags
```

Returns all unique tags with usage count.

## Tips

1. **Use partial matching**: "elect" finds all elective modules
2. **Combine filters**: Use tags + text + module for precise results
3. **Check tag count**: Popular tags appear in suggestions
4. **Try CLI for bulk operations**: Faster for multiple searches
5. **Use debouncing**: Wait a moment after typing for better performance

## Troubleshooting

### No results found
- Check spelling of tags
- Try partial matching (e.g., "pyth" instead of "python")
- Clear filters and try again
- Verify notes have the tags you're searching for

### CLI tool not working
- Ensure MongoDB is running
- Check `.env` file has correct `MONGO_URI`
- Run `npm run seed-search` to create test data

### Search is slow
- Check internet connection
- Verify MongoDB is running locally
- Consider adding database indexes (see SECURITY_SUMMARY.md)

## Next Steps

1. **Create notes with tags** at `/knowledge/new`
2. **Try searching** at `/knowledge/search`
3. **Explore CLI tool** with `npm run search -- --help`
4. **Read full documentation** in linked files above

---

**Need Help?** Check the comprehensive documentation files or the main README.md
