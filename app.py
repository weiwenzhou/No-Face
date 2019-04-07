from flask import Flask, render_template, request, session, url_for, redirect, flash, send_file
import os

app = Flask(__name__)
app.secret_key = os.urandom(32)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/data/population.csv')
def download_file():
    return send_file(os.path.join(os.getcwd(), 'data/population.csv'), attachment_filename='population.csv')

@app.route('/data/map.json')
def give_map():
    return send_file(os.path.join(os.getcwd(), 'data/map.json'), attachment_filename='map.json')

if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0")
