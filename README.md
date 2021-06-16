# Chronograph Case Study

## Running this project

In order to run the JS code in the project, first clone it to your machine using `git clone https://github.com/UchuuKani/chronograph.git` and change into the created `chronograph` directory. Afterwards, you can install dependencies (Typescript) using `npm install`, and then run the project using `npm run dev`. This script will run two functions used to answer the first two questions asked in `Part 2` of the case study (files written using vanilla ES6+ Javascript are also available and can be run using `npm run devJS`).

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
- will we ever have to combine data from multiple types of comments, like report comments with document comments?

1. One approach we could take is to create a comments table for each type of existing table, such as a `report_comments` table, `document_comments` table where each of these tables has an INTEGER `id` column, `content` column of type TEXT to hold the text content for a comment, and a foreign key of type INTEGER to associate the `comment` with an entry in another table.

2. Another approach could be create a single table, `comments` that contains an INTEGER primary key, along with INTEGER columns for `report_id`, `document_id`, and `page_id` and associate a new comment with an entry in one of the tables by creating the `comment` row with the corresponding table ID, while leaving the other IDs as `NULL`. We would also include a row of type TEXT to hold the `content` of the comment.

3. Building off the second approach, we could create a table `comment_entity` that has a primary key `comment_entity_id` as INTEGER, and a `comment_type` as a string type that relates to the type of comment, such as `report`, `document`, or `page`. We could then set up a `comments` table that holds comments for all three tables with an INTEGER primary key `comment_id`, `comment_entity_id` to act as a foreign key also of type INTEGER, and then other columns such as `content`, potentially `user_id` if there are users associated with comments, etc.

I would probably not choose the second approach due to the `NULL` foreign keys, and in the end I would choose approach three over approach one to reduce the number of tables we would have to create, especially in the future in case we need to create comments for additional entities besdies `reports`, `pages`, and `documents`.

## Prompt 2

### Prompt 2, Question 1

Function name: `compileReportsWithPageCounts`

For this task, my approach was to restructure the data in the `store` object in order to more easily associate `reports` with `documents`, and `documents` with `page` counts. To this end, I first map each document ID to the number of pages in each document by iterating through all the pages and reading each `page.document_id`:

```js
let docToPagesCountMap = {
  34: 2,
  87: 1,
};
```

I then create a map between each report ID and the documents associated with it by iterating through all the `documents` and reading `document.report_id`:

```js
let reportToDocsMap = { 4: { 8: true }, 21: { 34: true, 87: true } };
```

Finally, I create the mapping between `reports` and number of pages by iterating through all reports, and for each document associated with that report as read from `reportToDocsMap`, look up the corresponding page count for that document in `docToPagesCountMap`. If a report has no pages associated with it, the report is listed in the output with a page count of 0.

### Prompt 2, Question 2

Function name: `keywordSearch`

We can check to make sure that the report associated with whatever `document` or `page` we are looking at is not already in our list of reports that match a search term before performing the search operation on the `document` or `page` since if the report is already included, we know that we will not add it to the list of reports again. To achieve this, I created an array `matchingReports` to hold the list of reports matching a search, and an object `addedReports` that keeps track of which reports have already been added to our list. An alternative to this could be to use a `Set` to track the report list, but I chose not to go this route since I am not sure how to serialize a `Set` as JSON which seems relevant in the follow up question.

First, iterate through reports and check if each `report.title` includes the search term. If a match is found, add that report to our list, as well as object so that we don't have duplicate reports in the output. Then iterate through documents and check if `document.name` matches the search term, and if the report associated with that document is absent in the current list - if both cases are true, add the report found with `document.report_id` to the list and object.

We then iterate through all reports and check if the search term can be found in `report.body` or `report.footnote`. If the term is found in either value, and the report associated with the page is not in the list already, we add the associated report to our list of reports, and then return the list.

Here, I assumed the `report.title` and `document.name` would not be large, maybe less than 100 characters, and that the `page.body` would take the longest time to search through, followed by `page.footnote` if it exists.

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

**B**: assuming our asynchronous call can fail with errors, we would want to handle them either using `.catch` when Promise chaining, or using a catch block when using `async/await` syntax. After doing so, we could update the front end to indicate that the search failed for whatever reason potentially depending on an error code or message returned by the API call. Maybe we would have some piece of state in our front end to keep track of back end errors, and we can update this state when receiving an error from the back end, or clear the state if the user takes some action after receiving the error.
