import { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { PageHeading } from '../components/ui';

const intro =
  'Welcome to the assistant preview. Try a question about a policy, a claim, or a customer record.';
const preview =
  'This is a preview response. AI answers and document search will be available after the assistant is connected.';
const suggestions = [
  'What information is needed to submit a claim?',
  'How can I find an active policy?',
];
type Message = { role: 'assistant' | 'user'; text: string };

export function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: intro }]);
  const [prompt, setPrompt] = useState('');

  function send(value: string) {
    const text = value.trim();
    if (!text) return;
    setMessages((previous) => [
      ...previous,
      { role: 'user', text },
      { role: 'assistant', text: preview },
    ]);
    setPrompt('');
  }

  return (
    <>
      <PageHeading
        title="AI Assistant"
        description="Preview the workspace for policy and claims questions."
      />
      <section className="card chat">
        <div className="card-heading chat-heading">
          <div className="activity-item">
            <span className="metric-icon tone-blue">
              <Bot size={21} />
            </span>
            <div>
              <h2>PolicyMind Assistant</h2>
              <p>Conversation preview</p>
            </div>
          </div>
        </div>
        <div className="chat-log" role="log" aria-label="Conversation" aria-relevant="additions">
          {messages.map(({ role, text }, index) => (
            <div key={index} className={'chat-message ' + role}>
              <strong>{role === 'assistant' ? 'Assistant' : 'You'}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
        {messages.length === 1 && (
          <div className="chat-suggestions">
            {suggestions.map((question) => (
              <button key={question} className="button" onClick={() => send(question)}>
                <Sparkles size={16} />
                {question}
              </button>
            ))}
          </div>
        )}
        <form
          className="chat-form"
          onSubmit={(event) => {
            event.preventDefault();
            send(prompt);
          }}
        >
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask a question…"
            aria-label="Message"
            maxLength={1000}
          />
          <button type="submit" className="button primary" disabled={!prompt.trim()}>
            <Send size={17} /> Send
          </button>
        </form>
      </section>
    </>
  );
}
