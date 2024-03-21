interface Content {
    type: string;
    text?: string;
    image_url?: any;
    source?: any;
}

interface Message {
    role: string;
    content: any;
}

interface ChatRequest {
    model: string;
    messages: Message[];
    stream?: boolean;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    [key: string]: any; // refined parameters
}

// class RequestData {
//   model: string;
//   messages: Message[];
//   stream: boolean;
//   max_tokens: number;

//   constructor(data: RequestData) {
//     this.model = data.model;
//     this.messages = data.messages;
//     this.stream = data.stream;
//     this.max_tokens = data.max_tokens;
//   }
// }

export { ChatRequest };
