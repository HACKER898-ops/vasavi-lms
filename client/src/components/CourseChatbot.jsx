import React, { useState, useEffect, useRef, useContext } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const CourseChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { allCourses, currency } = useContext(AppContext);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    role: 'assistant',
                    content: `Hello! 👋 I'm your course guide assistant. I can help you find the perfect course based on your interests, skill level, and career goals. 

I have information about ${allCourses.length} courses available on our platform. How can I help you today?

You can ask me things like:
• "What courses do you offer?"
• "I want to learn web development"
• "Show me beginner courses"
• "What's the best course for React?"`,
                },
            ]);
        }
    }, [isOpen, allCourses.length]);

    const prepareCoursesContext = () => {
        if (!allCourses || allCourses.length === 0) {
            return 'No courses available at the moment.';
        }

        const coursesInfo = allCourses.map((course, index) => {
            const numLectures = course.courseContent?.reduce(
                (total, chapter) => total + (chapter.chapterContent?.length || 0),
                0
            ) || 0;

            return `
Course ${index + 1}:
- Title: ${course.courseTitle}
- Description: ${course.courseDescription || 'No description available'}
- Category: ${course.category || 'General'}
- Level: ${course.courseLevel || 'All levels'}
- Price: ${currency}${course.coursePrice || 0} ${course.discount > 0 ? `(${course.discount}% discount)` : ''}
- Educator: ${course.educator?.name || 'Expert Instructor'}
- Total Lectures: ${numLectures}
- Chapters: ${course.courseContent?.length || 0}
- Rating: ${course.courseRatings?.length > 0 ? `${(course.courseRatings.reduce((sum, r) => sum + r.rating, 0) / course.courseRatings.length).toFixed(1)}/5` : 'New course'}
`;
        }).join('\n---\n');

        return coursesInfo;
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = { role: 'user', content: inputMessage };
        setMessages((prev) => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            
            if (!apiKey || apiKey === 'your_gemini_api_key_here') {
                throw new Error('Gemini API key not configured. Please add your API key to the .env file.');
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const coursesContext = prepareCoursesContext();
            
            const systemPrompt = `You are a helpful and friendly course advisor for an online learning platform called Edemy LMS. Your role is to help students find the best courses based on their needs, interests, and goals.

AVAILABLE COURSES:
${coursesContext}

INSTRUCTIONS:
- Be conversational, friendly, and encouraging
- Recommend specific courses from the list above based on user queries
- If asked about pricing, always mention the currency symbol (${currency})
- Highlight course features like lectures, chapters, and ratings when relevant
- If a user asks about topics not covered in our courses, politely suggest the closest alternatives
- Encourage users to explore multiple courses if they're unsure
- Always be supportive of their learning journey
- Keep responses concise but informative (2-3 paragraphs max)
- Use emojis sparingly to keep a professional yet friendly tone

Remember: You can only recommend courses from the list provided above. If someone asks about a course we don't offer, be honest and suggest similar alternatives from our catalog.`;

            const chat = model.startChat({
                history: messages
                    .filter((msg) => msg.role !== 'assistant' || !msg.content.includes('Hello! 👋'))
                    .map((msg) => ({
                        role: msg.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: msg.content }],
                    })),
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7,
                },
            });

            const result = await chat.sendMessage(systemPrompt + '\n\nUser query: ' + inputMessage);
            const response = await result.response;
            const botMessage = {
                role: 'assistant',
                content: response.text(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            const errorMessage = {
                role: 'assistant',
                content: `I apologize, but I'm having trouble connecting right now. ${error.message || 'Please try again later.'} 

In the meantime, feel free to browse all our ${allCourses.length} available courses on the platform!`,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50"
                    aria-label="Open course chatbot"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Course Assistant</h3>
                                <p className="text-xs text-blue-100">Powered by Gemini AI</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded transition-colors"
                            aria-label="Close chatbot"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        message.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-800 border border-gray-200'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about courses..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseChatbot;
