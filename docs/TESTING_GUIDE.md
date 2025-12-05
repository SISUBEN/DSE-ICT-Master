# Testing Guide for Tag-Based Search Functionality

This guide provides step-by-step instructions for testing the search functionality implementation.

## Prerequisites

1. MongoDB running (local or Docker)
2. Node.js 18+ and npm installed
3. Dependencies installed (`npm install`)

## Setup Test Environment

### 1. Start MongoDB

**Option A: Using Docker**
```bash
docker run -d -p 27017:27017 --name dse-ict-mongodb mongo:latest
```

**Option B: Local MongoDB**
```bash
mongod --dbpath /path/to/data/db
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dse-ict-master
```

### 3. Seed Test Data

Run the seeding script to create sample knowledge points with tags:
```bash
npm run seed-search
```

This creates 8 sample notes with various tags including:
- python (4 notes)
- sql (3 notes)
- database (3 notes)
- elective A (3 notes)
- excel (1 note)
- networking (1 note)

## Testing Scenarios

### Test 1: API Endpoint Testing

#### 1.1 Start the Backend Server
```bash
npm run server
```

#### 1.2 Test Search API

**Search by tag:**
```bash
curl "http://localhost:5000/api/knowledge/search?tags=python"
```

**Expected Result:** Returns all notes tagged with "python"

**Search by multiple tags:**
```bash
curl "http://localhost:5000/api/knowledge/search?tags=python,database"
```

**Expected Result:** Returns notes that have any of the specified tags

**Search by text query:**
```bash
curl "http://localhost:5000/api/knowledge/search?q=normalization"
```

**Expected Result:** Returns notes containing "normalization" in title, content, or tags

**Partial tag matching:**
```bash
curl "http://localhost:5000/api/knowledge/search?tags=elect"
```

**Expected Result:** Returns notes with tags like "elective A", "elective B", "elective C"

**Case-insensitive search:**
```bash
curl "http://localhost:5000/api/knowledge/search?tags=PYTHON"
curl "http://localhost:5000/api/knowledge/search?q=SQL"
```

**Expected Result:** Returns same results as lowercase queries

#### 1.3 Test Tags API

```bash
curl "http://localhost:5000/api/knowledge/tags"
```

**Expected Result:** JSON array of all unique tags with count:
```json
[
  { "tag": "python", "count": 4 },
  { "tag": "sql", "count": 3 },
  { "tag": "database", "count": 3 }
]
```

### Test 2: CLI Search Tool Testing

#### 2.1 Basic Tag Search
```bash
npm run search -- --tags python
```

**Expected Output:**
- List of 4 Python-related notes
- Displays title, module, tags, author, date
- Shows content preview

#### 2.2 Multiple Tags
```bash
npm run search -- --tags python,sql
```

**Expected Output:**
- Combined results from both python and sql tags

#### 2.3 Partial Matching
```bash
npm run search -- --tags elect
```

**Expected Output:**
- Notes with "elective A", "elective B", etc.

#### 2.4 Text Query
```bash
npm run search -- --query "database design"
```

**Expected Output:**
- Notes containing "database design" in any field

#### 2.5 Module Filter
```bash
npm run search -- --module elec-a
```

**Expected Output:**
- Only notes from elective A module

#### 2.6 Combined Filters
```bash
npm run search -- --tags python --module core-d --limit 3
```

**Expected Output:**
- Maximum 3 results
- Only from core-d module
- Only tagged with python

#### 2.7 Help Command
```bash
npm run search -- --help
```

**Expected Output:**
- Usage instructions
- Available options
- Examples

### Test 3: Web UI Testing

#### 3.1 Start Development Server
```bash
npm run dev
```

Access the application at `http://localhost:5173`

#### 3.2 Login
1. Navigate to login page
2. Create account or login with test account
3. Verify successful login

#### 3.3 Test MyNotes Component (Personal Search)

**Navigate to:** `/knowledge/manage`

**Test Cases:**

1. **Empty Search**
   - Verify all notes are displayed
   - Check note count

2. **Text Search**
   - Type "python" in search box
   - Verify instant filtering (no page reload)
   - Check result count updates

3. **Tag Filtering**
   - Click on a tag button (e.g., "python")
   - Verify tag button highlights
   - Verify filtered results
   - Click tag again to deselect

4. **Multiple Tag Filtering**
   - Select multiple tags
   - Verify only notes with ALL selected tags shown
   - Check filter summary

5. **Combined Search and Tag Filter**
   - Type text query
   - Select tags
   - Verify both filters apply

6. **Clear Filters**
   - Apply multiple filters
   - Click "清除篩選" (Clear Filters)
   - Verify all filters reset
   - Verify all notes shown again

7. **Empty Results**
   - Search for non-existent tag
   - Verify "No results" message
   - Verify clear filters button appears

8. **Tag Highlighting**
   - Select a tag
   - Verify selected tag has purple background
   - Verify matching tags in results highlighted

#### 3.4 Test SearchKnowledge Component (Global Search)

**Navigate to:** `/knowledge/search`

**Test Cases:**

1. **Initial State**
   - Verify welcome message shown
   - Verify popular tags displayed
   - Click popular tag
   - Verify search executes

2. **Search Box**
   - Type "python"
   - Wait 300ms (debounce)
   - Verify API call made
   - Verify results displayed

3. **Advanced Filters Toggle**
   - Click "進階篩選" (Advanced Filters)
   - Verify filters expand
   - Verify chevron icon rotates

