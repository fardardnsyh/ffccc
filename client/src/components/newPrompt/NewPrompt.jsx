import { useEffect, useRef, useState } from 'react';
import './newPrompt.css';
import { IKImage } from 'imagekitio-react';
import Upload from '../upload/Upload';
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

const NewPrompt = ({data}) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const endRef = useRef(null);
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
    });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "hello, I have 2 dogs in my house" }],
            },
            {
                role: "user",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
        ],
        generationConfig: {
            // maxOutputTokens: 100,
        },
    });
    

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [data, question, answer, img.dbData]);

    const queryClient = useQueryClient();



const mutation = useMutation({
    mutationFn:() =>{
        return  fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,{
            method:"PUT",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
                
            },
            body: JSON.stringify({question: question.length ? question : undefined,
                answer,
                img: img.dbData?.filePath || undefined,


            }),
        }).then((res) =>res.json());
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Chats', data._id] })
            .then(() => {
                setQuestion("");
                setAnswer("");
                setImage({
                    isLoading: false,
                    error: "",
                    dbData: {},
                    aiData: {},
                });
            });
    },
    onError: (error) => {
        console.log(error);
    }
});

    const add = async (text , isInitial) => {
        if(!isInitial) setQuestion(text);
        try {
            setImg((prev) => ({ ...prev, isLoading: true }));
            setQuestion(text);

            const result = await chat.sendMessageStream(Object.keys(img.aiData).length ? [img.aiData, text] : [text]);
            let accumulatedText = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                accumulatedText += chunkText;
                setAnswer(accumulatedText);
            }

            mutation.mutate();
        } catch (error) {
            console.error("Error sending message:", error);

        } 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if (!text) return;

        add(text,false);

    };
    
    useEffect(()=>{
       if(data?.history?.length === 1) {
        add(data.history[0].parts[0].text,true);
       }
    },[]);

    return (
        <>
            {img.isLoading && <div className=''>Loading...</div>}
            {img.dbData?.filePath && (
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={img.dbData?.filePath}
                    width="380"
                    transformation={[{ width: 380 }]}
                />
            )}
            {question && <div className='message user'>{question}</div>}
            {answer && (
                <div className='message'>
                    <Markdown>{answer}</Markdown>
                </div>
            )}

            <div className="endChat" ref={endRef}></div>

            <form className='newForm' onSubmit={handleSubmit}>
                <Upload setImg={setImg} />
                <input type="text" name="text" placeholder='Ask anything' />
                <button>
                    <img src="/arrow.png" alt="Submit" />
                </button>
            </form>
        </>
    );
};

export default NewPrompt;
