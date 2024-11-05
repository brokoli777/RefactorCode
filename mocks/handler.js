import { http, HttpResponse } from 'msw'
 
export const handlers = [
    http.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', () => {
        return HttpResponse.json({
                candidates: [
                    {
                        content: {
                            parts: [
                                {
                                    text: JSON.stringify({
                                        explanation: "The provided code has been refactored to address several issues and improve readability.",
                                        refactoredCode: `
                                            var count = 0;
                                            var message = "Hello";
                                        `
                                    })
                                }
                            ],
                            role: "model"
                        },
                        finishReason: "STOP",
                        index: 0
                    }
                ],
        });
    }),    
];
