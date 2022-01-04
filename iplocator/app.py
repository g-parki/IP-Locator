import json
import requests

FIELDS_ALIAS = {
    'country': 'country',
    'city': 'city',
    'zip': 'zip',
    'lat': 'latitude',
    'lon': 'longitude',
    'region': 'region',
    'regionName': 'regionName',
    'isp': 'isp',
}

headers = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": True,
}

def lambda_handler(event, context):
    """ Looks up information of IP address from HTTP request

    """

    props = {
        "as_json": '0',
        "ip": event["requestContext"]["identity"]["sourceIp"],
    }

    query_str = event['queryStringParameters']
    if query_str is not None:
        props["as_json"] = query_str.get('asjson', props["as_json"])
        props["ip"] = query_str.get('ip', props["ip"])

    try:
        ip_info = requests.get(f"http://ip-api.com/json/{props['ip']}").json()
    except requests.RequestException as e:
        print(e)
        return {
            "statusCode": 200,
            "headers": headers,
            "body": {
                "message": "Cannot connect to ip-api.com",
                "error": e,
            },
        }

    if ip_info.get("status") == "fail":
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(ip_info),
        }

    if props['as_json'] == "1":
        response = {FIELDS_ALIAS.get(key): ip_info.get(key) for key in FIELDS_ALIAS.keys()}
        response['ip'] = props["ip"]
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(response),
        }
    else:
        field_string = lambda field: f"<p>{FIELDS_ALIAS.get(field).upper()}: {ip_info.get(field)}</p>"
        response = (
            f"<h2>YOUR IP IS: {props['ip']}</h2>" +
            "".join([field_string(field) for field in FIELDS_ALIAS.keys()])
        )
        headers["Content-Type"] = "text/html; charset=utf-8"
        return {
            "statusCode": 200,
            "headers": headers,
            "body": response,
        }