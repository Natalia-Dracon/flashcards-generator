const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const cardsContainer = document.getElementById("cardsContainer");

const OPENAI_API_KEY = "sk-proj-sqO6WdtKxjWSVniVzadLozDrQAzOMCWjKHKu3XxaAnEpy1A9O4OLZ9SUZenPOl1WjA2rxYy0IRT3BlbkFJ2wjoV17Cn-nrr7NZG_vAaiXL8TXwi4Sv1wj4v875qDPJYBmTVmwPoyvtKM1yq6Ov6UcqQP15MA_API_KEY";

generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert("Введите тему для карточек!");
        return;
    }

    cardsContainer.innerHTML = "<p>Генерируем карточки...</p>";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Ты создаешь учебные карточки. Формируй ровно 10 карточек по теме, в формате JSON: [{\"question\": \"\", \"answer\": \"\"}, ...]"
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 1000
            })
        });

        const data = await response.json();
        const text = data.choices[0].message.content;

        let cards = [];
        try {
            cards = JSON.parse(text);
        } catch (e) {
            console.error("Ошибка парсинга JSON:", e);
            cardsContainer.innerHTML = "<p>Ошибка генерации карточек. Попробуйте уточнить тему.</p>";
            return;
        }

        cardsContainer.innerHTML = "";

        cards.forEach(card => {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card";

            cardDiv.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"><strong>Вопрос:</strong><br>${card.question}</div>
                    <div class="card-back"><strong>Ответ:</strong><br>${card.answer}</div>
                </div>
            `;

            cardDiv.addEventListener("click", () => {
                cardDiv.classList.toggle("flipped");
            });

            cardsContainer.appendChild(cardDiv);
        });

    } catch (error) {
        console.error("Ошибка запроса к OpenAI:", error);
        cardsContainer.innerHTML = "<p>Ошибка запроса к ИИ. Попробуйте позже.</p>";
    }
});
