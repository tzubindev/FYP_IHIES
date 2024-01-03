# predict.py

from joblib import load
import sys
import json
import warnings

# Suppress warnings
warnings.filterwarnings("ignore", category=UserWarning)

try:
    # Load the Random Forest classifier
    classifier = load('./AI_Asset/cl.joblib')

    # Get input data from Node.js
    input_data = json.loads(sys.argv[1])
    
    # Make predictions
    predictions = classifier.predict(input_data)

    # Return predictions to Node.js as a JSON string
    result = json.dumps(predictions.tolist())
    print(result)  # Print the result

except Exception as e:
    print(json.dumps({"error": str(e)}))
