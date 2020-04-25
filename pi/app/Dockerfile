FROM ubuntu:16.04

# Update image
SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt-get install -y --no-install-recommends libcurl4-openssl-dev python3-pip python3 libboost-python-dev python3-dev

RUN pip3 install --upgrade setuptools

RUN pip3 install -U pipenv

RUN mkdir -p app
WORKDIR /app
COPY ./Pipfile ./Pipfile.lock /app/
RUN LC_ALL=C.UTF-8 LANG=C.UTF-8 pipenv install --system

COPY . /app/

CMD ["python3", "-u", "./main.py"]
