FROM python:3.5
ENV PYTHONUNBUFFERED 1

RUN pip3 install -U pipenv

RUN mkdir -p app
WORKDIR /app

COPY ./Pipfile ./Pipfile.lock /app/
RUN pipenv install --system

COPY . /app/

CMD [ "python", "./main.py" ]
