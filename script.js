let conversationHistory = [];
let userData = { income: null, savingGoal: null };

// === دوال إظهار وإخفاء مؤشر الكتابة ===
function showTyping() {
    hideTyping(); // نحذف أي مؤشر قديم
    const typingHTML = "<p id='typing-indicator'><em>مدرب الذكاء المالي يكتب...</em></p>";
    // نضيف المؤشر بعد آخر رسالة
    document.getElementById('chat-box').innerHTML += typingHTML;
    document.getElementById('phone-chat-box').innerHTML += typingHTML;
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
    document.getElementById('phone-chat-box').scrollTop = document.getElementById('phone-chat-box').scrollHeight;
}
function hideTyping() {
    const indicators = document.querySelectorAll('#typing-indicator');
    indicators.forEach(indicator => indicator.remove());
}

function getBotResponse(userMessage) {
    userMessage = userMessage.toLowerCase();
    conversationHistory.push({ sender: "user", message: userMessage });

    // تحديد إذا المستخدم ذكر مبلغ
    if (userMessage.match(/[0-9]+/)) {
        let num = parseInt(userMessage.match(/[0-9]+/)[0]);
        if (!userData.income) {
            userData.income = num;
            return "تم حفظ دخلك الشهري (" + num + " ريال). تريد خطة توفير بناءً على هذا الدخل؟";
        } else {
            return "ممتاز! يمكننا استخدام " + num + " ريال لتحقيق هدفك.";
        }
    }

    // إذا تكلم عن الميزانية
    if (userMessage.includes("ميزانية") || userMessage.includes("ادارة")) {
        if (!userData.income) {
            return "كم دخلك الشهري تقريبًا لأقدر أساعدك في وضع خطة ميزانية؟";
        }
        return "بناءً على دخلك " + userData.income + " ريال، أنصحك بتخصيص 50% للاحتياجات، 30% للأهداف، و20% للادخار.";
    }

    // إذا تكلم عن الادخار
    if (userMessage.includes("ادخار") || userMessage.includes("توفير")) {
        if (!userData.savingGoal) {
            return "ما هو هدفك من الادخار؟ (مثال: سيارة، زواج، منزل)";
        }
        return "لتحقيق هدفك في " + userData.savingGoal + " أنصحك بادخار 20% من دخلك.";
    }

    // إذا تكلم عن الأهداف
    if (userMessage.includes("سيارة") || userMessage.includes("زواج") || userMessage.includes("منزل")) {
        userData.savingGoal = userMessage.includes("سيارة") ? "شراء سيارة" : userMessage.includes("زواج") ? "الزواج" : "بناء منزل";
        return "ممتاز! ما هي ميزانيتك الشهرية المتاحة لتحقيق " + userData.savingGoal + "?";
    }

    // ألعاب بسيطة
    if (userMessage.includes("لعبة") || userMessage.includes("العاب") || userMessage.includes("تجربة")) {
        return "لعبة مالية: إذا دخلك 6000 ريال ومصروفاتك 4200 ريال، كم ستدخر شهرياً؟";
    }
    if (userMessage.includes("1800") || userMessage.includes("الف و ثمانمية")) {
        return "إجابة صحيحة! أنت تدخر 1800 ريال شهرياً 🎉";
    }

    // الرد الافتراضي
    return "أنا هنا لأساعدك في إدارة الميزانية، الادخار، ومحاكاة الأهداف المالية (سيارة، زواج، منزل). أخبرني أكثر عن وضعك المالي.";
}

function sendMessage() {
    var userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== "") {
        var userMessage = "<p><strong>أنت:</strong> " + userInput + "</p>";
        document.getElementById('chat-box').innerHTML += userMessage;
        document.getElementById('phone-chat-box').innerHTML += userMessage;
        document.getElementById('user-input').value = "";

        showTyping(); // === إظهار المؤشر هنا ===

        fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput, history: conversationHistory })
        })
        .then(response => response.json())
        .then(data => {
            hideTyping(); // === إخفاء المؤشر بعد الرد ===
            var botMessage = "<p><strong>مدرب الذكاء المالي:</strong> " + data.response + "</p>";
            document.getElementById('chat-box').innerHTML += botMessage;
            document.getElementById('phone-chat-box').innerHTML += botMessage;
            document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
            document.getElementById('phone-chat-box').scrollTop = document.getElementById('phone-chat-box').scrollHeight;
        })
        .catch(error => {
            hideTyping(); // حتى لو صار خطأ نخفيه
            console.error('خطأ في الاتصال بالخادم:', error);
            var botMessage = "<p><strong>مدرب الذكاء المالي:</strong> " + getBotResponse(userInput) + "</p>";
            document.getElementById('chat-box').innerHTML += botMessage;
            document.getElementById('phone-chat-box').innerHTML += botMessage;
        });
    }
}

function sendMessageFromPhone() {
    var userInput = document.getElementById('phone-user-input').value;
    if (userInput.trim() !== "") {
        var userMessage = "<p><strong>أنت:</strong> " + userInput + "</p>";
        document.getElementById('chat-box').innerHTML += userMessage;
        document.getElementById('phone-chat-box').innerHTML += userMessage;
        document.getElementById('phone-user-input').value = "";

        showTyping(); // === نفس الشي للجوال ===

        fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput, history: conversationHistory })
        })
        .then(response => response.json())
        .then(data => {
            hideTyping();
            var botMessage = "<p><strong>مدرب الذكاء المالي:</strong> " + data.response + "</p>";
            document.getElementById('chat-box').innerHTML += botMessage;
            document.getElementById('phone-chat-box').innerHTML += botMessage;
            document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
            document.getElementById('phone-chat-box').scrollTop = document.getElementById('phone-chat-box').scrollHeight;
        })
        .catch(error => {
            hideTyping();
            console.error('خطأ في الاتصال بالخادم:', error);
            var botMessage = "<p><strong>مدرب الذكاء المالي:</strong> " + getBotResponse(userInput) + "</p>";
            document.getElementById('chat-box').innerHTML += botMessage;
            document.getElementById('phone-chat-box').innerHTML += botMessage;
        });
    }
}

// إرسال عند الضغط على Enter
document.getElementById('user-input').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
document.getElementById('phone-user-input').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessageFromPhone();
    }
});