4. **Module Filter**
   - Expand advanced filters
   - Select module from dropdown
   - Verify filtered results

5. **Tag Selection**
   - View popular tags list
   - Click multiple tags
   - Verify each adds to filter
   - Verify result count updates

6. **Search Results Display**
   - Verify each result shows:
     - Module badge
     - Tags
     - Title
     - Content preview
     - Author
     - Date
   - Click result card
   - Verify navigates to detail page

7. **Highlighted Matches**
   - Type text query
   - Verify matching text highlighted in yellow

8. **Loading State**
   - Type query
   - Verify "搜索中..." message during API call

9. **Empty Results**
   - Search for impossible combination
   - Verify empty state message
   - Verify clear filters button

10. **Clear All Filters**
    - Apply multiple filters
    - Click "清除所有篩選" (Clear All Filters)
    - Verify all filters reset

#### 3.5 Test Navigation Integration

1. **Header Menu - Desktop**
   - Verify "搜索筆記" link visible (when logged in)
   - Click link
   - Verify navigates to search page

2. **Header Menu - Mobile**
   - Resize browser to mobile width
   - Open hamburger menu
   - Verify "搜索筆記" link present
   - Click link
   - Verify navigation works

3. **Create & Manage Dropdown**
   - Click "創作與管理" dropdown
   - Verify "搜索筆記" option present
   - Click option
   - Verify navigation works

### Test 4: Integration Testing

#### 4.1 Create Note with Tags
1. Navigate to `/knowledge/new`
2. Fill in form with:
   - Module: core-d
   - Title: "Test Note for Search"
   - Content: "This is test content with Python code"
   - Tags: "python, test, search"
3. Click "發布筆記"
4. Navigate to search page
5. Search for "python"
6. Verify new note appears

#### 4.2 Edit and Re-search
1. Create note with specific tags
2. Search for those tags
3. Verify note found
4. Edit note (if edit feature exists)
5. Change tags
6. Re-search
7. Verify results updated

#### 4.3 Delete and Re-search
1. Search for specific note
2. Verify it appears
3. Delete the note
4. Re-search
5. Verify note no longer appears

### Test 5: Performance Testing

#### 5.1 Debouncing
1. Open browser dev tools
2. Go to Network tab
3. Type quickly in search box
4. Verify only ONE API call made after 300ms pause

#### 5.2 Large Result Sets
1. Create many notes with same tag
2. Search for that tag
3. Verify results display quickly
4. Check 100-result limit enforced

#### 5.3 Concurrent Searches
1. Open multiple browser tabs
2. Perform different searches in each
3. Verify each returns correct results
4. No cross-contamination

### Test 6: Error Handling

#### 6.1 No Database Connection
1. Stop MongoDB
2. Try searching
3. Verify graceful error handling
4. Check console for error messages

#### 6.2 Invalid Query Parameters
```bash
curl "http://localhost:5000/api/knowledge/search?tags="
```
- Should return all results (empty filter)

#### 6.3 Special Characters
- Search for: `python"'<>`
- Verify no injection errors
- Verify safe handling

### Test 7: Browser Compatibility

Test the web UI in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Test 8: Accessibility

1. **Keyboard Navigation**
   - Tab through search interface
   - Verify all interactive elements reachable
   - Test Enter key on buttons

2. **Screen Reader**
   - Use screen reader (NVDA/JAWS/VoiceOver)
   - Verify search fields announced
   - Verify results readable

3. **High Contrast Mode**
   - Enable high contrast
   - Verify text readable
   - Verify controls visible

## Validation Checklist

After completing all tests, verify:

- [ ] API endpoints return correct data
- [ ] Partial matching works (case-insensitive)
- [ ] Multiple tags can be searched simultaneously
- [ ] CLI tool works with all parameter combinations
- [ ] Web UI search is instant and responsive
- [ ] Debouncing reduces API calls
- [ ] Filters can be cleared
- [ ] Empty states display correctly
- [ ] Search results are accurate
- [ ] Navigation integration works
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Documentation is accurate

## Common Issues and Solutions

### Issue: Search returns no results
**Solution:**
- Verify test data seeded: `npm run seed-search`
- Check user is logged in
- Verify MongoDB connection
- Check tags are properly formatted

### Issue: CLI tool doesn't connect
**Solution:**
- Check `.env` file exists
- Verify MONGO_URI is correct
- Ensure MongoDB is running
- Check network connectivity

### Issue: Debouncing not working
**Solution:**
- Check browser console for errors
- Verify 300ms timeout set correctly
- Clear browser cache
- Test in incognito mode

### Issue: Tags not showing
**Solution:**
- Verify notes have tags assigned
- Check `/api/knowledge/tags` endpoint
- Clear browser cache
- Check network requests in dev tools

## Test Data Cleanup

To clean up test data and re-seed:

```bash
# Connect to MongoDB
mongo dse-ict-master

# Delete test user's notes
db.knowledgepoints.deleteMany({ author: ObjectId("test_user_id") })

# Re-seed
npm run seed-search
```

## Reporting Issues

When reporting issues, include:
1. Test scenario being executed
2. Expected behavior
3. Actual behavior
4. Screenshots/console logs
5. Browser/environment details
6. Steps to reproduce

## Conclusion

Complete all test scenarios to ensure the search functionality works as expected. Document any issues found and verify fixes before deployment.
