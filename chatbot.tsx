"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { marked } from "marked"
import { HelpCircle, Search, XIcon } from "lucide-react"

interface ChatbotProps {
  apiUrl: string
  boticon?: string
  chatboticon?: string
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center"
  theme: {
    primaryColor: string
    secondaryColor: string
    terriaryColor: string,
    fontColor: string
  }
}

const Chatbot: React.FC<ChatbotProps> = ({ apiUrl, boticon, chatboticon, position, theme }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isWelcomeMessageShown, setIsWelcomeMessageShown] = useState(false)
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
    const [showInviteMessage, setShowInviteMessage] = useState(true)
    const [isMaximized, setIsMaximized] = useState(false)
    const [messages, setMessages] = useState<
        Array<{
        type: "user" | "bot" | "loading" | "link"
        content: string
        agentType?: string
        metadata?: any
        }>
    >([])
    const [input, setInput] = useState("")
    const sessionId = useRef(`session_${Math.random().toString(36).substr(2, 9)}`)
    const chatContentRef = useRef<HTMLDivElement>(null)
    const lottiePlayerRef = useRef<HTMLElement | null>(null)
    const [parsedMessages, setParsedMessages] = useState<Record<number, string>>({})
  
    boticon="https://iili.io/3R4fj5J.md.png"
    chatboticon="https://iili.io/3R6TvMG.md.png"
    // Position styles based on the position prop
    const getPositionStyle = (isButton = false) => {
        const offset = isButton ? "35px" : "20px"
        switch (position) {
        case "bottom-right":
            return { bottom: offset, right: "10px" }
        case "bottom-left":
            return { bottom: offset, left: "10px" }
        default:
            return { bottom: offset, right: offset }
        }
    }

    // Show welcome message on initial load
    useEffect(() => {
        if (!isWelcomeMessageShown) {
        showWelcomeMessage()
        }
    }, [])

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatContentRef.current) {
        chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight
        }
    }, [messages])

    // Extract specific URLs from text
    const extractSpecificUrls = (text: string) => {
        const urlRegex = /https:\/\/csrbotdemo\.atheniaai\.com\/\?product=\d+/g
        return text.match(urlRegex)
    }

    // Fetch link metadata
    const fetchLinkMetadata = async (url: string) => {
        try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
        const data = await response.json()
        return data.data
        } catch (error) {
        console.error("Error fetching metadata:", error)
        return null
        }
    }

    // Show welcome message
    const showWelcomeMessage = async () => {
        try {
        setIsWaitingForResponse(true)
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({
            message: "",
            session_id: sessionId.current,
            }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setMessages([{ type: "bot", content: data.message, agentType: data.agent_type }])
        setIsWelcomeMessageShown(true)
        } catch (error) {
        console.error("Error:", error)
        setMessages([
            {
            type: "bot",
            content: "Sorry, there was an error connecting to the service.",
            agentType: "error",
            },
        ])
        setIsWelcomeMessageShown(true)
        } finally {
        setIsWaitingForResponse(false)
        }
    }

    // Send message
    const sendMessage = async () => {
        if (input.trim() === "" || isWaitingForResponse) return

        const userMessage = input.trim()
        setInput("")

        // Add user message to chat
        setMessages((prev) => [...prev, { type: "user", content: userMessage }])

        // Remove Lottie player if present
        if (lottiePlayerRef.current && chatContentRef.current?.contains(lottiePlayerRef.current)) {
        chatContentRef.current.removeChild(lottiePlayerRef.current)
        }

        // Add loading indicator
        setMessages((prev) => [...prev, { type: "loading", content: "" }])
        setIsWaitingForResponse(true)

        try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({
            message: userMessage,
            session_id: sessionId.current,
            }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Remove loading indicator and add bot message
        setMessages((prev) => {
            const filtered = prev.filter((msg) => msg.type !== "loading")
            return [
            ...filtered,
            {
                type: "bot",
                content: data.message,
                agentType: data.agent_type,
            },
            ]
        })

        // Check for URLs in the message
        const urls = extractSpecificUrls(data.message)
        if (urls && urls.length > 0) {
            // Add loading indicator for link preview
            setMessages((prev) => [...prev, { type: "loading", content: "" }])

            for (const url of urls) {
            const metadata = await fetchLinkMetadata(url)

            // Remove loading indicator and add link preview
            setMessages((prev) => {
                const filtered = prev.filter((msg) => msg.type !== "loading")
                if (metadata) {
                return [
                    ...filtered,
                    {
                    type: "link",
                    content: url,
                    metadata,
                    },
                ]
                }
                return filtered
            })
            }
        }
        } catch (error) {
        console.error("Error:", error)

        // Remove loading indicator and add error message
        setMessages((prev) => {
            const filtered = prev.filter((msg) => msg.type !== "loading")
            return [
            ...filtered,
            {
                type: "bot",
                content: "Sorry, there was an error processing your request.",
                agentType: "error",
            },
            ]
        })
        } finally {
        setIsWaitingForResponse(false)
        }
    }


    // Send message
    const sendPredefinedMessage  = async (message: string) => {
        // Add user message to chat
        setMessages((prev) => [...prev, { type: "user", content: message }])

        // Remove Lottie player if present
        if (lottiePlayerRef.current && chatContentRef.current?.contains(lottiePlayerRef.current)) {
        chatContentRef.current.removeChild(lottiePlayerRef.current)
        }

        // Add loading indicator
        setMessages((prev) => [...prev, { type: "loading", content: "" }])
        setIsWaitingForResponse(true)

        try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({
            message: message,
            session_id: sessionId.current,
            }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Remove loading indicator and add bot message
        setMessages((prev) => {
            const filtered = prev.filter((msg) => msg.type !== "loading")
            return [
            ...filtered,
            {
                type: "bot",
                content: data.message,
                agentType: data.agent_type,
            },
            ]
        })

        // Check for URLs in the message
        const urls = extractSpecificUrls(data.message)
        if (urls && urls.length > 0) {
            // Add loading indicator for link preview
            setMessages((prev) => [...prev, { type: "loading", content: "" }])

            for (const url of urls) {
            const metadata = await fetchLinkMetadata(url)

            // Remove loading indicator and add link preview
            setMessages((prev) => {
                const filtered = prev.filter((msg) => msg.type !== "loading")
                if (metadata) {
                return [
                    ...filtered,
                    {
                    type: "link",
                    content: url,
                    metadata,
                    },
                ]
                }
                return filtered
            })
            }
        }
        } catch (error) {
        console.error("Error:", error)

        // Remove loading indicator and add error message
        setMessages((prev) => {
            const filtered = prev.filter((msg) => msg.type !== "loading")
            return [
            ...filtered,
            {
                type: "bot",
                content: "Sorry, there was an error processing your request.",
                agentType: "error",
            },
            ]
        })
        } finally {
        setIsWaitingForResponse(false)
        }
    }

    // Handle input keydown
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        sendMessage()
        }
    }

    // Toggle chat window
    const toggleChat = () => {
        setIsOpen(!isOpen)
    }

    // Handle invite message selection
    const handleInviteSelection = (option: string) => {
        setIsOpen(true)
        setShowInviteMessage(false)
        
        // Add a small delay to ensure the chat window is open before sending the message
        setTimeout(() => {
        sendPredefinedMessage(option)
        }, 300)
    }

    // Toggle maximize/minimize
    const toggleMaximize = () => {
        setIsMaximized(!isMaximized)
    }

    const toggleRefresh = () => {
        setMessages([])
        setInput("")
        showWelcomeMessage()
    }

    useEffect(() => {
        const newParsedMessages: Record<number, string> = {}

        messages.forEach((message, index) => {
        if (message.type === "bot" && message.content) {
            try {
            newParsedMessages[index] = marked.parse(message.content) as string
            } catch (error) {
            console.error("Error parsing markdown:", error)
            newParsedMessages[index] = message.content
            }
        }
        })

        setParsedMessages(newParsedMessages)
    }, [messages])

    // CSS styles in the same file
    const styles = {
        chatWindow: (isOpen: any, isMaximized: any, theme: { secondaryColor: any; fontColor: any }, getPositionStyle: () => any) => ({
        width: isMaximized ? "90vw" : "320px", 
        height: isMaximized ? "90vh" : "70vh",
        maxWidth: isMaximized ? "800px" : "400px",
        maxHeight: isMaximized ? "90vh" : "700px",
        minWidth: "300px",
        minHeight: "400px",
        backgroundColor: theme.secondaryColor,
        color: theme.fontColor,
        position: "fixed",
        zIndex: 1001,
        display: isOpen ? "flex" : "none",
        opacity: isOpen ? 1 : 0,
        transition: "opacity 0.5s ease, width 0.3s ease, height 0.3s ease",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        borderRadius: "10px",
        flexDirection: "column",
        ...getPositionStyle(),
        // Responsive styles embedded directly
        '@media (max-width: 768px)': {
            width: '95vw',
            height: '70vh',
            maxWidth: 'none',
            bottom: '0',
            right: '0',
            left: '0',
            margin: '0 auto',
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
        },
        '@media (max-height: 600px)': {
            height: '85vh',
            minHeight: '300px',
        },
        '@media (max-width: 480px)': {
            width: '100vw',
            height: '80vh',
        }
        }),
    };

    const getInviteMessagePosition = (): React.CSSProperties => {
        const style = {
        position: "fixed", // TypeScript should now infer the correct type
        zIndex: 999, // Ensures compatibility with TS expectations
        } as React.CSSProperties; // Type assertion
    
        if (position === "bottom-right") {
        style.bottom = "120px";
        style.right = "50px";
        } else if (position === "bottom-left") {
        style.bottom = "110px";
        style.left = "35px";
        } else if (position === "top-right") {
        style.top = "110px";
        style.right = "35px";
        } else if (position === "top-left") {
        style.top = "110px";
        style.left = "35px";
        } else if (position === "center") {
        style.top = "calc(50% - 120px)";
        style.left = "50%";
        style.transform = "translateX(-50%)";
        }
    
        return style;
    };  

    return (
    <>
      {/* Invite Message */}
      {!isOpen && showInviteMessage && (
        <div 
            className="p-4 animate-fadeIn max-w-[90%] sm:max-w-[400px] mx-auto"
            style={{ ...getInviteMessagePosition() } as React.CSSProperties}
        >
            {/* Chat Invite Box */}
            <div className="flex justify-between items-center bg-white rounded-lg shadow-xl p-2 sm:p-4 gap-3 border border-black">
                <h3 className="m-0 text-sm sm:text-md font-medium">
                    Hi! What are you looking for?
                </h3>
                <button 
                    className="bg-transparent border-none cursor-pointer text-gray-500 leading-none hover:text-gray-700 transition"
                    onClick={() => setShowInviteMessage(false)}
                >
                    <XIcon size={20} color="black" />
                </button>
            </div>
            
            {/* Buttons Container */}
            <div className="flex justify-end sm:justify-start">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 w-40 sm:w-auto">
                    {/* Find a Product Button */}
                    <button 
                    onClick={() => handleInviteSelection("Find a product")}
                    className="flex items-center px-3 sm:px-4 py-2 bg-[#fff5f0] border border-black rounded-full shadow-lg cursor-pointer font-medium text-xs sm:text-sm md:text-base text-left hover:bg-[#ffe4d9] transition"
                    >
                    <Search size={18} className="mr-2" color="black" />
                        Find a product
                    </button>

                    {/* Ask a Question Button */}
                    <button 
                    onClick={() => handleInviteSelection("Ask a question")}
                    className="flex items-center px-3 sm:px-4 py-2 bg-[#fff5f0] border border-black rounded-full shadow-lg cursor-pointer font-medium text-xs sm:text-sm md:text-base text-left hover:bg-[#ffe4d9] transition"
                    >
                    <HelpCircle size={18} className="mr-2" color="black" />
                        Ask a question
                    </button>
                </div>
            </div>
        </div>
        )}
      {/* Chat Button */}
      {!isOpen && (
        <button
          style={{
            position: "fixed",
            width: "110px",
            height: "100px",
            zIndex: 1000,
            padding: 0,
            border: "none",
            background: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            ...getPositionStyle(true),
          }}
          onClick={toggleChat}
        >
          <div
            style={{
              animation: "float 3s ease-in-out infinite",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={boticon || "/placeholder.svg"}
              alt="Chatbot"
              className="rounded-full shadow-xl "
              style={{
                width: "70px",
                height: "70px",
                transition: "transform 0.3s ease",
              }}
            />
          </div>
        </button>
      )}

      {/* Chat Window */}
      <div style={styles.chatWindow(isOpen, isMaximized, theme, getPositionStyle)} className="chat-window">
        {/* Top Bar */}
        <div className="h-[50px] flex items-center justify-between px-3 rounded-t-lg" style={{ backgroundColor: theme.primaryColor }}>
            {/* Chat Title */}
            <span className="text-[16px] font-bold" style={{ color: theme.secondaryColor }}>
            SmartShop AI
            </span>

            {/* Buttons Wrapper (Align Icons Properly) */}
            <div className="flex items-center gap-5">
            {/* Maximize/Minimize Button */}
            <button
                className="cursor-pointer bg-transparent border-none flex items-center"
                onClick={toggleRefresh}
            >
                <img src="https://iili.io/3R6lEMP.md.png" alt="Maximize/Minimize" className="w-[20px] h-[20px]" />
            </button>

            <button
                className="cursor-pointer bg-transparent border-none flex items-center"
                onClick={toggleMaximize}
            >
                <img src="https://iili.io/3R6OIm7.png" alt="Maximize/Minimize" className="w-[22px] h-[22px]" />
            </button>

            {/* Close Button */}
            <button
                className="cursor-pointer bg-transparent border-none flex items-center"
                onClick={toggleChat}
            >
                <XIcon size={24} style={{color: theme.secondaryColor}} onClick={() => setShowInviteMessage(false)}/>
            </button>
            </div>
        </div>

        {/* Chat Content */}
        <div
          ref={chatContentRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {messages.map((message, index) => {
            if (message.type === "user") {
              return (
            <div 
              key={index} 
              className={`mb-2.5 bg-gray-100 p-2.5 rounded-xl ml-auto break-words border border-gray-300 ${
                message.content.length <= 20 ? 'w-auto' : 'max-w-[80%]'
              }`}
              style={{
                display: 'block', // Ensures the message stays on the correct side
                width: message.content.length <= 20 ? 'fit-content' : undefined, // Makes short messages fit content
              }}
            >
              {message.content}
            </div>
              )
            } else if (message.type === "bot") {
              return (
                <div key={index} className="flex items-start mb-2.5 gap-0">
                  <img
                    src={chatboticon || "/placeholder.svg"}
                    alt="Bot" className="w-9 h-9 min-w-[33px] mt-2"/>
                  <div>
                    <div className="bg-blue-100/30 p-2.5 rounded-xl w-[80%] break-words border border-blue-200"
                      dangerouslySetInnerHTML={{ __html: parsedMessages[index] || message.content }}
                    />
                  </div>
                </div>
              )
            } else if (message.type === "loading") {
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                    gap: "0px",
                  }}
                >
                  <img
                    src={chatboticon || "/placeholder.svg"}
                    alt="Bot"
                    style={{
                      width: "35px",
                      height: "35px",
                      minWidth: "33px",
                      marginTop: "8px",
                    }}
                  />
                  <div>
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 120 30"
                      xmlns="http://www.w3.org/2000/svg"
                      fill={theme.primaryColor}
                    >
                      <circle cx="15" cy="15" r="15">
                        <animate
                          attributeName="r"
                          from="15"
                          to="15"
                          begin="0s"
                          dur="0.8s"
                          values="15;9;15"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="fill-opacity"
                          from="1"
                          to="1"
                          begin="0s"
                          dur="0.8s"
                          values="1;.5;1"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle cx="60" cy="15" r="9" fillOpacity="0.3">
                        <animate
                          attributeName="r"
                          from="9"
                          to="9"
                          begin="0s"
                          dur="0.8s"
                          values="9;15;9"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="fill-opacity"
                          from="0.5"
                          to="0.5"
                          begin="0s"
                          dur="0.8s"
                          values=".5;1;.5"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle cx="105" cy="15" r="15">
                        <animate
                          attributeName="r"
                          from="15"
                          to="15"
                          begin="0s"
                          dur="0.8s"
                          values="15;9;15"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="fill-opacity"
                          from="1"
                          to="1"
                          begin="0s"
                          dur="0.8s"
                          values="1;.5;1"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>
                  </div>
                </div>
              )
            } else if (message.type === "link") {
              return (
              <div
                key={index}
                className="flex items-start mb-2.5 gap-0"
              >
                <img
                  src={chatboticon || "/placeholder.svg"}
                  alt="Bot"
                  className="w-9 h-9 min-w-[33px] mt-2"
                />
                <div
                  className="mb-2.5 bg-gray-50 p-4 rounded-lg max-w-[77%] mr-auto border border-gray-300 shadow-md cursor-pointer flex items-center"
                  onClick={() => window.open(message.metadata?.url, "_blank")}
                >
                  {message.metadata?.logo && (
                    <img
                      src={message.metadata.logo.url || "/placeholder.svg"}
                      alt="Logo"
                      className="w-10 h-10 rounded-full mr-2.5"
                    />
                  )}
                  <div>
                    {message.metadata?.title && (
                      <div className="font-bold text-base text-gray-800 mb-1">
                        {message.metadata.title}
                      </div>
                    )}
                    {message.metadata?.description && (
                      <div className="text-sm text-gray-600 mb-1">
                        {message.metadata.description}
                      </div>
                    )}
                    <a
                      href={message.metadata?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 no-underline text-xs mt-1.5"
                    >
                      {message.metadata?.url ? new URL(message.metadata.url).hostname : ""}
                    </a>
                  </div>
                </div>
              </div>
              )
            }
            return null
          })}
        </div>

        {/* Chat Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
        >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 py-2 px-4 border border-solid border-gray-300 rounded-full outline-none text-sm bg-white shadow-sm"
        />
          <button
            onClick={sendMessage}
            style={{
              backgroundColor: theme.primaryColor,
              border: "none",
              padding: "6px 13px",
              borderRadius: "18px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            <img
                src="https://iili.io/3R6Ssbp.png"
                alt="Send"
                style={{
                    width: "28px",
                    height: "25px",
                    marginRight: "2px",
                }}
            />
          </button>
        </div>
      </div>

      {/* Keyframes for float animation */}
      <style>{`        
        .typing-dot {
          animation: typing 1.5s infinite;
          opacity: 0.3;
        }
        .typing-dot:nth-child(1) {
          animation-delay: 0s;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.5s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 1s;
        }
        
        @keyframes typing {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
          }
        }
      `}</style>
    </>
  )
}

export default Chatbot

