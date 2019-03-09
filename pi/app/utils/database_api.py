import requests
from config import API_ENDPOINT, API_TOKEN

def upload(data):
  url = "{}/pi/upload".format(API_ENDPOINT)
  headers = {"Authorization": "Bearer {}".format(API_TOKEN)}
  response = requests.post(url, data=data, headers=headers)
  return response
