# Chronograph Case Study

## Running this project

In order to run the JS code in the project, first clone it to your machine using `git clone https://github.com/UchuuKani/chronograph.git` and change into the directory. Afterwards, you can install dependencies using `npm install`, and then run the project using `npm run dev`. This script will run two functions used to answer the first two questions asked in `Part 2` of the case study.

There are also scripts to run database operations to generate the schema outlined in `Appendix A` and seed it with data (`npm run seed`), and perform the queries asked by the case study in `Part 1` (`npm run queryOne` and `npm run queryTwo`)

## Assumptions about database

Besides the assumptions given in `Part 1` of the case study, I am also assuming that there will be a similar amount of read and write operations made to the database, and that there are no indexes set on any foreign keys or non-primary key columns.

### Prompt 1, Question 1

My approach here was to use `NOT EXISTS` to exclude rows where a `page` and a `document` could be mapped together.

We could alternatively use an approach where we use a left join on `documents` and `pages`, and exclude any rows where a page ID does not exist to achieve the same result.

### Prompt 1, Question 2

The approach here was was to join `reports`, `documents`, and `pages` together using inner joins to exclude reports that do not have pages, and then group by report ID and count the number of rows associated with each report.

### Prompt 1, Question 3

Some considerations include:

- is there a `users` table that each `comment` needs to be associated with?
- each table `pages`, `documents` and `documents` would have a one-to-many relationship with associated `comments` - each table can have many comments, one comment canoot belong to multiple tables
- if we were to delete a row in either `reports`, `documents`, or `pages`, we would want to delete any comments associated with that entry

One approach we could take is to create a comments table for each type of existing table, such as a `report_comments` table, `document_comments` table where each of these tables has an INTEGER `id` column, `content` column of type TEXT to hold the text content for a comment, and a foreign key of type INTEGER to associate the `comment` with an entry in another table.

Another approach could be create a single table, `comments` that contains an INTEGER primary key, along with INTEGER columns for `report_id`, `document_id`, and `page_id` and associate a new comment with an entry in one of the tables by creating the `comment` row with the corresponding table ID, while leaving the other IDs as `NULL`. We would also include a row of type TEXT to hold the `content` of the comment.

---

## Assumptions about data store

- `determineNumberPagesInReport` function was first attempt at prompt 2, question 1 - for each report, iterate through all documents and find all related to a given report and create a map of `{documentId: true}` for every `document` related to a report. Then iterate through all `pages`, and if a page is found in that `document` map, increment a variable to indicate we found a page related to a document
  - problem is, for every report we'd iterate through all documents and pages once
  - want to reduce the number of times we'd need to iterate through `documents` and `pages` data since I am assuming there'd be many documents associated with a report, and many more pages associated with a single document
  - idea is to create a data structure by accessing `documents` and `pages` once, and then using that data structure to determine number of pages for a single report in constant time look up, or at least improve efficiency somewhat so we don't have to loop through all documents and all reports every time

One note I have: regarding `prompt 2, question 1`, this seems like an operation more suited for the DB to handle since RDBMS are definitely better at these types of operations than JS, especially for larger data sets. JS better for handling IO tasks like making many db calls concurrently

- from my perspective, if this `prompt 2, question 1` is being run on the front end of some application, we should let the db handle this operation if the size of the data set is large (as to what "large" might be, I am unsure at the moment) - might be faster to let the db handle this on the backend depending on size. I assume `prompt 2, question 3`, while not directly addressing `prompt 2, question 1` sort of acknowledges this by asking how we'd transform a seemingly heavy task using JS to a task that is delegated to an API call instead

  - and if the data set isn't that large (what is considered "large" still not known) and we are doing this computation on the frontend, then the implementation for `prompt 2, question 1` might not matter so much from a performance perspective. Would want to wait to know that this operation is a performance bottle neck before trying to optimize it further, as the performance bottle neck on the front end may come from slow or unneccesary renders, or some other source.
  - if trying to handle `prompt 2, question 1` on the back end in some `node/express` api or `rails`, the db still seems like the better choice to handle this type of computation

- I have a similar intuition for `prompt 2, question 1` - if trying to perform a string search on millions of records using JS that could otherwise be handled by our db or some other data store, it'd be more efficient to let the db do this computation which relates to `prompt 2, question 3`

### Prompt 2, Question 2

We can check to make sure that the report associated with whatever `document` or `page` we are looking at is not already in our list of reports that match a search term before performing the search operation on the `document` or `page` since if the report is already included, we know that we will not add it to the list of reports again

### Prompt 2, Question 3

**A**: If converting the function in `Question 2` to an asynchronous function call that returns data from an API endpoint, we could write a reusable function for fetching where one change to the call signature could be adding an additional parameter to represent the url/endpoint we would be fetching from (where we could add our search term to the url). We could also add another parameter representing an options object we may want to use to configure our request with with headers or a request body.

Another option could be to code the endpoint and options object into the body of the function itself so that the call signature of the function would still have only one parameter representing the term we would want to search for. It might be less reusable in this case, but we would not need to pass as many arguments. Alternatively, we wrap the first described function in order to produce this function. In both cases, the return value could be a `Promise` that we could `then` chain off of or use `async/await` syntax with.

An example of the first signature:

```js
// we could pass a url like `/api/search?term=${searchTerm}`
function customFetch(url, options) {
  // ...
}

customFetch(someUrl, optionsObj)
  .then((data) => {
    // perform some state update with the data
  })
  .catch((err) => {
    console.error(err);
    // handle the error
  });

(async () => {
  try {
    let searchResults = await customFetch(someUrl, optionsObj);
    // perform some state update with searchResults
  } catch (err) {
    console.error(err);
    // handle the error
  }
})();
```

An example of the second signature without using `customFetch`:

```js
// we would only pass in the searchTerm
function performSearch(searchTerm) {
  // ...
}
```

An example where we wrap our first function:

```js
function performSearch(searchTerm) {
  let requestOptions = {
    // ...
  };
  return customFetch(`/api/search?term=${searchTerm}`, requestOptions);
}
```

**B**: assuming our asynchronous call can fail with errors, we would want to handle them either using `.catch` when Promise chaining, or using a catch block when using `async/await` syntax. After doing so, we could update the front end to indicate that the search failed for whatever reason potentially depending on an error code or message returned by the API call. Maybe we would have some piece of state in our front end to keep track of back end errors, and we can update this state when receving an error from the back end, or clear the state if the user takes some action after receiving the error.
