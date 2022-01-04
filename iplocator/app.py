import json
import requests

FIELDS = {
    'country': 'country',
    'city': 'city',
    'zip': 'zip',
    'lat': 'latitude',
    'lon': 'longitude',
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
            "body": {
                "message": "Cannot connect to ip-api.com",
                "error": e,
            },
        }

    if ip_info.get("status") == "fail":
        return {
            "statusCode": 200,
            "body": json.dumps(ip_info),
        }

    if props['as_json'] == "1":
        response = {FIELDS.get(key): ip_info.get(key) for key in FIELDS.keys()}
        response['ip'] = props["ip"]
        return {
            "statusCode": 200,
            "body": json.dumps(response),
        }
    else:
        field_string = lambda field: f"<p>{FIELDS.get(field).upper()}: {ip_info.get(field)}</p>"
        response = (
            f"<h2>YOUR IP IS: {props['ip']}</h2>" +
            "".join([field_string(field) for field in FIELDS.keys()])
        )
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "text/html; charset=utf-8"},
            "body": response,
        }