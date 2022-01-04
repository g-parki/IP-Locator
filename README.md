# IP-Locator
AWS Lambda API to provide information of an IP address. By default, this uses the your own IP address, though it can also accept any valid public IP address.

# API Documentation

### Base Path
`https://rwzr72akp3.execute-api.us-west-2.amazonaws.com/Prod/ip-locator`

### Query Parameters
| Parameter   | Description                                | Acceptable Values    | Default     |
| ----------- | -----------                                | -----------          | ----------- |
| `asjson`    | Returns IP info as JSON object if true     | 0, 1                 | 0           |
| `ip`        | Look up info for an IP other than your own | Any valid IP address | Your IP   |

Example: `https://rwzr72akp3.execute-api.us-west-2.amazonaws.com/Prod/ip-locator?asjson=1&ip=84.17.46.160`
