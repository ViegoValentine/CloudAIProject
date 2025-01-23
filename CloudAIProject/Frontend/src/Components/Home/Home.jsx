import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Spinner from '../Spinner/Spinner'
import ReactMarkdown from 'react-markdown';
import { toast } from "react-toastify";

const Home = () => {
    const [message, setMessage] = useState('')
    const [messagesAndAnswers, setMessagesAndAnswers] = useState([])
    const [loading, setLoading] = useState(false)
    const [counter, setCounter] = useState(60)
    const [isCountdownActive, setIsCountdownActive] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isCountdownActive) {
            toast.warn(`Please wait ${counter} seconds until the cooldown finishes!`);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/ask", {
                message,
            });
            setMessagesAndAnswers((prev) => [
                ...prev,
                { message, answer: response.data.response },
            ]);
            setIsCountdownActive(true);
            setCounter(60);
        } catch (err) {
            console.log(err);
            toast.error("Server is busy. Please wait");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let timer;
        if (isCountdownActive && counter > 0) {
            timer = setInterval(() => {
                setCounter((prev) => prev - 1);
            }, 1000);
        } else if (counter === 0) {
            setIsCountdownActive(false);
        }
        return () => clearInterval(timer);
    }, [isCountdownActive, counter]);

    return (
    <div className="w-full flex flex-col items-center justify-center bg-project-background">
        <div className="h-16 w-full bg-project-foreground shadow-xl text-white p-4">
            <div className="flex">
                <h1 className="text-2xl font-bold">Better ChatGPT</h1>
            </div>
        </div>
        <div className="p-4 w-full lg:w-1/2">
        <div className="flex w-full p-6 bg-project-foreground rounded-lg shadow-lg text-white text-xl my-4 justify-center">
            <p>Our model has cooldown for 1 minute. It is forbidden to spam.</p>
        </div>
            <div className="w-full p-6 bg-project-foreground rounded-lg shadow-lg">
                <h1 className="text-2xl text-white font-bold text-center mb-4">Try Me!</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="">
                        <label htmlFor="message" className="block text-sm font-medium text-white">
                            Enter prompt to Chat GPT:
                        </label>
                        <textarea
                            id="message"
                            rows="1czy "
                            autoComplete="off"
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-project-blue"
                        ></textarea>
                    </div>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <button
                            type="submit"
                            className="w-full py-2 bg-white text-black font-semibold rounded-lg hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-red"
                        >
                            Send Prompt
                        </button>
                    )}
                </form>
            </div>
            {messagesAndAnswers.length > 0 && (
                <>
                    <div className="w-full">
                        <h2 className="text-2xl text-left text-white font-semibold my-2">Dialogue:</h2>
                    </div>
                    <div className="p-4 w-full h-96 bg-project-foreground rounded-lg shadow-lg text-white overflow-y-scroll">
                    <ul className="space-y-4">
                        {messagesAndAnswers.map((item, index) => (
                            <li key={index} className="space-y-2">
                                <div className="p-2 bg-zinc-900 font-bold rounded-md text-right">
                                    {item.message}
                                </div>
                                <div className="p-2 bg-zinc-800 font-bold rounded-md">
                                    <ReactMarkdown
                                        className="markdown-content"
                                        children={item.answer}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                </>
            )}
        </div>
    </div>
    )
}

export default Home
