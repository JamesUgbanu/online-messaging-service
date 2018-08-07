import os
from flask import Flask, render_template, request, jsonify, flash, redirect,url_for
from flask_session import Session
from flask import session

from flask_socketio import SocketIO, emit
import string
import random
import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.secret_key = 'b_5#y2L"F4Q8zK]/'
socketio = SocketIO(app)


channels = {'user': [], 'channel': [{"channel_id": "XY8YE", "name": "General"}], "message": []}
#messages = {"message": [{"channel_id": 7, "text": "message", "time": '12.00'}]}

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

@app.route("/")
def index():
    return render_template("registration.html")

@app.route("/register", methods=["POST"])
def register():
    displayName = request.form.get("display_name")
    count = len(channels["user"])
    channel_id = "XY8YE"
    if count == 0:
        user = {"user_id": count + 1, "display_name": displayName}
        channels["user"].append(user)
        return redirect(url_for("messages", channel_id=channel_id))
    else:
        for value in channels["user"]:
            if value["display_name"] == displayName:
                error = "Display name already exist"
                return render_template("registration.html", error=error)
        user = {"user_id": count + 1, "display_name": displayName}
        channels["user"].append(user)
        return redirect(url_for("messages", channel_id=channel_id))




@app.route("/messages/<string:channel_id>")
def messages(channel_id):
    messages = list(filter(lambda x: x["channel_id"] == channel_id, channels["message"]))
    #
    return render_template("index.html", channels=channels, channel_id=channel_id, messages=messages)


@app.route("/channel", methods=["POST"])
def channel():
    # Query for channel input
    channelname = request.form.get("channel")
    random = id_generator()

    for value in channels["channel"]:
        if value["name"] == channelname:
            return jsonify({"error": "Display name already exist"})
    item = {"channel_id": random, "name": channelname}
    channels["channel"].append(item)
    return jsonify(item)


@app.route("/message", methods=["POST"])
def chat():
    # Query for message input
    channel_id = request.form.get("channel-id")
    now = datetime.datetime.now()
    text = request.form.get("message")
    displayname = request.form.get("display-name")

    if len(channels["message"]) >= 3:
        channels["message"].pop(0)

    output = {"channel_id": channel_id, "text": text, "time": now, "displayName": displayname}
    channels["message"].append(output)
    return jsonify(output)


@socketio.on("message added")
def broadcast(data):
    emit("display message", data, broadcast=True)



if __name__ == "__main__":
    app.run()
