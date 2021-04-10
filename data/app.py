import requests
from flask import Flask, jsonify

app = Flask(__name__)

QUERY_URL = 'http://localhost:5000/api/query/getQuery/search-customers'
SEARCH_URL = 'http://localhost:5000/api/query/executeQueryWithProps/search:'

@app.route("/")
def home():
  return query('sports')

@app.route("/<search>")
def query(search):
  data = requests.get(QUERY_URL)
  query = data.json()

  search = requests.post(f'{SEARCH_URL}{search}', json=query)
  results = search.json()

  return jsonify(results)
