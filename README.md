**wspost** is stupid simple HTTP POST -> WebSocket gateway.
It's using [JWT](http://jwt.io/) authorization, but doesn't store any data.


Installation
============

```
npm i wspost -g
```

Generating channel token
=============

You need to define your secret key and generate first channel token.
You can set it in ENV or in app parameter.

```bash
export SECRET_KEY='< change me >'
wspost --gentoken example

```

Token can be also easily generated in third party app running on different server and written in other language.
The only thing you will need are:
- [JWT library](http://jwt.io/#libraries-io)
- configuration with the same `SECRET_KEY`
- [payload](http://jwt.io/introduction/#header) with claim _channel_

```json
{
  "channel": "example"
}
```

Starting a server
=================
There is only one port open for both, HTTP POST and WebSocket communication.
By default it listens on port 3000, bout you can change it form command line or ENV variable `PORT`.

```bash
export SECRET_KEY='< change me >'
wspost --listen
```

Sending a message
=================

Message delivery can be easily tested with [cURL](https://en.wikipedia.org/wiki/CURL).

Try to open [localhost:3000/example.html](http://localhost:3000/example.html) in your browser and wait for a message.

Token which you generated before is used as endpoint URL.

```bash
TOKEN=$(wspost --gentoken example)
curl -d something=123 localhost:3000/broadcast/$TOKEN
```
