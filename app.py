
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS

# إعدادات API key الخاصة بـ OpenAI
openai.api_key = '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'  # قم بإدخال مفتاح API الخاص بك هنا

app = Flask(__name__)

# تمكين CORS لجميع المسارات
CORS(app, resources={r"/chat": {"origins": "*"}})

# وظيفة معالجة المدخلات من المستخدم وتوليد الردود باستخدام GPT-3.5 أو GPT-4
def get_gpt_response(user_message):
    try:
        # استخدام `openai.ChatCompletion.create` مع الرسائل الموجهة لتقديم نصائح مالية وبنك الإنماء
        response = openai.ChatCompletion.create(
            model="gpt-4",  # اختر النموذج الذي تريده مثل gpt-3.5-turbo أو gpt-4
            messages=[
                {"role": "system", "content": 
                    "أنت مستشار مالي متحيز لبنك الإنماء. تقدم نصائح تعليمية مالية عامة حول إدارة الأموال، الاستثمار، الادخار، التمويل الشخصي، والخدمات المصرفية، مع تركيز على منتجات وخدمات بنك الإنماء."},
                {"role": "user", "content": user_message}  # الرسالة المرسلة من المستخدم
            ],
            max_tokens=200,
            temperature=0.7
        )
        return response['choices'][0]['message']['content'].strip()  # استخراج الرد بشكل صحيح
    except Exception as e:
        print(f"Error with OpenAI API: {e}")
        return f"حدث خطأ أثناء الاتصال بـ OpenAI: {str(e)}"

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message')
        if user_message:
            bot_response = get_gpt_response(user_message)
            return jsonify({'response': bot_response})
        else:
            return jsonify({'error': 'No message provided'}), 400
    except Exception as e:
        print(f"Error in processing request: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    print("Starting the Flask server...")
    try:
        app.run(debug=True, port=5000)  # تأكد من تشغيل الخادم على المنفذ 5000
    except Exception as e:
        print(f"Error: {e}")
