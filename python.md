# Python Integration Notes

## Test the Python Setup

1. Download and install [Python 3.9.4](https://www.python.org/downloads/)

    * If you are unfamiliar working with Python in VS Code, follow the instructions in the [VS Code Python Tutorial](https://code.visualstudio.com/docs/python/python-tutorial) to get your initial dev environment setup.

2. From the root directory of this repository, execute the following:

    ```py
    py -3 -m venv .pyenv
   .pyenv\scripts\activate

    py -m pip install -r requirements.txt
    ```

3. From two separate integrate terminal sessions, run the following:

    **Terminal 1**
    ```pwsh
    yarn start:server
    ```

    **Terminal 2**
    ```pwsh
    yarn start:data
    ```

4. Navigate to http://localhost:5050

    * This will execute the Cerebro `search-customers` query with the term `sports`, which you may need to create:

        ```json
        {
            "name": "search-customers",
            "server": ".\\DevSql",
            "database": "AdventureWorksLT2019",
            "value": "select\n  c.CustomerID as 'customerId',\n  c.Title as 'title',\n  c.LastName as 'lastName',\n  c.FirstName as 'firstName',\n  c.CompanyName as 'companyName',\n  c.EmailAddress as 'emailAddress',\n  c.Phone as 'phone'\nfrom SalesLT.Customer as c\nwhere\n  c.Title like '%[search]%' or\n  c.LastName like '%[search]%' or\n  c.FirstName like '%[search]%' or\n  c.CompanyName like '%[search]%' or\n  c.EmailAddress like '%[search]%' or\n  c.Phone like '%[search]%'",
            "editorFont": "Cascadia Code",
            "editorFontSize": 14,
            "editorTabSpacing": 2
        }
        ```

    * To provide your own query, simply add it as the route parameter, i.e. - http://localhost:5050/supply will specify `search:supply` in the Cerebro query.

## Notes

* `requests` library needed for executing HTTP requests inside of Python.
* `python-dotenv` library is needed to work with the `.env` environment variable file at the root of this repository.
    * This is what lets the `yarn start:data` script know where to find the FLASK_APP environment variable.
