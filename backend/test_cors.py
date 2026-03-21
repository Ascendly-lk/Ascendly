import requests
try:
    print("Testing CORS for http://localhost:5173")
    r1 = requests.options("http://localhost:8000/api/patent-firm/dashboard/stats", headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "GET"
    })
    print(r1.status_code, r1.headers.get("access-control-allow-origin"))

    print("Testing CORS for http://localhost:5174")
    r2 = requests.options("http://localhost:8000/api/patent-firm/dashboard/stats", headers={
        "Origin": "http://localhost:5174",
        "Access-Control-Request-Method": "GET"
    })
    print(r2.status_code, r2.headers.get("access-control-allow-origin"))

    print("Testing CORS for http://127.0.0.1:5173")
    r3 = requests.options("http://localhost:8000/api/patent-firm/dashboard/stats", headers={
        "Origin": "http://127.0.0.1:5173",
        "Access-Control-Request-Method": "GET"
    })
    print(r3.status_code, r3.headers.get("access-control-allow-origin"))
except Exception as e:
    print("Error:", e)
