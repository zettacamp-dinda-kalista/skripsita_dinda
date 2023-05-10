import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

df = pd.read_csv("dataset.csv")
X = df["bug_description"]
y = df["dev_type"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

vectorizer = CountVectorizer(stop_words="english")
X_train = vectorizer.fit_transform(X_train)
X_test = vectorizer.transform(X_test)

clf = MultinomialNB()
clf.fit(X_train, y_train)

##########################################################################################################################

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api", methods=["POST"])
def api():
    try:
        body = request.get_json()

        desc = body["bug_description"]
        desc = vectorizer.transform([desc])

        pred = clf.predict(desc)
        pred = "BackEnd" if pred[0] > 0 else "FrontEnd"

        resp = jsonify({ "dev_type": pred })
        resp.status_code = 200

        return resp

    except KeyError as e:
        resp = jsonify({ "error": f"Invalid request: Missing {e} field!" })
        resp.status_code = 400

        return resp

    except Exception as e:
        resp = jsonify({ "error": f"Internal server error: '{str(e)}'" })
        resp.status_code = 500

        return resp

if __name__ == "__main__":
    app.run(debug=True)