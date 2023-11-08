# roni-analytics-be
1. Clone this repo
2. Move to this directory
3. Run npm i to install packages
  command
```bash
 npm install
```
5. Add .env file in this directory
6. Add these secrets to the .env file 
   ```NODE_ENV=development,DB_USERNAME,
   DB_PASSWORD,
   DB_NAME,
   DB_HOST (ex- localhost),
   DIALECT (ex-mysql),
   DB_PORT (ex- 3306),
   PORT (ex-3030)
   ```
7. Run npm run dev to start development server

This backend will going to start on http://localhost:3030/

NOTE:-----  Hit http://localhost:3030/currency/create to create sample currencies inside databaase


# API Documentation



### Endpoint

`GET /currency/create`

Creates currencies based on the provided data.

## Introduction

This API allows for the creation of currencies using data provided in a predefined format.


### Request

- Method: `GET`

### Response Format

The API will return a JSON response with the following properties:

- `message` (string): Indicates the status of the request.
- `data` (array of objects): Contains information about the currencies created.

### Example Request

```http
GET /currency/create
```

### Example Response

```
{
    "message": "Currencies created successfully",
    "data": [
        {
            "name": "Bitcoin",
            "symbol": "bitcoin",
            "binanceSymbol": "btcusdt",
            "updatedAt": "2023-11-08T09:40:32.599Z",
            "createdAt": "2023-11-08T09:40:32.599Z"
        },
        {
            "name": "Solana",
            "symbol": "solana",
            "binanceSymbol": "solusdt",
            "updatedAt": "2023-11-08T09:40:32.612Z",
            "createdAt": "2023-11-08T09:40:32.612Z"
        },
        {
            "name": "Ethereum",
            "symbol": "ethereum",
            "binanceSymbol": "ethusdt",
            "updatedAt": "2023-11-08T09:40:32.617Z",
            "createdAt": "2023-11-08T09:40:32.617Z"
        }
    ]
}
```

### Error Responses

`400 Bad Request`: If an error occurs while creating currencies.

```
{
  "message": "Something went wrong while creating currencies"
}
```


<br>
<br>
<br>
<br>
<br>

### Endpoint

`GET /crypto/:symbol/history`

Retrieves historical price data for a specified symbol within a given date range.

## Introduction

This API provides historical price data for a given symbol within a specified date range.

### Request Parameters

- `symbol` (string, required): The unique identifier for the currency.
- `from` (number, required): The start date timestamp in milliseconds.
- `to` (number, required): The end date timestamp in milliseconds.

### Response Format

The API will return a JSON response with the following properties:

- `message` (string): Indicates the status of the request.
- `data` (array of objects): Contains historical price data with timestamps.

### Example Request

```http
GET /crypto/bitcoin/history?from=1662096000000&to=1662768000000
```

### Example Response

```
{
  "message": "Data fetched successfully",
  "data": [
    {
      "price": 65000,
      "timestamp": "2022-12-31 12:00"
    },
    {
      "price": 60000,
      "timestamp": "2023-01-01 00:00"
    },
    // Additional data points...
  ]
}
```
### Error Responses
`400 Bad Request`: If any of the required parameters (symbol, from, to) are missing in the request.

```
{
  "message": "Missing required parameters (symbol, from, or to)"
}
```

`400 Bad Request`: If an error occurs while fetching prices.
```
{
  "message": "Something went wrong while fetching prices"
}
```
