from flask import Flask, request
from fpdf import FPDF

app = Flask(__name__)

@app.route('/create_document', methods=['POST'])
def create_document():
    text = request.json.get('text')

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(40, 10, text)

    pdf_output = io.BytesIO()
    pdf.output(pdf_output, 'F')

    pdf_output.seek(0, 0)
    return send_file(pdf_output, mimetype='application/pdf')

if __name__ == '__main__':
    app.run(port=5001)