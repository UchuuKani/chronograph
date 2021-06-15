# Chronograph Case Study

## Assumptions about database

- asd
- foo
- bar

### Prompt 1, Question 1

### Prompt 1, Question 2

### Prompt 1, Question 3

- is there a `users` table that each comment needs to be tied to?
- each table `pages`, `documents` and `documents` would have a one-to-many relationship with associated `comments` - each table can have many comments, one comment canoot belong to multiple tables

---

## Assumptions about data store

- foo
- bar
- baz
- `determineNumberPagesInReport` function was first attempt at prompt 2, question 1 - for each report, iterate through all documents and find all related to a given report and create a map of `{documentId: true}` for every `document` related to a report. Then iterate through all `pages`, and if a page is found in that `document` map, increment a variable to indicate we found a page related to a document
  - problem is, for every report we'd iterate through all documents and pages once
  - want to reduce the number of times we'd need to iterate through `documents` and `pages` data since I am assuming there'd be many documents associated with a report, and many more pages associated with a single document
  - idea is to create a data structure by accessing `documents` and `pages` once, and then using that data structure to determine number of pages for a single report in constant time look up, or at least improve efficiency somewhat so we don't have to loop through all documents and all reports every time

One note I have: regarding `prompt 2, question 1`, this seems like an operation more suited for the DB to handle since RDBMS are definitely better at these types of operations than JS, especially for larger data sets. JS better for handling IO tasks like making many db calls concurrently

- from my perspective, if this `prompt 2, question 1` is being run on the front end of some application, we should let the db handle this operation if the size of the data set is large (as to what "large" might be, I am unsure at the moment) - might be faster to let the db handle this on the backend depending on size. I assume `prompt 2, question 3`, while not directly addressing `prompt 2, question 1` sort of acknowledges this by asking how we'd transform a seemingly heavy task using JS to a task that is delegated to an API call instead

  - and if the data set isn't that large (what is considered "large" still not known) and we are doing this computation on the frontend, then the implementation for `prompt 2, question 1` might not matter so much from a performance perspective. Would want to wait to know that this operation is a performance bottle neck before trying to optimize it further, as the performance bottle neck on the front end may come from slow or unneccesary renders, or some other source.
  - if trying to handle `prompt 2, question 1` on the back end in some `node/express` api or `rails`, the db still seems like the better choice to handle this type of computation

- I have a similar intuition for `prompt 2, question 1` - if trying to perform a string search on millions of records using JS that could otherwise be handled by our db or some other data store, it'd be more efficient to let the db do this computation which relates to `prompt 2, question 3`
