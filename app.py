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

if __name__ == "__main__":
    app.debug = True
    app.run()
